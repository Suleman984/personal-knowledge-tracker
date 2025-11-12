package reminder

import (
	"backend/internal/db"
	"log"
	"time"
)

func StartReminderWorker() {
	ticker := time.NewTicker(1 * time.Hour) // check every hour
	go func() {
		for range ticker.C {
			checkAndSendReminders()
		}
	}()
}

func checkAndSendReminders() {
	now := time.Now()

	var reminders []struct {
		ID          int
		UserID      int
		ContentID   int
		UserEmail   string
		Title       string
		ScheduleFor time.Time
	}

	query := `
	SELECT r.id, r.user_id, r.content_id, u.email AS user_email, c.title, r.schedule_for
	FROM reminders r
	JOIN users u ON r.user_id = u.id
	JOIN contents c ON r.content_id = c.id
	WHERE r.schedule_for <= $1 AND r.is_set = TRUE AND r.is_sent = FALSE
	`

	err := db.DB.Select(&reminders, query, now)
	if err != nil {
		log.Println("Error fetching reminders:", err)
		return
	}

	for _, r := range reminders {
		err := SendReminderEmail(r.UserEmail, r.Title, r.ScheduleFor.Format("2006-01-02 15:04"))
		if err != nil {
			log.Println("Failed to send reminder:", err)
			continue
		}

		// ✅ Mark this reminder as sent
		_, err = db.DB.Exec(`UPDATE reminders SET is_sent = TRUE WHERE id = $1`, r.ID)
		if err != nil {
			log.Println("Failed to mark reminder as sent:", err)
			continue
		}

		log.Printf("✅ Reminder sent to %s for '%s'", r.UserEmail, r.Title)

		// ✅ Automatically schedule the next reminder in sequence
		nextSchedule := getNextReminderTime(r.ScheduleFor)
		if !nextSchedule.IsZero() {
			_, err := db.DB.Exec(`
				INSERT INTO reminders (user_id, content_id, schedule_for, is_set)
				VALUES ($1, $2, $3, TRUE)
			`, r.UserID, r.ContentID, nextSchedule)
			if err != nil {
				log.Println("Failed to create next reminder:", err)
			} else {
				log.Printf("📅 Next reminder scheduled for %s", nextSchedule.Format("2006-01-02 15:04"))
			}
		}
	}
}

// Sequence: 2 days → 3 days → 8 days → 11 days
func getNextReminderTime(prev time.Time) time.Time {
	now := time.Now()
	diff := now.Sub(prev).Hours() / 24

	switch {
	case diff < 2:
		return now.Add(2 * 24 * time.Hour)
	case diff < 3:
		return now.Add(3 * 24 * time.Hour)
	// case diff < 8:
	// 	return now.Add(8 * 24 * time.Hour)
	// case diff < 11:
	// 	return now.Add(11 * 24 * time.Hour)
	default:
		// After 11 days, stop scheduling automatically
		return time.Time{}
	}
}
