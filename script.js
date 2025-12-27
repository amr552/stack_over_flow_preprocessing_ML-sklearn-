// Configuration
const API_URL = 'http://localhost:5000';
let modelConfig = null;

// DOM Elements
const formFields = document.getElementById('form-fields');
const predictionForm = document.getElementById('prediction-form');
const resultSection = document.getElementById('result-section');
const resultValue = document.getElementById('result-value');
const resultUnit = document.getElementById('result-unit');
const resultDetails = document.getElementById('result-details');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const modelTitle = document.getElementById('model-title');
const modelDescription = document.getElementById('model-description');
const apiStatusDot = document.getElementById('api-status-dot');
const apiStatusText = document.getElementById('api-status-text');
const predictBtn = document.getElementById('predict-btn');

// Initialize the application
async function init() {
    try {
        await checkAPIStatus();
        await loadModelConfig();
        renderForm();
    } catch (error) {
        showError('Failed to initialize application: ' + error.message);
    }
}

// Check API status
async function checkAPIStatus() {
    try {
        const response = await fetch(`${API_URL}/`);
        if (response.ok) {
            apiStatusDot.classList.add('connected');
            apiStatusText.textContent = 'API Connected';
        } else {
            throw new Error('API not responding');
        }
    } catch (error) {
        apiStatusDot.classList.remove('connected');
        apiStatusText.textContent = 'API Disconnected';
        throw new Error('Cannot connect to API. Make sure the Flask server is running.');
    }
}

// Load model configuration from API
async function loadModelConfig() {
    try {
        const response = await fetch(`${API_URL}/config`);
        if (!response.ok) {
            throw new Error('Failed to load configuration');
        }

        modelConfig = await response.json();

        // Update page title and description
        modelTitle.textContent = modelConfig.model.name;
        modelDescription.textContent = modelConfig.model.description;
        document.title = modelConfig.model.name;

    } catch (error) {
        throw new Error('Failed to load model configuration: ' + error.message);
    }
}

// Render form fields dynamically based on configuration
function renderForm() {
    formFields.innerHTML = '';

    modelConfig.features.forEach(feature => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = feature.display_name;
        label.setAttribute('for', feature.name);

        let input;

        if (feature.type === 'categorical') {
            // Create select dropdown
            input = document.createElement('select');
            input.id = feature.name;
            input.name = feature.name;
            input.required = feature.required;

            // Add placeholder option
            const placeholderOption = document.createElement('option');
            placeholderOption.value = '';
            placeholderOption.textContent = `Select ${feature.display_name}`;
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            input.appendChild(placeholderOption);

            // Add options
            feature.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                input.appendChild(optionElement);
            });

        } else if (feature.type === 'numeric') {
            // Create number input
            input = document.createElement('input');
            input.type = 'number';
            input.id = feature.name;
            input.name = feature.name;
            input.required = feature.required;
            input.placeholder = `Enter ${feature.display_name}`;

            if (feature.min !== undefined) {
                input.min = feature.min;
            }
            if (feature.max !== undefined) {
                input.max = feature.max;
            }
            input.step = 'any';
        }

        formGroup.appendChild(label);
        formGroup.appendChild(input);
        formFields.appendChild(formGroup);
    });
}

// Handle form submission
predictionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hide previous results and errors
    resultSection.style.display = 'none';
    errorMessage.style.display = 'none';

    // Disable submit button
    predictBtn.disabled = true;
    predictBtn.querySelector('.btn-text').textContent = 'Predicting...';

    try {
        // Collect form data
        const formData = new FormData(predictionForm);
        const inputData = {};

        modelConfig.features.forEach(feature => {
            const value = formData.get(feature.name);

            if (feature.type === 'numeric') {
                inputData[feature.name] = parseFloat(value);
            } else {
                inputData[feature.name] = value;
            }
        });

        // Make prediction request
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Prediction failed');
        }

        const result = await response.json();

        // Display result
        displayResult(result, inputData);

    } catch (error) {
        showError(error.message);
    } finally {
        // Re-enable submit button
        predictBtn.disabled = false;
        predictBtn.querySelector('.btn-text').textContent = 'Predict';
    }
});

// Display prediction result
function displayResult(result, inputData) {
    // Format the prediction value
    const formattedValue = formatNumber(result.prediction);
    resultValue.textContent = formattedValue;

    // Set unit symbol
    if (result.unit === 'USD') {
        resultUnit.textContent = '$';
    } else {
        resultUnit.textContent = result.unit;
    }

    // Display input summary
    resultDetails.innerHTML = '';

    modelConfig.features.forEach(feature => {
        const detailItem = document.createElement('div');
        detailItem.className = 'detail-item';

        const label = document.createElement('span');
        label.className = 'detail-label';
        label.textContent = feature.display_name;

        const value = document.createElement('span');
        value.className = 'detail-value';
        value.textContent = inputData[feature.name];

        detailItem.appendChild(label);
        detailItem.appendChild(value);
        resultDetails.appendChild(detailItem);
    });

    // Show result section with animation
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Show error message
function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'flex';
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Format number with commas
function formatNumber(num) {
    return Math.round(num).toLocaleString('en-US');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
