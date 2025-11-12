package content

import (
	"backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	group := r.Group("/contents")
	group.Use(middleware.AuthMiddleware())
	group.GET("", ListContents)
	group.GET("/", ListContents)
	group.PUT("/:id", UpdateContent)
	group.DELETE("/:id", DeleteContent)

}
