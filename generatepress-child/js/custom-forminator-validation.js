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
            // fetchUpdatedCodeStats(); // Refresh stats after successful submission
        });
    }

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

                if (this.classList.contains('available')) {
                    if (form && !isSubmitting) {
                        console.log("Auto-submitting the form...");
                        isSubmitting = true; // Prevent duplicate submissions
                        // Hide stats and show loading animation
                        const statsContainer = document.querySelector('#code-stats');
                        if (statsContainer) {
                            statsContainer.style.display = 'none'; // Hide the stats container

                        }
                        // Replace the input field with the loading animation
                        const inputParent = code_input_field.parentElement; // Get the parent container
                        if (inputParent) {
 
                            // Temporarily hide the input field (instead of removing it immediately)
                            code_input_field.style.display = 'none';

                            // Add the loading animation
                            const loader = document.createElement('div');
                            loader.classList.add('loading-container');
                            loader.innerHTML = `
                            <div class="loading-container">
                                <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" class="spinner">
                                    <!-- Adjusted circle to fit the viewBox -->
                                    <circle cx="100" cy="100" r="70" stroke="green" stroke-width="5" fill="none" stroke-dasharray="439.6" stroke-dashoffset="439.6">
                                        <animate attributeName="stroke-dashoffset" from="439.6" to="0" dur="2s" repeatCount="indefinite" />
                                    </circle>
                                    <!-- Centered text -->
                                    <text x="50%" y="50%" text-anchor="middle" fill="black" dy=".4em" font-size="25"> Unlocking </text>
                                </svg>
                            </div>
                            `;
                            inputParent.appendChild(loader); // Add the loader inside the input field's parent
                        }
                        // Add a 2-second delay before form submission
                        setTimeout(() => {
                            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                        }, 2000);
                    }
                }
            });
        });
    };

    // // Randomize button order in the container
    // const buttonContainer = document.querySelector('.button-container');
    // if (buttonContainer) {
    //     const buttons = Array.from(buttonContainer.children);
    //     const shuffledButtons = buttons.sort(() => Math.random() - 0.5);
    //     shuffledButtons.forEach(button => buttonContainer.appendChild(button));
    // }

    attachButtonListeners();

    // Observe dynamically added buttons
    const observer = new MutationObserver(() => {
        attachButtonListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });
});
