document.addEventListener('DOMContentLoaded', () => {
    // Define a flag to prevent multiple submissions
    let isSubmitting = false;

    // Find the form element by ID
    const form = document.querySelector('#forminator-module-8');
    if (form) {
        // Intercept the submit event to prevent default behavior and scrolling
        form.addEventListener('submit', function (event) {
            if (!isSubmitting) {
                event.preventDefault(); // Prevent default behavior (including scrolling)
                console.log("Submitting the form...");
                isSubmitting = true;

                // Let Forminator handle the form submission and listen for its success event
                form.dispatchEvent(new Event('forminator:form:submit:success', { bubbles: true }));
            }
        });

        // Listen for Forminator's successful submission event
        form.addEventListener('forminator:form:submit:success', function () {
            console.log("Form submission successful. Fetching updated stats...");
            fetchUpdatedCodeStats(); // Refresh stats after successful submission
        });
    }

    // Function to fetch and update the code stats
    const fetchUpdatedCodeStats = () => {
        const statsContainer = document.querySelector('#code-stats'); // ID of the container displaying stats
        if (statsContainer) {
            fetch(ajaxurl + '?action=refresh_code_stats', { method: 'GET' })
                .then(response => response.text())
                .then(data => {
                    statsContainer.innerHTML = data; // Update the stats container with new data
                    console.log("Code stats updated successfully.");
                    isSubmitting = false; // Reset the flag after updating stats
                })
                .catch(error => {
                    console.error('Error refreshing code stats:', error);
                    isSubmitting = false; // Reset the flag even on error
                });
        }
    };

    // Automatically convert user input to uppercase
    const inputField = form.querySelector('input[name="text-1"]');
    if (inputField) {
        inputField.addEventListener('input', () => {
            inputField.value = inputField.value.toUpperCase();
            console.log("Converted input to uppercase: ", inputField.value);
        });
    }

    // Button functionality
    const code_input_field = document.querySelector('input[name="text-1"]');
    const attachButtonListeners = () => {
        const buttons = document.querySelectorAll('.populate-btn');
        buttons.forEach(button => {
            button.addEventListener('click', function () {
                const value = this.getAttribute('data-value');
                if (code_input_field) {
                    code_input_field.value = value;

                    const inputEvent = new Event('input', { bubbles: true });
                    code_input_field.dispatchEvent(inputEvent);
                }

                if (this.classList.contains('ky2')) {
                    if (form && !isSubmitting) {
                        console.log("Auto-submitting the form...");
                        isSubmitting = true; // Prevent duplicate submissions
                        form.dispatchEvent(new Event('submit', { bubbles: true }));
                    }
                }
            });
        });
    };

    // Randomize button order in the container
    const buttonContainer = document.querySelector('.button-container');
    if (buttonContainer) {
        const buttons = Array.from(buttonContainer.children);
        const shuffledButtons = buttons.sort(() => Math.random() - 0.5);
        shuffledButtons.forEach(button => buttonContainer.appendChild(button));
    }

    attachButtonListeners();

    // Observe dynamically added buttons
    const observer = new MutationObserver(() => {
        attachButtonListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });
});
