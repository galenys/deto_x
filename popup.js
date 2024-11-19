document.addEventListener('DOMContentLoaded', () => {
    // Get the saved API key and prompt when the popup loads
    chrome.runtime.sendMessage({ type: "GET_API_KEY" }, (response) => {
        document.getElementById('apiKeyInput').value = response.apiKey || '';
    });

    chrome.runtime.sendMessage({ type: "GET_PROMPT" }, (response) => {
        document.getElementById('promptInput').value = response.prompt || '';
    });
});

document.getElementById('submit').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKeyInput').value;
    const prompt = document.getElementById('promptInput').value;

    // Save the API key
    chrome.runtime.sendMessage({ type: "SAVE_API_KEY", apiKey }, (response) => {
        if (response.success) {
            console.log("API Key saved successfully!");
        } else {
            console.error("Failed to save API Key.");
        }
    });

    // Save the prompt
    chrome.runtime.sendMessage({ type: "SET_PROMPT", prompt }, (response) => {
        if (response.success) {
            console.log("Prompt saved successfully!");
        } else {
            console.error("Failed to save prompt.");
        }
    });

    document.getElementById('status').innerText = "Settings saved!";
});