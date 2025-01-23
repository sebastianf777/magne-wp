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
        <div id="chatbot-container">
    <div id="chatbot-header">
        <h3>Chatbot</h3>
        <button id="chatbot-minimize" aria-label="Minimize Chatbot">–</button>
    </div>
    <div id="chatbot-body">
        <div id="chatbot-messages"></div>
        <input type="text" id="chatbot-input" placeholder="Ask a question...">
        <button id="chatbot-send">Send</button>
    </div>
</div>

    </footer>
</div>


<?php wp_footer(); ?>
</body>
</html>
