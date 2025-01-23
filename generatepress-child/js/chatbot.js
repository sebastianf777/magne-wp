const chatbotContainer = document.getElementById('chatbot-container');
const minimizeButton = document.getElementById('chatbot-minimize');
const chatbotBody = document.getElementById('chatbot-body');

minimizeButton.addEventListener('click', () => {
    chatbotContainer.classList.toggle('minimized');
    if (chatbotContainer.classList.contains('minimized')) {
        minimizeButton.textContent = '+'; // Show expand icon
    } else {
        minimizeButton.textContent = '–'; // Show minimize icon
    }
});
