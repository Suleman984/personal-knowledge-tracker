package summarizer

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type HFRequest struct {
	Inputs string `json:"inputs"`
}

type HFResponse []struct {
	SummaryText string `json:"summary_text"`
}

// 🧠 Summarization using Hugging Face API
func SummarizeWithHuggingFace(prompt string) (string, error) {
	fmt.Println("🧠 Using Hugging Face for summarization")

	apiKey := os.Getenv("HUGGINGFACE_API_KEY")
	if apiKey == "" {
		return "", fmt.Errorf("HUGGINGFACE_API_KEY not set")
	}
	fmt.Println("HUGGINGFACE_API_KEY found, proceeding with API call", apiKey[:8]+"...")
	// choose a summarization model (you can try bart-large-cnn or t5-base)
	modelURL := "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn"

	body, _ := json.Marshal(HFRequest{Inputs: prompt})

	req, err := http.NewRequest("POST", modelURL, bytes.NewBuffer(body))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error making request to Hugging Face:", err)
		return "", fmt.Errorf("API request failed: %v", err)
	}
	defer resp.Body.Close()

	rawBody, _ := io.ReadAll(resp.Body)
	fmt.Println("🔍 Raw Hugging Face Response:", string(rawBody))

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("API returned status %d: %s", resp.StatusCode, string(rawBody))
	}

	var hfResp HFResponse
	if err := json.Unmarshal(rawBody, &hfResp); err != nil {
		return "", fmt.Errorf("failed to decode response: %v", err)
	}

	if len(hfResp) == 0 {
		return "", fmt.Errorf("no summary returned by model")
	}

	return hfResp[0].SummaryText, nil
}
