const chatbotContainer = document.getElementById('chatbot-container');
const minimizeButton = document.getElementById('chatbot-minimize');
const chatbotBody = document.getElementById('chatbot-body');
const inputField = document.getElementById('chatbot-input');
const sendButton = document.getElementById('chatbot-send');
const messageContainer = document.getElementById('chatbot-messages');

// Function to handle sending messages
const sendMessage = async () => {
    if (!inputField.value.trim()) return;

    // Display user message
    const userMessage = document.createElement('div');
    userMessage.textContent = `You: ${inputField.value}`;
    messageContainer.appendChild(userMessage);

    // Send question to API
    try {
        const response = await fetch("https://magne-chatbot.vercel.app/chat", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pregunta: inputField.value })
        });
        const data = await response.json();

        // Display chatbot response
        const botMessage = document.createElement('div');
        botMessage.textContent = `Bot: ${data.respuesta}`;
        messageContainer.appendChild(botMessage);
    } catch (error) {
        const errorMessage = document.createElement('div');
        errorMessage.textContent = "Error: Unable to connect to chatbot.";
        messageContainer.appendChild(errorMessage);
    }

    inputField.value = ''; // Clear the input field
};

// Send message when clicking the Send button
sendButton.addEventListener('click', sendMessage);

// Send message when pressing Enter in the input field
inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission
        sendMessage();
    }
});

minimizeButton.addEventListener('click', () => {
    chatbotContainer.classList.toggle('minimized');
    if (chatbotContainer.classList.contains('minimized')) {
        minimizeButton.textContent = '+'; // Show expand icon
    } else {
        minimizeButton.textContent = '–'; // Show minimize icon
    }
});
