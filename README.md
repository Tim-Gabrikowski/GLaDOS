# GLaDOS

Custom GLaDOS like unhelpful AI assistant

## Usage

At the core we will use the [Ollama](https://ollama.com/) LLM engine to run our GLaDOS LLM. Make sure you have it installed and the api is running. Then pull the [gemma:1b](https://ollama.com/library/gemma3:1b) model.

```sh
ollama pull gemma3:1b
```

Then start the nodejs API in the `api/` directory by using

```sh
npm run dev
```

The API should be listening to requests on port `3000` (if not stated otherwise using `PORT` env-variable)

(make sure to run it on Linux, because the boundled piper binary is compiled for linux)

(Docker Image WIP)

## API

Quick documentation of the api

### Get Text response

GET-Request to `http://localhost:3000/chat?prompt=[MESSAGE]`

### RAW-TTS

GET-Request to `http://localhost:3000/tts?text=[TEXT]`

to generate audio from text

### CHAT-TTS

GET-Request to `http://localhost:3000/chat_tts?prompt=[MESSAGE]`

to generate chat response and recieve its audio