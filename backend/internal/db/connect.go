package db

import (
	"fmt"
	"log"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
)

var DB *sqlx.DB

func CONNECTDB() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	dbURL := os.Getenv("DB_URL")
	fmt.Println("DB_URL:", dbURL)
	if dbURL == "" {
		log.Fatal("DB_URL not set in .env file")
	}
	db, err := sqlx.Open("pgx", dbURL)
	fmt.Println("Database connection attempt...")
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	err = db.Ping()
	fmt.Println("Pinging database...")
	if err != nil {
		log.Fatal("Failed to ping database:", err)
	}
	fmt.Println("Database ping successful")
	DB = db
	fmt.Println("DB variable assigned")

	log.Println("Connected to database successfully")

}
