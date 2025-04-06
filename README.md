# GLaDOS
This repository serves as a central hub for storing files, configurations, and scripts to create a custom implementation of the GLaDOS LLAM (Language Model) and TTS (Text-to-Speech) system, based on the popular Portal video game series.

## Create the custom LLM

At the core we will use the [Ollama](https://ollama.com/) LLM engine to run our Custom GLaDOS LLM.

As the base Image we will use the [llama3.2](https://ollama.com/library/llama3.2) model.

To build it, first download the base model:

```sh
ollama pull llama3.2:3b
```

then (in the `LLM` subfolder), build the `glados:3b` model:

```sh
ollama create glados:3b --file GLaDOS.modelfile
```

Run it using:

```sh
ollama run glados:3b
```

