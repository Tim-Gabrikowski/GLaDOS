import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

let prevousMessages = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { getAiResponse } from "./get-response.js";
import { streamTextResponse } from "./piper.js";

app.get("/", (req, res) => {
	res.send("Hello World!");
});
app.get("/chat", async (req, res) => {
	const prompt = req.query.prompt;
	try {
		const response = await getAiResponse(prompt, prevousMessages);
		res.json({ response, prevousMessages });
		prevousMessages.push(
			{ role: "user", content: prompt },
			{ role: "assistant", content: response }
		);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
app.get("/tts", async (req, res) => {
	const text = req.query.text;
	if (!text) {
		return res.status(400).json({ error: "Text parameter is required." });
	}

	res.setHeader("Content-Type", "audio/wav");
	res.setHeader("Transfer-Encoding", "chunked");

	try {
		streamTextResponse(text, res);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.get("/chat_tts", async (req, res) => {
	const prompt = req.query.prompt;
	if (!prompt) {
		return res.status(400).json({ error: "Text parameter is required." });
	}

	res.setHeader("Content-Type", "audio/wav");
	res.setHeader("Transfer-Encoding", "chunked");

	try {
		const response = await getAiResponse(prompt, prevousMessages);
		streamTextResponse(response, res);
		prevousMessages.push(
			{ role: "user", content: prompt },
			{ role: "assistant", content: response }
		);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
