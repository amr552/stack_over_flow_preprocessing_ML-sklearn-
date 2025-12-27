# Stack Overflow Salary Prediction (sklearn preprocessing)

This is a small ML project where I practice **cleaning + feature engineering** on a “dirty” Stack Overflow–style dataset, then train regression models to predict **ConvertedSalary**.

## What’s inside
- Load and inspect the dataset (pandas)
- Handle missing values (SimpleImputer)
- Encode categorical columns (OneHotEncoder)
- Scale numeric columns when needed (StandardScaler)
- Train and compare a few models (baseline + others)
- Evaluate with MAE / R²
- Save the trained pipeline (preprocessing + model) so it can be reused later

## Target
- `ConvertedSalary`

## Main features
- Numeric: `Age`, `Years Experience`, `StackOverflowJobsRecommend`
- Categorical: `FormalEducation`, `Hobby`, `Country/Region`, `VersionControl`, `Gender`

## How to run
1. Install requirements
   ```bash
   pip install -r requirements.txt

<!--
A beautiful, interactive web application for testing machine learning models. Currently configured for **Stack Overflow Salary Prediction**, but easily adaptable for any ML project.
![ML Model Predictor](https://img.shields.io/badge/ML-Predictor-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.8+-green?style=for-the-badge)
![Flask](https://img.shields.io/badge/Flask-3.0-black?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
## ✨ Features

- 🎨 **Premium Design** - Modern UI with glassmorphism, gradients, and smooth animations
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- ⚡ **Dynamic Form Generation** - Automatically creates forms based on model configuration
- 🔄 **Easy Model Switching** - Simple JSON configuration for different ML models
- 🎯 **Real-time Predictions** - Instant results with beautiful visualizations
- 🌐 **GitHub Pages Ready** - Frontend can be hosted for free on GitHub Pages
- 🛠️ **Developer Friendly** - Clean, well-documented code

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- A trained machine learning model (`.pkl` file)
<!--
## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Start the Backend Server

```bash
python app.py
```

The API will start running at `http://localhost:5000`

### 3. Open the Frontend

Simply open `index.html` in your web browser, or use a local server:

```bash
# Using Python's built-in server
python -m http.server 8000
```

Then navigate to `http://localhost:8000`

## 📁 Project Structure

```
├── app.py                          # Flask backend API
├── model_config.json               # Model configuration (EDIT THIS for new models)
├── stackoverflow_salary_predict.pkl # Trained ML model
├── requirements.txt                # Python dependencies
├── index.html                      # Main web interface
├── styles.css                      # Premium styling
├── script.js                       # Frontend logic
└── README.md                       # This file
```

## 🔧 How to Adapt for Your ML Model

This application is designed to be easily modified for any machine learning project. Follow these steps:

### Step 1: Update `model_config.json`

Edit the configuration file to match your model's requirements:

```json
{
  "model": {
    "name": "Your Model Name",
    "description": "Description of what your model predicts",
    "model_file": "your_model.pkl",
    "type": "regression"  // or "classification"
  },
  "features": [
    {
      "name": "feature_name",
      "display_name": "Feature Display Name",
      "type": "categorical",  // or "numeric"
      "required": true,
      "options": ["Option 1", "Option 2"],  // for categorical
      "encoding": {
        "0": "Option 1",
        "1": "Option 2"
      }
    }
  ],
  "output": {
    "name": "prediction_name",
    "display_name": "Predicted Value",
    "type": "numeric",
    "unit": "USD",  // or any other unit
    "scaling": {
      "type": "minmax",
      "min_value": 0,
      "max_value": 200000
    }
  }
}
```

### Step 2: Update the Model File

Replace `stackoverflow_salary_predict.pkl` with your trained model file and update the `model_file` path in `model_config.json`.

### Step 3: Test Your Configuration

1. Restart the Flask server
2. Refresh the web page
3. The form will automatically update based on your new configuration

That's it! The application will automatically adapt to your model.

## 🌐 Deploying to GitHub Pages

### Frontend (GitHub Pages)

1. Create a new GitHub repository
2. Push your code to the repository
3. Go to Settings → Pages
4. Select the main branch as the source
5. Your frontend will be live at `https://yourusername.github.io/repository-name`

### Backend (Multiple Options)

Since GitHub Pages only hosts static files, you'll need to deploy the Flask backend separately:

#### Option 1: Render (Recommended - Free)

1. Create account at [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `python app.py`
6. Deploy!

#### Option 2: PythonAnywhere (Free)

1. Create account at [pythonanywhere.com](https://www.pythonanywhere.com)
2. Upload your files
3. Create a new web app
4. Configure WSGI file to point to your Flask app
5. Reload the web app

#### Option 3: Heroku

1. Install Heroku CLI
2. Create `Procfile`: `web: python app.py`
3. Deploy using Heroku CLI

### Update API URL

After deploying the backend, update the `API_URL` in `script.js`:

```javascript
const API_URL = 'https://your-backend-url.com';
```

## 🎨 Customization

### Colors and Theme

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --bg-dark: #0f0f23;
    /* ... more variables */
}
```

### Animations

All animations are defined in `styles.css` and can be customized or disabled.

### Form Layout

The form automatically adapts to your model configuration. No manual HTML editing needed!

## 🧪 Testing

### Test the API

```bash
# Test the home endpoint
curl http://localhost:5000/

# Test the config endpoint
curl http://localhost:5000/config

# Test prediction (example)
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "FormalEducation": "Bachelor'\''s degree (BA. BS. B.Eng.. etc.)",
    "Country_encoded": "United States",
    "VersionControl_encoded": "Git",
    "Age": 28,
    "Years Experience": 5
  }'
```

## 📊 Current Model: Stack Overflow Salary Predictor

The application is currently configured to predict developer salaries based on:

- **Education Level** - Bachelor's, Master's, or other
- **Country** - 17 countries supported
- **Version Control System** - Git or other
- **Age** - 18-65 years
- **Years of Experience** - 0-40 years

The model uses K-Nearest Neighbors (KNN) regression and was trained on Stack Overflow developer survey data.

## 🐛 Troubleshooting

### API Connection Error

- Make sure the Flask server is running (`python app.py`)
- Check that the API URL in `script.js` matches your backend URL
- Verify CORS is enabled in `app.py`

### Model Loading Error

- Ensure the model file path in `model_config.json` is correct
- Verify the model file exists in the project directory
- Check that all required Python packages are installed

### Form Not Displaying

- Check browser console for JavaScript errors
- Verify `model_config.json` is valid JSON
- Ensure the API is returning the config correctly

## 🤝 Contributing

Feel free to fork this project and adapt it for your own ML models! If you make improvements, consider sharing them.

## 📝 License

This project is open source and available for educational and commercial use.

## 🎯 Future Enhancements

- [ ] Add model comparison feature
- [ ] Support for classification models with probability outputs
- [ ] Batch prediction from CSV files
- [ ] Model performance metrics display
- [ ] Dark/Light theme toggle
- [ ] Export predictions to CSV
-->
## 💡 Tips for Best Results

1. **Preprocessing** - Ensure your model's preprocessing matches the configuration
2. **Validation** - Add input validation in both frontend and backend
3. **Error Handling** - Provide clear error messages for users
4. **Documentation** - Keep your model_config.json well-documented
5. **Testing** - Test with various inputs before deployment

---

**Built with ❤️ for Machine Learning**

For questions or issues, please create an issue in the repository.
"# stack_over_flow_preprocessing_ML-sklearn-" 
-->
