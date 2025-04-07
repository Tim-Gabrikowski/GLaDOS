import { spawn } from "child_process";

import { fileURLToPath } from "url";
import { join } from "path";

const dirname = fileURLToPath(new URL(".", import.meta.url));

const sampleRate = 22050;
const bitDepth = 16;
const numChannels = 1;

const wavHeader = createWavHeader(0xfffffff, {
	sampleRate,
	numChannels,
	bitDepth,
});

const SILENCE_MS = 10;
const silenceSamples = Math.ceil((sampleRate * SILENCE_MS) / 1000);
const silenceBytes = silenceSamples * (bitDepth / 8) * numChannels;

const silenceBuffer = Buffer.alloc(silenceBytes, 0);

const piperExecutable = join(dirname, "../../tts/piper/piper");
const modelPath = join(dirname, "../../tts/voices/en-us-glados-high.onnx");


export function streamTextResponse(text, response) {
	text = text.trim().replace(/\*/g, "");

	console.log(text);

	const piper = spawn(
		piperExecutable,
		["--model", modelPath, "--output-raw"],
		{
			stdio: ["pipe", "pipe", "pipe"],
		}
	);

	response.write(wavHeader);

	piper.stdout.pipe(response);

	piper.stdin.setEncoding("utf-8");
	piper.stdin.write(text);
	piper.stdin.end();

	piper.stderr.on("data", (data) => {
		console.error("[Piper]", data.toString());
	});

	piper.on("error", (err) => {
		console.error("Piper failed to start:", err);
		response.status(500).end("TTS engine error");
	});

	piper.on("close", (code) => {
		if (code !== 0) {
			console.error(`Piper exited with code ${code}`);
		}
		response.write(silenceBuffer); // Add silence at the end
		response.end(); // Finalize response
	});
}

function createWavHeader(dataLength, options) {
	const { sampleRate, numChannels, bitDepth } = options;
	const byteRate = (sampleRate * numChannels * bitDepth) / 8;
	const blockAlign = (numChannels * bitDepth) / 8;

	const buffer = Buffer.alloc(44);

	buffer.write("RIFF", 0); // ChunkID
	buffer.writeUInt32LE(36 + dataLength, 4); // ChunkSize
	buffer.write("WAVE", 8); // Format

	buffer.write("fmt ", 12); // Subchunk1ID
	buffer.writeUInt32LE(16, 16); // Subchunk1Size (PCM)
	buffer.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
	buffer.writeUInt16LE(numChannels, 22); // NumChannels
	buffer.writeUInt32LE(sampleRate, 24); // SampleRate
	buffer.writeUInt32LE(byteRate, 28); // ByteRate
	buffer.writeUInt16LE(blockAlign, 32); // BlockAlign
	buffer.writeUInt16LE(bitDepth, 34); // BitsPerSample

	buffer.write("data", 36); // Subchunk2ID
	buffer.writeUInt32LE(dataLength, 40); // Subchunk2Size

	return buffer;
}
