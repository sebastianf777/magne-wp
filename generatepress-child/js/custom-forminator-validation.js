document.addEventListener('DOMContentLoaded', () => {
    console.log("The custom script is loaded and running.");

    // Find the form element by ID
    const form = document.querySelector('#forminator-module-8');
    if (!form) {
        console.error("Form with ID 'forminator-module-8' not found.");
        return;
    }

    console.log("Form found: ", form);

    // Attach an input event listener to the input field
    const inputField = form.querySelector('input[name="text-1"]');
    if (!inputField) {
        console.error("Input field with name 'text-1' not found.");
        return;
    }

    console.log("Input field found: ", inputField);

    // Automatically convert user input to uppercase
    inputField.addEventListener('input', () => {
        inputField.value = inputField.value.toUpperCase();
        console.log("Converted input to uppercase: ", inputField.value);
    });
});
