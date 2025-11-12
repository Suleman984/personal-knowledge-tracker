package reminderroutes

import (
	"backend/internal/middleware"
	"backend/internal/reminder"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	group := r.Group("/api/reminders")
	group.Use(middleware.AuthMiddleware())

	group.GET("/", reminder.ListReminders)
	group.PUT("/:id/toggle", reminder.ToggleReminder)
	group.PUT("/:id/edit", reminder.EditReminder)
	group.DELETE("/:id", reminder.DeleteReminder)
	// group.DELETE("/content/:content_id", reminder.DeleteAllRemindersForContent)
}
