from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import google.generativeai as genai
import re
import json

load_dotenv()

app = Flask(__name__)
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

def validate_case(user_case):
    """
    Validate if the user's case is relevant for rehabilitation.
    """
    user_case = user_case.lower()
    
    # Keywords for physical and mental health cases
    physical_keywords = ['injury', 'pain', 'surgery', 'acl', 'joint', 'knee', 'shoulder', 'fracture', 'recovery']
    mental_keywords = ['mental', 'addiction', 'alcohol', 'depression', 'anxiety', 'ptsd', 'stress', 'therapy']
    
    if any(keyword in user_case for keyword in physical_keywords):
        return 'physical'
    elif any(keyword in user_case for keyword in mental_keywords):
        return 'mental'
    return None

@app.route('/validate-case', methods=['POST'])
def validate_user_case():
    """
    Validate the user's rehabilitation case.
    """
    try:
        data = request.get_json()  # FIXED: Use get_json() correctly
        if not data or 'case' not in data:
            return jsonify({'error': 'Missing case data'}), 400

        case_type = validate_case(data['case'])
        if not case_type:
            return jsonify({'error': 'Invalid rehabilitation case. Please describe a physical injury, surgery, or mental health condition.'}), 400

        return jsonify({'case_type': case_type})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_prompt(user_input, case_type):
    """
    Generate a detailed prompt for Gemini API based on user input.
    """
    base_prompt = f"""Generate a valid JSON rehabilitation roadmap for a {user_input['age']}-year-old {user_input['gender']} with the following details. 
    The response must be ONLY valid JSON without any other text or markdown.
    Patient details:
    - Height: {user_input['height']} cm
    - Weight: {user_input['weight']} kg
    - Medical History: {user_input['medical_history']}
    - Past Surgeries: {user_input['past_surgeries']}
    - Current Medications: {user_input['current_medications']}
    - Allergies: {user_input['allergies']}
    - Case: {user_input['case']}
    """
    
    if case_type == 'physical':
        return base_prompt + """
        The JSON should include:
        1. exercises (array of objects with name, description, sets, reps, duration)
        2. precautions (array of strings)
        3. milestones (array of objects with description and progress)
        4. timeline (object with key dates)
        Use only valid JSON format without any explanations or comments."""
    else:
        return base_prompt + """
        The JSON should include:
        1. activities (array of objects with name, time, duration, description)
        2. precautions (array of strings)
        3. milestones (array of objects with description and progress)
        4. timeline (object with key dates)
        Use only valid JSON format without any explanations or comments."""

def clean_gemini_response(response_text):
    """
    Clean the Gemini API response to extract valid JSON.
    """
    try:
        # Remove markdown code block syntax
        response_text = re.sub(r'^```json\n|^```\n|```$', '', response_text, flags=re.MULTILINE).strip()
        
        # Fix common JSON formatting issues
        response_text = re.sub(r'(?m)^\s*//.*$', '', response_text)  # Remove comments
        response_text = re.sub(r',\s*}', '}', response_text)  # Remove trailing commas
        response_text = re.sub(r',\s*]', ']', response_text)  # Remove trailing commas in arrays
        
        # Parse the JSON to ensure it's valid
        try:
            json_data = json.loads(response_text)
            return json_data
        except json.JSONDecodeError:
            # If parsing fails, try to fix quotes
            response_text = re.sub(r'(?<!\\)"(\w+)":', r'"\1":', response_text)  # Fix quote issues in keys
            return json.loads(response_text)
            
    except Exception as e:
        print(f"Debug - Raw response: {response_text}")  # For debugging
        raise ValueError(f"Failed to parse JSON response: {str(e)}")

@app.route('/generate-roadmap', methods=['POST'])
def generate_roadmap():
    """
    Generate a personalized roadmap based on user details.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Missing user input'}), 400

        if 'case_type' not in data:
            return jsonify({'error': 'Missing case type'}), 400

        prompt = generate_prompt(data, data['case_type'])
        
        # Request response from Gemini API
        response = model.generate_content(prompt + "\nRespond with ONLY valid JSON.")

        if not response.text:
            return jsonify({'error': 'Empty response from Gemini API'}), 500
        
        # Clean and validate the Gemini response
        json_response = clean_gemini_response(response.text)
        return jsonify({'roadmap': json_response})
    
    except Exception as e:
        print(f"Error generating roadmap: {str(e)}")  # For debugging
        return jsonify({'error': f"Failed to generate roadmap: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
