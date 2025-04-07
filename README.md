# GLaDOS
This repository serves as a central hub for storing files, configurations, and scripts to create a custom implementation of the GLaDOS LLAM (Language Model) and TTS (Text-to-Speech) system, based on the popular Portal video game series.

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