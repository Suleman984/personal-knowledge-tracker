package summarizer

import (
	"backend/internal/db"
	"backend/internal/models"
	"backend/internal/reminder"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-shiori/go-readability"
)

type SummarizeInput struct {
	URL  string `json:"url"`
	Text string `json:"text"`
}

func SummarizeContent(c *gin.Context) {
	var input SummarizeInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if input.URL == "" && input.Text == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Provide URL or text"})
		return
	}

	// ✅ Get user ID safely
	userIDVal, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	var userID int
	switch v := userIDVal.(type) {
	case int:
		userID = v
	case int64:
		userID = int(v)
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID type"})
		return
	}

	// 🧠 Fetch content from URL or use text
	var (
		inputText string
		title     string
	)
	if input.URL != "" {
		req, err := http.NewRequest("GET", input.URL, nil)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid URL"})
			return
		}
		req.Header.Set("User-Agent", "PersonalKnowledgeTrackerBot/1.0 (+http://localhost:3000)")

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to fetch URL"})
			return
		}
		defer resp.Body.Close()

		u, _ := url.Parse(input.URL)
		article, err := readability.FromReader(resp.Body, u)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to extract readable content"})
			return
		}
		inputText = article.TextContent
		title = article.Title
	} else {
		inputText = input.Text
		title = "User Text Summary"
	}

	if len(inputText) < 50 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Content too short to summarize"})
		return
	}

	// 🧾 Build summarization prompt
	prompt := fmt.Sprintf(`Generate a structured summary with this format:
Title: <title>
Category: <category>
Key Points:
1.
2.
3.
4.
5.
Summary Paragraph:
<summary>

Content:
%s`, inputText)

	fmt.Println("🧠 Sending to Gemini API...")
	summary, err := SummarizeWithGemini(prompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate summary"})
		return
	}
	fmt.Println("✅ Summary generated successfully.")

	// 🔠 Optional: try extracting a better title from Gemini’s response
	title, category := extractTitleAndCategory(summary, title)

	query := `
	INSERT INTO contents (user_id, title, content_type, source_url, raw_text, summary, category)
	VALUES ($1, $2, 'ai_summary', $3, $4, $5, $6)
	RETURNING id, created_at;
`
	var content models.Content
	err = db.DB.QueryRowx(query, userID, title, input.URL, inputText, summary, category).
		Scan(&content.ID, &content.CreatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save content"})
		return
	}

	// 🕒 Schedule reminders
	scheduleIntervals := []int{0, 2, 3}
	for _, days := range scheduleIntervals {
		scheduleTime := time.Now().Add(time.Duration(days) * 24 * time.Hour)
		_, err := db.DB.Exec(`
			INSERT INTO reminders (user_id, content_id, schedule_for, is_set, is_sent)
			VALUES ($1, $2, $3, TRUE, FALSE)
		`, userID, content.ID, scheduleTime)
		if err != nil {
			log.Println("Failed to create reminder:", err)
		}
	}

	// 📧 Send first email
	var userEmail string
	if err := db.DB.QueryRowx(`SELECT email FROM users WHERE id=$1`, userID).Scan(&userEmail); err == nil {
		go reminder.SendReminderEmail(userEmail, title, content.CreatedAt.Format("2006-01-02 15:04"))
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Summary created successfully",
		"data":    content,
	})
}
func extractTitleAndCategory(summary, fallbackTitle string) (string, string) {
	var title, category string

	lines := strings.Split(summary, "\n")
	for _, line := range lines {
		line = strings.TrimSpace(strings.ReplaceAll(line, "\r", "")) // clean CRLFs

		if title == "" && strings.HasPrefix(strings.ToLower(line), "title:") {
			title = strings.TrimSpace(strings.TrimPrefix(line, "Title:"))
			continue
		}

		if category == "" && strings.HasPrefix(strings.ToLower(line), "category:") {
			category = strings.TrimSpace(strings.TrimPrefix(line, "Category:"))
		}

		if title != "" && category != "" {
			break
		}
	}

	if title == "" {
		title = fallbackTitle
	}
	if category == "" {
		category = "General"
	}

	return title, category
}
