import streamlit as st
import requests
import json
from datetime import datetime

# Configure page
st.set_page_config(page_title="Rehab Assistant", layout="wide")
st.markdown("""
    <style>
    .stApp {background-color: #1a1a1a; color: white;}
    .css-1d391kg {padding: 2rem;}
    .roadmap-step {padding: 1.5rem; margin: 1rem 0; border-radius: 10px; 
                  background: #2d2d2d; transition: transform .2s;}
    .roadmap-step:hover {transform: scale(1.02);}
    .animated-arrow {animation: bounce 1s infinite;}
    @keyframes bounce {
        0%, 100% {transform: translateX(0);}
        50% {transform: translateX(10px);}
    }
    </style>
    """, unsafe_allow_html=True)

# Initial form
if 'current_step' not in st.session_state:
    st.session_state.current_step = 'case_input'

def show_roadmap(response):
    """
    Display the generated roadmap in an animated and visually appealing way.
    """
    try:
        roadmap = response['roadmap']
        st.header("Your Personalized Rehabilitation Roadmap 🎯")
        
        # Timeline visualization
        with st.expander("📅 Recovery Timeline", expanded=True):
            cols = st.columns(len(roadmap.get('timeline', [])))
            for idx, (step, date) in enumerate(roadmap.get('timeline', {}).items()):
                cols[idx].markdown(f"**{step}**  \n`{date}`")
        
        # Main content
        tab1, tab2, tab3 = st.tabs(["📋 Plan", "⚠️ Precautions", "🏆 Progress Tracking"])
        
        with tab1:
            if 'exercises' in roadmap:
                st.subheader("Daily Exercises 💪")
                for exercise in roadmap['exercises']:
                    with st.container():
                        st.markdown(f"""
                        <div class="roadmap-step">
                            <h3>{exercise['name']}</h3>
                            <p>🔹 Sets: {exercise['sets']} | 🔹 Reps: {exercise['reps']}<br>
                            ⏱ Duration: {exercise['duration']}</p>
                            <details>
                                <summary>Instructions</summary>
                                <p>{exercise['description']}</p>
                            </details>
                        </div>
                        """, unsafe_allow_html=True)
            elif 'activities' in roadmap:
                st.subheader("Daily Activities 🧘")
                for activity in roadmap['activities']:
                    st.markdown(f"""
                    <div class="roadmap-step">
                        <h3>{activity['name']}</h3>
                        <p>⏰ Time: {activity['time']}<br>
                        🕒 Duration: {activity['duration']}</p>
                        <p>{activity['description']}</p>
                    </div>
                    """, unsafe_allow_html=True)
        
        with tab2:
            for precaution in roadmap.get('precautions', []):
                st.markdown(f"⚠️ {precaution}")
        
        with tab3:
            st.subheader("Progress Milestones")
            for milestone in roadmap.get('milestones', []):
                st.progress(milestone['progress'], text=milestone['description'])
                
    except Exception as e:
        st.error(f"Error displaying roadmap: {str(e)}")

# Application flow
if st.session_state.current_step == 'case_input':
    st.title("AI Rehabilitation Assistant 🩺")
    st.markdown("### Step 1: Describe Your Rehabilitation Need")
    case = st.text_area("Describe your rehabilitation need (e.g., 'ACL recovery post-surgery' or 'alcohol addiction support'):", height=100)
    
if st.button("Continue"):
    response = requests.post('http://localhost:5000/validate-case', json={'case': case})

    # Debugging: Print raw response
    print("Raw response:", response.text)

    try:
        validation = response.json()  # Safely decode JSON
    except requests.exceptions.JSONDecodeError:
        st.error("Invalid response from server. Please try again.")
        st.stop()  # Stop execution

    if 'error' in validation:
        st.error(validation['error'])
    else:
        st.session_state.current_step = 'details_form'
        st.session_state.case_type = validation['case_type']
        st.session_state.case_input = case
        st.rerun()


elif st.session_state.current_step == 'details_form':
    st.title("Personal Details 📝")
    st.markdown("### Step 2: Provide Your Personal Information")
    with st.form("user_details"):
        age = st.number_input("Age", min_value=18, max_value=100)
        gender = st.selectbox("Gender", ["Male", "Female", "Other"])
        height = st.number_input("Height (cm)", min_value=100)
        weight = st.number_input("Weight (kg)", min_value=30)
        medical_history = st.text_area("Medical History (e.g., chronic conditions, past injuries)")
        past_surgeries = st.text_area("Past Surgeries (if any)")
        current_medications = st.text_area("Current Medications (if any)")
        allergies = st.text_area("Allergies (if any)")
        
        if st.form_submit_button("Generate Roadmap"):
            user_data = {
                'age': age,
                'gender': gender,
                'height': height,
                'weight': weight,
                'medical_history': medical_history,
                'past_surgeries': past_surgeries,
                'current_medications': current_medications,
                'allergies': allergies,
                'case': st.session_state.case_input,
                'case_type': st.session_state.case_type
            }
            
            response = requests.post('http://localhost:5000/generate-roadmap', 
                                   json=user_data).json()
            
            if 'error' in response:
                st.error(response['error'])
            else:
                st.session_state.roadmap = response
                st.session_state.current_step = 'roadmap'
                st.rerun()

elif st.session_state.current_step == 'roadmap':
    show_roadmap(st.session_state.roadmap)
    if st.button("Start Over"):
        st.session_state.clear()
        st.rerun()