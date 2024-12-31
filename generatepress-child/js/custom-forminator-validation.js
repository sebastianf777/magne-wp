document.addEventListener('DOMContentLoaded', () => {

    // Find the form element by ID
    const form = document.querySelector('#forminator-module-8');
    if (!form) {
        console.error("Form with ID 'forminator-module-8' not found.");
        return;
    }

    // Attach an input event listener to the input field
    const inputField = form.querySelector('input[name="text-1"]');
    if (!inputField) {
        console.error("Input field with name 'text-1' not found.");
        return;
    }

    // Automatically convert user input to uppercase
    inputField.addEventListener('input', () => {
        inputField.value = inputField.value.toUpperCase();
        console.log("Converted input to uppercase: ", inputField.value);
    });

    //hamburguer button

    const menuToggle = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.navigation');

    if (menuToggle && navigation) {
        menuToggle.addEventListener('click', () => {
            navigation.classList.toggle('open'); // Toggle the 'open' class
        });
    }


    // Select the input field
    const code_input_field = document.querySelector('input[name="text-1"]'); // Replace with your input field's name or ID

    // Function to attach click event listeners to buttons
    const attachButtonListeners = () => {
        const buttons = document.querySelectorAll('.populate-btn');
        buttons.forEach(button => {
            button.addEventListener('click', function (e) {
                // e.preventDefault(); // Prevent the button's default behavior (but not the form's)

                const value = this.getAttribute('data-value'); // Get the value from the data attribute

                // Update the input field
                if (code_input_field) {
                    code_input_field.value = value;

                    // Trigger any input events the form relies on (like for autosubmit)
                    const inputEvent = new Event('input', { bubbles: true });
                    code_input_field.dispatchEvent(inputEvent);
                }

                // Auto-submit the form if the button has the "ky2" class
                if (this.classList.contains('ky2')) {
                    const form = code_input_field.closest('form'); // Find the closest form
                    if (form) {
                        console.log("Auto-submitting the form...");
                        // Let Forminator handle the submission
                        setTimeout(() => {
                            form.dispatchEvent(new Event('submit', { bubbles: true })); // Trigger the submit event
                        }, 2000); // Wait for 2 seconds before triggering submit
                    } else {
                        console.error("Form not found for auto-submit.");
                    }
                }
            });
        });
    };

    // Select the parent container of the buttons
    const buttonContainer = document.querySelector('.button-container'); // Replace with the actual parent container class or ID

    if (buttonContainer) {
        // Select all buttons inside the container
        const buttons = Array.from(buttonContainer.children); // Convert NodeList to an array

        // Shuffle the buttons array
        const shuffledButtons = buttons.sort(() => Math.random() - 0.5);

        // Append the shuffled buttons back to the container
        shuffledButtons.forEach(button => buttonContainer.appendChild(button));
    }

    // Attach listeners to existing buttons
    attachButtonListeners();

    // Observe dynamically added buttons
    const observer = new MutationObserver(() => {
        attachButtonListeners();
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

});
