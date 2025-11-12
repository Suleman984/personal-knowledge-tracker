package middleware

import (
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetUserID extracts and safely converts user_id from context to int
func GetUserID(c *gin.Context) (int, error) {
	userID, exists := c.Get("user_id")
	if !exists {
		return 0, fmt.Errorf("user_id not found in context")
	}

	// convert any type to int safely
	switch v := userID.(type) {
	case int:
		return v, nil
	case float64:
		return int(v), nil
	case string:
		parsed, err := strconv.Atoi(v)
		if err != nil {
			return 0, fmt.Errorf("invalid user_id format")
		}
		return parsed, nil
	default:
		// fallback: stringify then parse
		parsed, err := strconv.Atoi(fmt.Sprintf("%v", v))
		if err != nil {
			return 0, fmt.Errorf("cannot parse user_id")
		}
		return parsed, nil
	}
}
