console.log("Content script loaded");

function processTweet(tweet) {
    if (!tweet.hasAttribute('data-processed')) {
        console.log("Processing tweet", tweet.innertext);
        if (tweet.innerText.includes('Show more')) {
            tweet.style.outline = "2px solid red";
        }
        tweet.setAttribute('data-processed', 'true');
    }
}

function startObserver() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.getAttribute('data-testid') === 'cellInnerDiv') {
                    const tweet = node.querySelector('[data-testid="tweet"]');
                    processTweet(tweet);
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

if (document.body) {
    startObserver();
} else {
    console.log("document.body not ready, waiting...");
    document.addEventListener('DOMContentLoaded', startObserver);
}