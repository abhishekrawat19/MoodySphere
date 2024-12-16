// Select DOM elements
const textInput = document.getElementById('text-input');
const submitButton = document.getElementById('submit-button');
const errorMessage = document.getElementById('error-message');
const resultsDiv = document.getElementById('results');

// Handle form submission
submitButton.addEventListener('click', async () => {
    const text = textInput.value.trim();
    errorMessage.textContent = ''; // Clear previous error messages
    resultsDiv.innerHTML = ''; // Clear previous results

    // Validate input
    if (!text) {
        errorMessage.textContent = 'Please enter some text.';
        return;
    }

    // Disable submit button to prevent multiple requests
    submitButton.disabled = true;
    submitButton.textContent = 'Analyzing...';

    try {
        // Send POST request to the backend API
        const response = await fetch('http://127.0.0.1:8000/api/analyze/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text })
        });

        const data = await response.json();
        
        // Display results
        if (data) {
            resultsDiv.innerHTML = `
                <h3>Results:</h3>
                <p>Positive: ${data.positive}</p>
                <p>Negative: ${data.negative}</p>
                <p>Neutral: ${data.neutral}</p>
                <p>Compound: ${data.compound}</p>
            `;
        }
    } catch (error) {
        errorMessage.textContent = 'Failed to analyze sentiment. Please try again.';
        console.error('Error:', error);
    } finally {
        // Re-enable the submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Analyze';
    }
});
