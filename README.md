# deto_x

deto_x is a Chrome extension that helps you filter tweets in your feed based on custom criteria using OpenAI’s GPT-3.5 model. Users can configure a custom prompt to analyze tweets and optionally hide tweets that match the criteria. It aims to be highly configurable and easily extensible.

![alt text](image.png)

## Why would I want this?

X/Twitter has always been unhinged, and now it is even more so. If you spend a lot of time on it and care about the information that goes into your head, it's worth a bit of upfront investment to make it work for you.

If you're worried about paying lots of money in API fees, keep in mind that GPT-3.5 is absurdly cheap. I've spent about $0.10 over the course of the entire development of this project. My recommendation is to use it to identify things you don't want to see, use the Not Interested button to train X to show you less of it, then disable or uninstall the extension.

## Features

- Analyze tweets using OpenAI’s GPT-3.5 API.
- Customize the filtering logic with a user-defined prompt.
- Simple UI for managing API key, prompt, and the minimum number of likes a tweet should have before it gets filtered (useful if you want to avoid viral slop).
- Hidden tweets are covered with a grey overlay and a “Show hidden tweet” button for easy access.

## Requirements

- A valid OpenAI API key.
- Google Chrome

deto_x has only been tested on Chrome but should work on any Chromium based browser.

## Installation

1. Clone this repository.
```
git clone git@github.com:galenys/deto_x.git 
```
or
```
git clone https://github.com/galenys/deto_x.git
```
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable Developer mode (toggle in the top right corner).
4. Click Load unpacked and select the project folder.

The extension will now be loaded in Chrome.

## License

This project is licensed under the MIT license.