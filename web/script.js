let sessionId = null;

async function getApiResponse(prompt) {
	let ses = sessionId ? "&session=" + encodeURIComponent(sessionId) : "";
	let response = await fetch(
		"http://localhost:3000/chat?prompt=" + encodeURIComponent(prompt) + ses
	);
	let data = await response.json();

	sessionId = data.session;
	return data.response;
}

document.getElementById("submit").addEventListener("click", submitMessage);
document.getElementById("prompt").addEventListener("keypress", (e) => {
	if (e.key !== "Enter") return;
	submitMessage();
});

async function submitMessage() {
	const input = document.getElementById("prompt").value;
	document.getElementById("prompt").value = "";

	if (!input) {
		alert("Please enter a message.");
		return;
	}

	if (input == "/reset") {
		sessionId = null;
		document.getElementById("chat").innerHTML = "";
		return;
	}

	createMessageElement({
		sender: "You",
		timestamp: new Date().toLocaleTimeString(),
		content: input,
		color: "blue",
	});

	const response = await getApiResponse(input);

	createMessageElement({
		sender: "GLaDOS",
		timestamp: new Date().toLocaleTimeString(),
		content: response,
		color: "orange",
	});
}

function createMessageElement(data) {
	const template = document.getElementById("message-template-" + data.color);
	const clone = template.content.cloneNode(true);

	// Populate the cloned template with data
	clone.querySelector(".message-sender").textContent = data.sender;
	clone.querySelector(".message-timestamp").textContent = data.timestamp;
	clone.querySelector(".message-content").textContent = data.content;
	// Insert it into the DOM
	document.getElementById("chat").appendChild(clone);

	document.getElementById("chat").scrollTo({
		top: document.getElementById("chat").scrollHeight,
		behavior: "smooth",
	});
}
