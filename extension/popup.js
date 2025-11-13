const API_BASE = "http://localhost:8080/api"; // Your Go backend

document.getElementById("saveBtn").addEventListener("click", async () => {
  const textInput = document.getElementById("textInput").value.trim();
  const messageDiv = document.getElementById("message");

  messageDiv.textContent = "";

  if (!textInput) {
    messageDiv.textContent = "Please enter text or URL.";
    return;
  }

  if (textInput.includes("youtube.com") || textInput.includes("youtu.be")) {
    messageDiv.textContent =
      "Sorry, video transcription feature not available now.";
    messageDiv.style.color = "red";
    return;
  }

  let loadingDots = 0;
  messageDiv.style.color = "black";

  // start loading animation
  const loadingInterval = setInterval(() => {
    loadingDots = (loadingDots + 1) % 4;
    messageDiv.textContent = "Saving summary" + ".".repeat(loadingDots);
  }, 500);

  try {
    const response = await fetch(`${API_BASE}/summarize`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: textInput.startsWith("http") ? textInput : "",
        text: textInput.startsWith("http") ? "" : textInput,
      }),
    });

    // stop loading
    clearInterval(loadingInterval);

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data = await response.json();

    console.log("Summary saved:", data);
    messageDiv.textContent = "✅ Summary saved successfully!";
    messageDiv.style.color = "green";
  } catch (err) {
    clearInterval(loadingInterval); // 🧩 always clear interval even if error
    console.error(err);
    messageDiv.textContent = `❌ Failed to save summary: ${err.message}`;
    messageDiv.style.color = "red";
  }
});
