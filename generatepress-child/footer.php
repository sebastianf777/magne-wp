<?php
/**
 * Footer template for the child theme.
 *
 * @package GeneratePress Child
 */
?>

<div class="site-footer">
    <footer class="site-info" aria-label="Site">
        <div class="inside-site-info">
            <div class="copyright-bar">
                <span class="copyright">© <?php echo date('Y'); ?> magnesiusai.com</span> • Created By Sebastian Fontana
            </div>
        </div>
    </footer>
</div>
<div id="chatbot-container" style="position: fixed; bottom: 20px; right: 20px; background: #f1f1f1; border-radius: 10px; box-shadow: 0px 4px 6px rgba(0,0,0,0.1); padding: 10px; max-width: 300px;">
    <h3>Chatbot</h3>
    <div id="chatbot-messages" style="height: 200px; overflow-y: auto; border: 1px solid #ccc; padding: 5px; margin-bottom: 10px;"></div>
    <input type="text" id="chatbot-input" placeholder="Ask a question..." style="width: calc(100% - 20px); padding: 5px;">
    <button id="chatbot-send" style="margin-top: 5px;">Send</button>
</div>

<script>
    const API_URL = "https://magne-chatbot.vercel.app/chat"; // Replace with your deployed Vercel URL

    document.getElementById('chatbot-send').addEventListener('click', async () => {
        const input = document.getElementById('chatbot-input');
        const messageContainer = document.getElementById('chatbot-messages');

        if (!input.value.trim()) return;

        // Display user message
        const userMessage = document.createElement('div');
        userMessage.textContent = `You: ${input.value}`;
        messageContainer.appendChild(userMessage);

        // Send question to API
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pregunta: input.value })
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

        input.value = '';
    });
</script>


<?php wp_footer(); ?>
</body>
</html>
