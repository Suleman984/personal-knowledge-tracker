package models

import "time"

type Content struct {
	ID          int       `db:"id" json:"id"`
	UserID      int       `db:"user_id" json:"user_id"`
	Title       string    `db:"title" json:"title"`
	ContentType string    `db:"content_type" json:"content_type"`
	SourceURL   string    `db:"source_url" json:"source_url"`
	RawText     string    `db:"raw_text" json:"raw_text"`
	Summary     string    `db:"summary" json:"summary"`
	Category    string    `db:"category" json:"category"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
	UpdatedAt   time.Time `db:"updated_at" json:"updated_at"`
}
