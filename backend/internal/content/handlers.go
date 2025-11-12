package content

import (
	"backend/internal/db"
	"backend/internal/middleware"
	"backend/internal/models"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// 🧠 Search & Filter contents for logged-in user
func ListContents(c *gin.Context) {
	userID, err1 := middleware.GetUserID(c)
	if err1 != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or missing user ID"})
		return
	}
	queryParam := strings.TrimSpace(c.Query("query"))
	category := strings.TrimSpace(c.Query("category"))

	var contents []models.Content
	var args []interface{}
	baseQuery := `
		SELECT * FROM contents
		WHERE user_id = $1
	`
	args = append(args, userID)

	// Add filters dynamically
	if queryParam != "" {
		baseQuery += fmt.Sprintf(" AND (title ILIKE $%d OR summary ILIKE $%d OR raw_text ILIKE $%d)", len(args)+1, len(args)+1, len(args)+1)
		args = append(args, "%"+queryParam+"%")
	}

	if category != "" {
		baseQuery += fmt.Sprintf(" AND category ILIKE $%d", len(args)+1)
		args = append(args, "%"+category+"%")
	}

	baseQuery += " ORDER BY created_at DESC"

	err := db.DB.Select(&contents, baseQuery, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch contents"})
		return
	}

	if contents == nil {
		contents = []models.Content{}
	}

	c.JSON(http.StatusOK, gin.H{
		"count":    len(contents),
		"contents": contents,
	})

}

func UpdateContent(c *gin.Context) {
	userID, err1 := middleware.GetUserID(c)
	if err1 != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or missing user ID"})
		return
	}
	contentID := c.Param("id")
	var input struct {
		Title    string `json:"title"`
		Body     string `json:"body"`
		Category string `json:"category"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	query := `
		UPDATE contents
		SET title=$1, summary=$2, category=$3, updated_at=NOW()
		WHERE id=$4 AND user_id=$5
		RETURNING id;
	`
	var updatedID int64
	err := db.DB.QueryRowx(query, input.Title, input.Body, input.Category, contentID, userID).Scan(&updatedID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update content"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Content updated successfully"})

}
func DeleteContent(c *gin.Context) {
	userID, err1 := middleware.GetUserID(c)
	if err1 != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or missing user ID"})
		return
	}
	contentID := c.Param("id")

	_, err := db.DB.Exec("DELETE FROM contents WHERE id=$1 AND user_id=$2", contentID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete content"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Content deleted successfully"})
}
