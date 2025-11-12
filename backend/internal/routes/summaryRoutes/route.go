package summaryroutes

import (
	"backend/internal/middleware"
	"backend/internal/summarizer"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	// Setup summary-related routes here
	group := r.Group("/api/summarize")
	group.Use(middleware.AuthMiddleware())
	group.POST("", summarizer.SummarizeContent)
	// Add middleware if needed, e.g., authentication
	// group.Use(middleware.AuthMiddleware())
}
