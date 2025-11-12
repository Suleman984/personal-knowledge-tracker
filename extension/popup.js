const API_BASE = "http://localhost:8080/api"; // Your Go backend

document.getElementById("saveBtn").addEventListener("click", async () => {
  const textInput = document.getElementById("textInput").value.trim();
  const messageDiv = document.getElementById("message");

  messageDiv.textContent = "";

  if (!textInput) {
    messageDiv.textContent = "Please enter text or URL.";
    return;
  }

  // 🧠 Check if it's a YouTube URL
  if (textInput.includes("youtube.com") || textInput.includes("youtu.be")) {
    messageDiv.textContent =
      "Sorry, video transcription feature not available now.";
    messageDiv.style.color = "red";
    return;
  }

  try {
    let loadingDots = 0;
    const loadingInterval = setInterval(() => {
      loadingDots = (loadingDots + 1) % 4;
      messageDiv.textContent =
        "Saving summary" + ".".repeat(loadingDots);
    }, 500);
    const response = await fetch(`${API_BASE}/summarize`, {
      method: "POST",
      credentials: "include", // important if JWT in cookies
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: textInput.startsWith("http") ? textInput : "",
        text: textInput.startsWith("http") ? "" : textInput
      })
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data = await response.json();
    clearInterval(loadingInterval);
    console.log("Summary saved:", data);
    messageDiv.textContent = "✅ Summary saved successfully!";
    messageDiv.style.color = "green";
  } catch (err) {
    console.error(err);
    messageDiv.textContent = `❌ Failed to save summary: ${err.message}`;
    messageDiv.style.color = "red";
  }
});
