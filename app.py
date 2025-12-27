from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import json
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load configuration
with open('model_config.json', 'r') as f:
    config = json.load(f)

# Load the trained model
model_path = config['model']['model_file']
model = joblib.load(model_path)

def preprocess_input(data):
    """
    Preprocess input data according to the model requirements.
    Handles encoding and scaling based on configuration.
    """
    features = []
    
    for feature_config in config['features']:
        feature_name = feature_config['name']
        feature_type = feature_config['type']
        
        if feature_type == 'categorical':
            # Get the value from input
            value = data.get(feature_name)
            
            # Find the encoded value
            encoded_value = None
            for encoded_key, original_value in feature_config['encoding'].items():
                if original_value == value:
                    encoded_value = int(encoded_key)
                    break
            
            if encoded_value is None:
                raise ValueError(f"Invalid value for {feature_name}: {value}")
            
            features.append(encoded_value)
            
        elif feature_type == 'numeric':
            # Get the value and scale it
            value = float(data.get(feature_name))
            
            # Apply MinMax scaling if configured
            if 'scaling' in feature_config and feature_config['scaling']['type'] == 'minmax':
                min_val = feature_config['scaling']['min_value']
                max_val = feature_config['scaling']['max_value']
                scaled_value = (value - min_val) / (max_val - min_val)
                features.append(scaled_value)
            else:
                features.append(value)
    
    return np.array([features])

def postprocess_output(prediction):
    """
    Convert model output back to original scale.
    """
    output_config = config['output']
    
    if 'scaling' in output_config and output_config['scaling']['type'] == 'minmax':
        min_val = output_config['scaling']['min_value']
        max_val = output_config['scaling']['max_value']
        # Inverse MinMax scaling
        original_value = prediction * (max_val - min_val) + min_val
        return original_value
    
    return prediction

@app.route('/')
def home():
    """Home endpoint with API information."""
    return jsonify({
        'message': 'ML Model Prediction API',
        'model': config['model']['name'],
        'version': config['model']['version'],
        'endpoints': {
            '/config': 'GET - Get model configuration',
            '/predict': 'POST - Make a prediction'
        }
    })

@app.route('/config', methods=['GET'])
def get_config():
    """Return the model configuration."""
    return jsonify(config)

@app.route('/predict', methods=['POST'])
def predict():
    """
    Make a prediction based on input data.
    
    Expected JSON format:
    {
        "FormalEducation": "Bachelor's degree (BA. BS. B.Eng.. etc.)",
        "Country_encoded": "United States",
        "VersionControl_encoded": "Git",
        "Age": 28,
        "Years Experience": 5
    }
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Preprocess the input
        features = preprocess_input(data)
        
        # Make prediction
        prediction = model.predict(features)[0]
        
        # Postprocess the output
        result = postprocess_output(prediction)
        
        # Return the prediction
        return jsonify({
            'success': True,
            'prediction': float(result),
            'unit': config['output']['unit'],
            'input': data
        })
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

if __name__ == '__main__':
    print(f"Starting {config['model']['name']} API...")
    print(f"Model loaded from: {model_path}")
    print(f"API running on http://localhost:5000")
    app.run(debug=True, port=5000)
