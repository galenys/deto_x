document.getElementById('myButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "highlightTweets" }, (response) => {
            console.log(response.status); // Log the response from content.js, but can't see it because wrong scope
        });
    });
});