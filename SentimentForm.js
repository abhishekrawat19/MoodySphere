// frontend/src/components/SentimentForm.js
import React, { useState } from 'react';
import axios from 'axios';

const SentimentForm = () => {
    // State for input text, API result, loading status, and error messages
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form submit handler
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        setLoading(true);   // Show loading indicator
        setError(null);     // Clear any previous errors

        // Input validation: Ensure text is not empty
        if (!text.trim()) {
            setError('Please enter some text.');
            setLoading(false);
            return;
        }

        try {
            // Send text to API using Axios
            const response = await axios.post(`${process.env.REACT_APP_API_URL}`, { text });
            setResult(response.data); // Save API response to state
        } catch (error) {
            // Handle errors gracefully
            setError('Failed to analyze sentiment. Please try again.');
            console.error('Error analyzing sentiment:', error);
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    // Separate component to render sentiment analysis results
    const Results = ({ result }) => (
        <div>
            <h3>Results:</h3>
            {result.positive !== undefined && <p>Positive: {result.positive}</p>}
            {result.negative !== undefined && <p>Negative: {result.negative}</p>}
            {result.neutral !== undefined && <p>Neutral: {result.neutral}</p>}
            {result.compound !== undefined && <p>Compound: {result.compound}</p>}
        </div>
    );

    return (
        <div className="container">
            {/* Page Title */}
            <h1>Sentiment Analysis</h1>

            {/* Sentiment Analysis Form */}
            <form onSubmit={handleSubmit}>
                {/* Textarea for input */}
                <textarea
                    className="form-control"
                    rows="5"
                    placeholder="Enter text to analyze"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                {/* Submit Button */}
                <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? 'Analyzing...' : 'Analyze'}
                </button>
            </form>

            {/* Display error messages, if any */}
            {error && <p className="error" style={{ color: 'red' }}>{error}</p>}

            {/* Display results, if available */}
            {result && <Results result={result} />}
        </div>
    );
};

export default SentimentForm;
