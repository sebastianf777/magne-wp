document.addEventListener('DOMContentLoaded', () => {
    // Define a flag to prevent multiple submissions
    let isSubmitting = false;

    // Check if the page needs to be reloaded due to a previous submission
    if (localStorage.getItem('formSubmitted') === 'true') {
        localStorage.removeItem('formSubmitted'); // Clear the flag
        location.reload(); // Reload the page
    }
    // Find the form element by ID
    const form = document.querySelector('#forminator-module-8');
    // Define the input field early
    const code_input_field = form?.querySelector('input[name="text-1"]');

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
    // const code_input_field = document.querySelector('input[name="text-1"]');
    const attachButtonListeners = () => {
        const buttons = document.querySelectorAll('.populate-btn');
        const buttonContainer = document.querySelector('.button-container'); // Assuming buttons are inside a container
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

                        // Hide the buttons and replace with the loading animation
                        if (buttonContainer) {
                            buttonContainer.style.display = 'none'; // Hide the button container

                            // Add the loading animation in its place
                            const loader = document.createElement('div');
                            loader.classList.add('loading-container');
                            loader.innerHTML = `
                            <div class="loading-container" style="text-align: center;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="300" height="20" viewBox="0 20 300 5" class="spinner"> <!-- Espacio reducido abajo -->
                                    <!-- Animated loading bar -->
                                    <rect x="0" y="20" width="300" height="10" fill="lightgrey" />
                                    <rect x="0" y="20" width="0" height="10" fill="green">
                                        <animate attributeName="width" from="0" to="300" dur="2s" repeatCount="indefinite" />
                                    </rect>
                                </svg>
                            </div>
                        `;
                            buttonContainer.parentElement.appendChild(loader); // Append the loader where the buttons were
                        }
                        // Update the UI for the specific code
                        updateCodeStatsUI(value); // Call the function to update the specific code's UI
                        form.style.marginBottom = '-7px';

                        // Add a 2-second delay before form submission
                        setTimeout(() => {
                            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                            // Set the submission flag in localStorage
                            localStorage.setItem('formSubmitted', 'true');
                        }, 2000);
                    }
                }
            });
        });
    };

    // Attach an event listener to intercept form submission
    if (form) {
        form.addEventListener('submit', function (event) {
            console.log("Intercepting form submission...");
            if (code_input_field) {
                // Set the current input value again during submission
                const currentValue = code_input_field.value;
                code_input_field.setAttribute('value', currentValue); // Prevent reset
            }
        });
    }

    // Function to update the UI for the specific code
    const updateCodeStatsUI = (submittedCode) => {
        const statsContainer = document.querySelector('#code-stats');
        if (!statsContainer) return;
    
        // Find the list item for the submitted code by ID
        const listItem = document.querySelector(`#code-${submittedCode}`);
        if (listItem) {
            // Extract the count span and update the number
            const countSpan = listItem.querySelector('.count');
            if (countSpan) {
                const currentCount = parseInt(countSpan.textContent, 10); // Get the current count
                const updatedCount = currentCount + 1; // Increment the count
    
                // Update the count and append the green +1
                countSpan.innerHTML = `${currentCount} <span style="color: green;">+1</span>`;
    
                // Optionally, remove the +1 after a delay for clarity
                setTimeout(() => {
                    countSpan.innerHTML = updatedCount; // Reset to the updated count only
                }, 1000); // 2 seconds
            }
        }
    };
    
    attachButtonListeners();

    // Observe dynamically added buttons
    const observer = new MutationObserver(() => {
        attachButtonListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });
});
window.addEventListener('pageshow', () => {
    const code_input_field = document.querySelector('input[name="text-1"]');

    // Check if there's a previous submission flag in localStorage
    if (localStorage.getItem('formSubmitted') === 'true') {
        localStorage.removeItem('formSubmitted'); // Clear the flag
        if (code_input_field) {
            code_input_field.value = ''; // Reset the input field
            console.log("Input field reset due to previous submission flag.");
            location.reload(); // Reload the page

        }
    }
});