package userroutes

import (
	"backend/internal/auth"
	"backend/internal/db"
	"backend/internal/middleware"
	"backend/internal/models"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	// Setup user-related routes here
	group := r.Group("/users")

	group.POST("/signup", auth.SignUp)
	group.POST("/login", auth.Login)
	group.POST("/logout", auth.Logout)
	protected := group.Group("/me")
	protected.Use(middleware.AuthMiddleware())
	protected.GET("/me", func(c *gin.Context) {
		userEmail, _ := c.Get("user_email")
		var user models.User
		err := db.DB.Get(&user, "SELECT * FROM users WHERE email=$1", userEmail)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to fetch user info"})
			return
		}

		c.JSON(200, gin.H{"message": "Protected user info", "user": user})
	})
	protected.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Protected user info"})
	})
}
