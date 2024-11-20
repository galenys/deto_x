# deto_x

deto_x is a Chrome extension that helps you filter tweets in your feed based on custom criteria using OpenAI’s GPT-3.5 model. Users can configure a custom prompt to analyze tweets and optionally hide tweets that match the criteria. It aims to be highly configurable and easily extensible.

## Features

- Analyze tweets using OpenAI’s GPT-3.5 API.
- Customize the filtering logic with a user-defined prompt.
- Simple UI for managing API key, prompt, and extension state.
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