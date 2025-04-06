import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

let prevousMessages = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { getAiResponse } from "./get-response.js";

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

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
