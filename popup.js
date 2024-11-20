document.addEventListener('DOMContentLoaded', () => {
    // Get the saved API key and prompt when the popup loads
    chrome.runtime.sendMessage({ type: "GET_API_KEY" }, (response) => {
        document.getElementById('apiKeyInput').value = response.apiKey || '';
    });

    chrome.runtime.sendMessage({ type: "GET_PROMPT" }, (response) => {
        document.getElementById('promptInput').value = response.prompt || '';
    });

    chrome.runtime.sendMessage({ type: "GET_MIN_LIKES_TO_FILTER" }, (response) => {
        document.getElementById('minLikesToFilterInput').value = response.minLikesToFilter || 0;
    });

    // Get the enabled state when the popup loads
    chrome.runtime.sendMessage({ type: "GET_EXTENSION_ENABLED" }, (response) => {
        const extensionEnabled = response.extensionEnabled || false;
        document.getElementById('enabledCheckbox').checked = extensionEnabled;
        popupEnabled(extensionEnabled);
    });
});

document.getElementById('enabledCheckbox').addEventListener('change', () => {
    // Get the new state of the checkbox
    const isEnabled = document.getElementById('enabledCheckbox').checked;
    popupEnabled(isEnabled);

    // Save the enabled state
    chrome.runtime.sendMessage({ type: "SET_EXTENSION_ENABLED", extensionEnabled: isEnabled }, (response) => {
        if (response.success) {
            console.log("Enabled state saved successfully!");
        } else {
            console.error("Failed to save enabled state");
        }
    }
    );
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

    // Save the minimum likes threshold
    const minLikesToFilter = parseInt(document.getElementById('minLikesToFilterInput').value);
    chrome.runtime.sendMessage({ type: "SET_MIN_LIKES_TO_FILTER", minLikesToFilter }, (response) => {
        if (response.success) {
            console.log("Minimum likes threshold saved successfully!");
        } else {
            console.error("Failed to save minimum likes threshold.");
        }
    });
});

function popupEnabled(isEnabled) {
    if (isEnabled) {
        document.body.style.color = "black";
        document.getElementById("promptInput").disabled = false;
        document.getElementById("apiKeyInput").disabled = false;
        document.getElementById("minLikesToFilterInput").disabled = false;
        document.getElementById("submit").disabled = false;
        document.getElementById("submit").style.backgroundColor = "navy";
    } else {
        document.body.style.color = "grey";
        document.getElementById("promptInput").disabled = true;
        document.getElementById("apiKeyInput").disabled = true;
        document.getElementById("minLikesToFilterInput").disabled = true;
        document.getElementById("submit").disabled = true;
        document.getElementById("submit").style.backgroundColor = "grey";
    }
}