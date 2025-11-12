package models

import "time"

type Reminder struct {
	ID          int       `db:"id" json:"id"`
	UserID      int       `db:"user_id" json:"user_id"`
	ContentID   int       `db:"content_id" json:"content_id"`
	ScheduleFor time.Time `db:"schedule_for" json:"schedule_for"`
	IsSet       bool      `db:"is_set" json:"is_set"`
	IsSent      bool      `db:"is_sent" json:"is_sent"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
}
