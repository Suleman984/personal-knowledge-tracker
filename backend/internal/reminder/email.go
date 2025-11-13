package reminder

import (
	"fmt"
	"net/smtp"
	"os"
)

func SendReminderEmail(to, title, createdAt string) error {
	from := "sulemanefc@gmail.com"
	password := os.Getenv("pass")

	// SMTP config (for Gmail)
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"
	fmt.Println("SMTP server:", smtpHost)
	subject := "📢 PKR PORTAL: Reminder for your summary"
	body := fmt.Sprintf(`
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
    <div style="max-width: 600px; background-color: #ffffff; margin: auto; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="background-color: #000000; color: #ffffff; padding: 20px; text-align: center;">
        <h2>PKR PORTAL Reminder</h2>
      </div>
      <div style="padding: 30px;">
        <p>Hello 👋,</p>
        <p>This is a friendly reminder about your recent summary on <b>PKR Portal</b>.</p>
        <p><b>Summary Title:</b> %s</p>
        <p><b>Created At:</b> %s</p>
        <p>You can view or manage your reminders anytime in your dashboard.</p>
        <p style="margin-top: 30px;">Best,<br/><b>PKR Portal Team</b></p>
      </div>
      <div style="background-color: #f0f0f0; color: #555; padding: 10px 20px; text-align: center; font-size: 13px;">
        © 2025 PKR Portal • <a href="https://pkr_sam.com" style="color: #000;">pkr_sam.com</a>
      </div>
    </div>
  </body>
</html>
`, title, createdAt)

	message := []byte("Subject: " + subject + "\r\n" +
		"Content-Type: text/html; charset=UTF-8\r\n\r\n" + body)

	auth := smtp.PlainAuth("", from, password, smtpHost)

	return smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, message)
}
