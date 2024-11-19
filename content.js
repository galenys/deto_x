const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            // Ensure the added node is an element (not text or comment)
            if (node.nodeType === 1 && node.getAttribute('data-testid') === 'tweet') {
                console.log("New tweet detected:", node);
                processTweet(node); // Apply your processing logic here
            }
        });
    });
});

// Function to process a tweet
function processTweet(tweet) {
    if (!tweet.hasAttribute('data-processed')) {
        tweet.style.outline = "2px solid red";
        tweet.setAttribute('data-processed', 'true'); // Mark as processed
        console.log("Processed tweet:", tweet.innerText);
    }
}

// Start observing the document body for changes
observer.observe(document.body, { childList: true, subtree: true });