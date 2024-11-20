function isExtensionEnabled() {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: "GET_EXTENSION_ENABLED" }, (response) => {
            resolve(response.extensionEnabled || false);
        });
    });
}

function getMinLikesToFilter() {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: "GET_MIN_LIKES_TO_FILTER" }, (response) => {
            resolve(response.minLikesToFilter || 0);
        });
    });
}

async function processTweet(tweet) {
    if (tweet == null) {
        return;
    }

    const isEnabled = await isExtensionEnabled();
    if (!isEnabled) {
        console.log("Extension is disabled");
        return;
    }
    console.log("Extension is enabled");

    const minLikesToFilter = await getMinLikesToFilter();
    if (getTweetLikes(tweet) < minLikesToFilter) {
        console.log("Tweet does not meet minimum likes threshold:", getTweetLikes(tweet));
        return;
    }

    const tweetTextDiv = tweet.querySelector('[data-testid="tweetText"]');
    if (tweetTextDiv == null) {
        return;
    }
    const tweetText = tweetTextDiv.innerText;

    chrome.runtime.sendMessage(
        { type: "FILTER_TWEET", tweetText },
        (response) => {
            if (response.isFiltered) {
                addGreyCover(tweet);
            }
        }
    );
}

function startObserver() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.getAttribute('data-testid') === 'cellInnerDiv') {
                    const tweet = node.querySelector('[data-testid="tweet"]');
                    processTweet(tweet).catch((error) => {
                        console.error("Error processing tweet:", error);
                    });
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

function parseNumber(text) {
    const suffixes = { K: 1e3, M: 1e6, B: 1e9 }; // Define suffix multipliers
    const match = text.match(/^(\d+(\.\d+)?)([KMB])?$/i); // Match number and optional suffix

    if (!match) {
        throw new Error("Invalid number format");
    }

    const number = parseFloat(match[1]); // Parse the numeric part
    const suffix = match[3]?.toUpperCase(); // Get the suffix, if present

    return suffix ? number * suffixes[suffix] : number; // Multiply by suffix factor or return plain number
}

function getTweetLikes(tweet) {
    const likeButton = tweet.querySelector('[data-testid="like"]');
    if (likeButton) {
        return parseNumber(likeButton.innerText);
    }
    return 0;
}

function addGreyCover(tweet) {
    const original_height = tweet.getBoundingClientRect().height + "px";
    // const caret = tweet.querySelector('[data-testid="caret"]');
    // caret.style.zIndex = "1001"; // Ensure it overlays the cover

    // Create the grey cover
    const cover = document.createElement("div");
    cover.style.position = "absolute";
    cover.style.top = "0";
    cover.style.left = "0";
    cover.style.width = "100%";
    cover.style.height = "100%";
    cover.style.backgroundColor = "rgba(0, 0, 0, 1)";
    cover.style.display = "flex";
    cover.style.flexDirection = "column";
    cover.style.alignItems = "center";
    cover.style.justifyContent = "center";
    cover.style.zIndex = "1000"; // Ensure it overlays the tweet

    // Create the reveal button
    const revealButton = document.createElement("button");
    revealButton.innerText = "Show hidden tweet";
    revealButton.style.padding = "0";
    revealButton.style.height = "100%";
    revealButton.style.width = "100%";
    revealButton.style.fontFamily = "Arial, sans-serif";
    revealButton.style.textAlign = "center";
    revealButton.style.fontSize = "12px";
    revealButton.style.color = "white";
    revealButton.style.backgroundColor = "black";
    revealButton.style.border = "none";
    revealButton.style.cursor = "pointer";

    tweet.style.height = "40px";

    // Add click event to reveal the tweet
    revealButton.addEventListener("click", () => {
        tweet.style.height = original_height;
        cover.remove(); // Remove the cover
    });

    cover.appendChild(revealButton);

    // Append the cover to the tweet
    tweet.appendChild(cover);
}
