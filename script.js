```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const num1Input = document.getElementById('num1');
    const operatorSelect = document.getElementById('operator');
    const num2Input = document.getElementById('num2');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultValueSpan = document.getElementById('resultValue');
    const errorDisplay = document.getElementById('error');

    // Add event listener to the calculate button
    calculateBtn.addEventListener('click', async () => {
        // Clear previous result and error messages
        resultValueSpan.textContent = '';
        errorDisplay.textContent = '';

        // Get input values and operator
        const num1 = parseFloat(num1Input.value);
        const num2 = parseFloat(num2Input.value);
        const operator = operatorSelect.value;

        // Basic client-side validation for numbers
        if (isNaN(num1) || isNaN(num2)) {
            errorDisplay.textContent = 'Please enter valid numbers for both fields.';
            return;
        }

        try {
            // Send a POST request to the /calculate endpoint
            const response = await fetch('/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Convert JavaScript object to JSON string
                body: JSON.stringify({ num1, num2, operator }),
            });

            // Check if the response was successful (status code 2xx)
            if (!response.ok) {
                // Parse the error response from the server
                const errorData = await response.json();
                // Display a specific error message if available, otherwise a generic one
                errorDisplay.textContent = `Error: ${errorData.detail || 'Something went wrong on the server.'}`;
                return; // Stop further execution
            }

            // Parse the successful response data
            const data = await response.json();

            // Display the result or an error if the backend returned one (e.g., division by zero handled by backend)
            if (data.result !== undefined) {
                resultValueSpan.textContent = data.result;
            } else if (data.detail) { // For cases where backend returns 'detail' even with 200 status (less common but good for robustness)
                errorDisplay.textContent = `Calculation Error: ${data.detail}`;
            } else {
                errorDisplay.textContent = 'Unknown error occurred or no result received.';
            }

        } catch (networkError) {
            // Catch any network-related errors (e.g., server unreachable, CORS issues)
            console.error('Network error during calculation:', networkError);
            errorDisplay.textContent = 'Failed to connect to the server. Please check your network or try again later.';
        }
    });
});
```