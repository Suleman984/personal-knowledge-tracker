package main

import (
	"backend/internal/content"
	"backend/internal/db"
	"backend/internal/reminder"
	reminderroutes "backend/internal/routes/reminderRoutes"
	summaryroutes "backend/internal/routes/summaryRoutes"
	userroutes "backend/internal/routes/userRoutes"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	fmt.Println("Starting server...")
	db.CONNECTDB()

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "chrome-extension://*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true, // ✅ critical
		AllowOriginFunc: func(origin string) bool {
			// ✅ allow Chrome extension + local frontend
			return origin == "http://localhost:3000" || strings.HasPrefix(origin, "chrome-extension://")
		},
		MaxAge: 12 * time.Hour,
	}))

	userroutes.SetupRoutes(r)
	content.SetupRoutes(r)
	reminderroutes.SetupRoutes(r)
	summaryroutes.SetupRoutes(r)
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "OK",
		})
	})

	r.SetTrustedProxies(nil)
	reminder.StartReminderWorker()
	port := "8080"
	log.Printf("Server running on port %s", port)
	r.Run(":" + port)
}
