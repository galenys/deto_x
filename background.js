chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.type === "GET_EXTENSION_ENABLED") {
        // Retrieve the enabled state from Chrome storage
        chrome.storage.local.get("extensionEnabled", (data) => {
            sendResponse({ extensionEnabled: data.extensionEnabled || false });
        });

        // Required to allow async response
        return true
    } else if (message.type === "SET_EXTENSION_ENABLED") {
        // Save the enabled state in Chrome storage
        chrome.storage.local.set({ extensionEnabled: message.extensionEnabled }, () => {
            console.log("Extension enabled state saved as:", message.extensionEnabled);
            sendResponse({ success: true });
        });

        // Required to allow async response
        return true;
    } else if (message.type === "SAVE_API_KEY") {
        // Save the API key in Chrome storage
        chrome.storage.local.set({ openaiApiKey: message.apiKey }, () => {
            console.log("API key saved.");
            sendResponse({ success: true });
        });

        // Required to allow async response
        return true;
    } else if (message.type === "GET_API_KEY") {
        // Retrieve the API key from Chrome storage
        chrome.storage.local.get("openaiApiKey", (data) => {
            sendResponse({ apiKey: data.openaiApiKey || null });
        });

        // Required to allow async response
        return true;
    } else if (message.type === "SET_PROMPT") {
        // Save the prompt in Chrome storage
        chrome.storage.local.set({ prompt: message.prompt }, () => {
            console.log("Prompt saved.");
            sendResponse({ success: true });
        });

        // Required to allow async response
        return true;
    } else if (message.type === "GET_PROMPT") {
        // Retrieve the prompt from Chrome storage
        chrome.storage.local.get("prompt", (data) => {
            sendResponse({ prompt: data.prompt || null });
        });

        // Required to allow async response
        return true;
    } else if (message.type === "FILTER_TWEET") {
        doesTweetGetYesOnPrompt(message.tweetText)
            .then((result) => {
                sendResponse({ isFiltered: result });
            })
            .catch((error) => {
                console.error("Error filtering tweet:", error);
                sendResponse({ isFiltered: false });
            });
        return true;
    }
});

// Returns a boolean
async function doesTweetGetYesOnPrompt(tweetText) {
    const apiKey = (await chrome.storage.local.get("openaiApiKey")).openaiApiKey;
    const prompt = (await chrome.storage.local.get("prompt")).prompt;
    const model = "gpt-3.5-turbo"; // Specify the model to use

    if (!apiKey || !prompt) {
        console.log("API Key or Prompt is missing.");
        return false;
    }

    // Combine the prompt with the tweet for clarity
    const fullPrompt = `${prompt}\n\nTweet: "\n${tweetText}"\n\nAnswer with yes or no.`;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: "user",
                        content: fullPrompt
                    }
                ],
                max_tokens: 1,
                temperature: 0 // Low temperature ensures deterministic responses
            })
        });
        if (!response.ok) {
            console.error(`API Error: ${response.statusText}`);
            return false;
        }
        const data = await response.json();
        const result = data.choices[0].message.content.trim().toLowerCase();
        // Return true for "yes", false otherwise
        return result == "yes";
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        return false;
    }
}