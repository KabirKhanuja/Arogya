import cv2
import mediapipe as mp
import numpy as np
import pyttsx3
import time

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils

# Initialize Text-to-Speech Engine
engine = pyttsx3.init()
engine.setProperty("rate", 150)
engine.setProperty("volume", 1.0)

# Open Webcam
cap = cv2.VideoCapture(0)

# Squat Counter Variables
squat_counter = 0
squat_position = "up"
progress_bar = 0
MAX_SQUATS = 10
PROGRESS_BAR_MAX = 300  # Full progress bar width
last_feedback = ""
hold_start_time = 0
is_holding = False

def speak(text):
    """Speak the given text aloud."""
    global last_feedback
    if text != last_feedback:
        last_feedback = text
        engine.say(text)
        engine.runAndWait()

def calculate_angle(a, b, c):
    """Calculate the angle between three points (hip, knee, ankle)."""
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)
    
    ba = a - b
    bc = c - b
    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
    angle = np.degrees(np.arccos(np.clip(cosine_angle, -1.0, 1.0)))
    
    return angle

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    height, width, _ = frame.shape
    YELLOW_LINE_Y = int(height * 1 / 4)  # Position at 1/4th from the top

    # Convert BGR to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(rgb_frame)

    feedback_message = "No person detected! Stand in front of the camera."

    if results.pose_landmarks:
        mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        landmarks = results.pose_landmarks.landmark
        
        if (
            landmarks[mp_pose.PoseLandmark.LEFT_HIP].visibility > 0.5 and
            landmarks[mp_pose.PoseLandmark.LEFT_KNEE].visibility > 0.5 and
            landmarks[mp_pose.PoseLandmark.LEFT_ANKLE].visibility > 0.5
        ):
            left_hip = (landmarks[mp_pose.PoseLandmark.LEFT_HIP].x * width, 
                        landmarks[mp_pose.PoseLandmark.LEFT_HIP].y * height)
            left_knee = (landmarks[mp_pose.PoseLandmark.LEFT_KNEE].x * width, 
                         landmarks[mp_pose.PoseLandmark.LEFT_KNEE].y * height)
            left_ankle = (landmarks[mp_pose.PoseLandmark.LEFT_ANKLE].x * width, 
                          landmarks[mp_pose.PoseLandmark.LEFT_ANKLE].y * height)

            knee_angle = calculate_angle(left_hip, left_knee, left_ankle)

            print(f"Knee Angle: {knee_angle:.2f}")

            # Squat detection based on yellow line (NOT knee angle)
            if left_hip[1] >= YELLOW_LINE_Y and squat_position == "up":
                feedback_message = "Go down"
                speak(feedback_message)
                squat_position = "going down"

            elif squat_position == "going down" and left_hip[1] >= YELLOW_LINE_Y + 10:
                if not is_holding:
                    feedback_message = "Hold"
                    speak(feedback_message)
                    hold_start_time = time.time()
                    is_holding = True

            elif is_holding and time.time() - hold_start_time >= 1.5:  # Hold for 1.5 sec
                feedback_message = "Squat detected, stand up"
                speak(feedback_message)
                squat_position = "down"
                is_holding = False

            elif left_hip[1] < YELLOW_LINE_Y and squat_position == "down":
                squat_counter += 1
                squat_position = "up"

                # Update Progress Bar
                progress_bar = int((squat_counter / MAX_SQUATS) * PROGRESS_BAR_MAX)

                feedback_message = f"Squats Done: {squat_counter}"
                speak(feedback_message)

    # Draw Full-width Yellow Line
    cv2.line(frame, (0, YELLOW_LINE_Y), (width, YELLOW_LINE_Y), (0, 255, 255), 3)
    cv2.putText(frame, "Touch the yellow line with your hips for the mini squat", 
                (50, YELLOW_LINE_Y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)

    # Draw Progress Bar
    cv2.rectangle(frame, (50, 50), (350, 70), (0, 255, 0), 2)  # Bar Outline
    cv2.rectangle(frame, (50, 50), (50 + progress_bar, 70), (0, 255, 0), -1)  # Fill Bar

    # Display Squat Count & Feedback
    cv2.putText(frame, f"Squats: {squat_counter}/{MAX_SQUATS}", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
    cv2.putText(frame, feedback_message, (50, 150), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)

    # Completion Message & Exit Condition
    if squat_counter >= MAX_SQUATS or progress_bar >= PROGRESS_BAR_MAX:
        feedback_message = "Exercise complete!"
        speak(feedback_message)
        cv2.putText(frame, feedback_message, (100, 200), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 0), 3)

        # Wait for a few seconds before exiting
        time.sleep(3)
        break  # Exit after reaching the target

    # Show Frame
    cv2.imshow("Mini Squat Counter", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
