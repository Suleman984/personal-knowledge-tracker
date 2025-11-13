package reminder

import (
	"backend/internal/db"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

func ListReminders(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var reminders []struct {
		ID          int       `db:"id" json:"id"`
		UserID      int       `db:"user_id" json:"user_id"`
		ContentID   int       `db:"content_id" json:"content_id"`
		Title       string    `db:"title" json:"title"`
		ScheduleFor time.Time `db:"schedule_for" json:"schedule_for"`
		IsSet       bool      `db:"is_set" json:"is_set"`
		IsSent      bool      `db:"is_sent" json:"is_sent"`
		CreatedAt   time.Time `db:"created_at" json:"created_at"`
	}

	query := `
	SELECT 
		r.id,
		r.user_id,
		r.content_id,
		c.title,
		r.schedule_for,
		r.is_set,
		r.is_sent,
		r.created_at
	FROM reminders r
	JOIN contents c ON r.content_id = c.id
	WHERE r.user_id = $1
	ORDER BY r.schedule_for ASC
	`

	err := db.DB.Select(&reminders, query, userID)
	if err != nil {
		fmt.Println("❌ Error fetching reminders:", err)
		c.JSON(500, gin.H{"error": "Failed to fetch reminders", "details": err.Error()})
		return
	}

	c.JSON(200, gin.H{"reminders": reminders})
}

func ToggleReminder(c *gin.Context) {
	userID, _ := c.Get("user_id")
	id := c.Param("id")

	var body struct {
		IsSet bool `json:"is_set"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	_, err := db.DB.Exec(`
		UPDATE reminders
		SET is_set = $1
		WHERE id = $2 AND user_id = $3
	`, body.IsSet, id, userID)

	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to update reminder status"})
		return
	}

	c.JSON(200, gin.H{"message": "Reminder status updated"})
}
func EditReminder(c *gin.Context) {
	userID, _ := c.Get("user_id")
	id := c.Param("id")

	var body struct {
		ScheduleFor time.Time `json:"schedule_for"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	_, err := db.DB.Exec(`
		UPDATE reminders
		SET schedule_for = $1
		WHERE id = $2 AND user_id = $3
	`, body.ScheduleFor, id, userID)

	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to update reminder"})
		return
	}

	c.JSON(200, gin.H{"message": "Reminder updated successfully"})
}
func DeleteReminder(c *gin.Context) {
	userID, _ := c.Get("user_id")
	id := c.Param("id")

	_, err := db.DB.Exec("DELETE FROM reminders WHERE id=$1 AND user_id=$2", id, userID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to delete reminder"})
		return
	}

	c.JSON(200, gin.H{"message": "Reminder deleted"})
}
func DeleteAllRemindersForContent(userID, contentID int) error {
	_, err := db.DB.Exec("DELETE FROM reminders WHERE user_id=$1 AND content_id=$2", userID, contentID)
	return err
}
