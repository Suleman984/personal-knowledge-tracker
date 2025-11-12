package models

import "time"

type User struct {
	ID        int64     `db:"id" json:"id"`
	NAME      string    `db:"name" json:"name"`
	EMAIL     string    `db:"email" json:"email"`
	PASSWORD  string    `db:"password" json:"-"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}
