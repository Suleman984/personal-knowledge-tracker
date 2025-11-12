package auth

import (
	"backend/internal/db"
	"backend/internal/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SignUp(c *gin.Context) {
	fmt.Println("SignUp endpoint hit")
	method := c.Request.Method
	if method != http.MethodPost {
		c.JSON(http.StatusMethodNotAllowed, gin.H{"error": "Method not allowed"})
		fmt.Println("Method not allowed:", method)
		return
	}

	// Handle user signup
	var input struct {
		Name     string `json:"name"`
		Email    string `json:"email" `
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	hash, _ := HashPassword(input.Password)
	_, err := db.DB.Exec("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", input.Name, input.Email, hash)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User created successfully"})

}

func Login(c *gin.Context) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	fmt.Println("Login endpoint hit")

	// ✅ Parse body
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ✅ Find user
	var user models.User
	err := db.DB.Get(&user, "SELECT * FROM users WHERE email=$1", input.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// ✅ Check password
	if !CheckPasswordHash(input.Password, user.PASSWORD) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// ✅ Generate JWT
	token, err := GenerateJWT(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// ✅ Set cookie (for web app)
	c.SetCookie("token", token, 3600*24, "/", "localhost", false, true)

	// ✅ Return token in JSON (for Chrome Extension)
	c.JSON(http.StatusOK, gin.H{
		"message": "Logged in successfully",
		"user": gin.H{
			"userId": user.ID,
			"name":   user.NAME,
			"email":  user.EMAIL,
		},
		"token": token, // 👈 Add this line
	})
}

func Logout(c *gin.Context) {
	// Handle user logout
	c.SetCookie("token", "", -1, "/", "localhost", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}
