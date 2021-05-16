# SpeechJam

Compete with friends to blend in with the AI in a chatroom. Vote on the real AI, get points each round for guessing correctly and for tricking your opponents.

## Usage

1. Download appropriate executable from the [bin/](./bin) directory.
1. Run executable.
1. Follow instructions in webpage that opens.

## Development Setup

1. Install dependencies
   [Node](https://nodejs.org/en/download/)
   [Yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable)
1. Install Node Modules
   ```
   yarn setup
   ```
1. Build and watch for client changes
   In a separate terminal run:

   ```
   yarn client dev

   // Or, this for hot reloading

   yarn client serve
   ```

1. Start development server
   ```
   yarn server dev
   ```
1. Website should automatically be opened, if not, visit URL printed in dev server terminal.

1. Start the gpt2 container
   ```
   docker pull gcr.io/ai-responder/gpt2:latest
   docker run -p 8080:8080 --memory="2g" --cpus="1" gcr.io/ai-responder/gpt2:latest
   ```
   You will have to change the default gpt2 url in constants.js to:
   ```
   exports.GPT2_URL = 'localhost:8080';
   ```

## Dev Notes

- `open` module has been fixed at version 8.0.2 because of this issue: https://github.com/sindresorhus/open/issues/236
