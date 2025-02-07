import cv2
import mediapipe as mp
import numpy as np
import pyttsx3
import threading
import time

# Initialize Text-to-Speech Engine
engine = pyttsx3.init()
engine.setProperty("rate", 150)  # Adjust speech speed

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_drawing = mp.solutions.drawing_utils

# Open Webcam
cap = cv2.VideoCapture(0)

# Thresholds for Pose Detection
HIP_ANGLE_THRESHOLD = 160  # Hips should be nearly straight (180° ideal)
SHOULDER_ANGLE_THRESHOLD = 110  # Shoulders should be open (greater than 110°)
TIMER_DURATION = 30  # Time in seconds to hold the pose

# Timer Variables
hold_time = 0  # Tracks total time held
last_time = None  # Last timestamp when posture was correct
pose_correct = False  # Whether posture is currently correct
last_feedback_time = 0  # Prevents repeated speech feedback

# Function to calculate angle between three points
def calculate_angle(a, b, c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)

    if angle > 180.0:
        angle = 360 - angle

    return angle

# Function for voice feedback in a separate thread
def speak_feedback(text):
    global last_feedback_time
    if time.time() - last_feedback_time > 2:  # Prevent rapid feedback
        last_feedback_time = time.time()
        engine.say(text)
        engine.runAndWait()

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Convert Image to RGB
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = pose.process(image)
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    if result.pose_landmarks:
        landmarks = result.pose_landmarks.landmark

        # Get Key Points
        left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].y]
        right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].x, landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].y]
        left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP].y]
        right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP].y]
        left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE].y]
        right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE].y]

        # Calculate Hip and Shoulder Angles
        hip_angle = calculate_angle(left_shoulder, left_hip, left_knee)
        shoulder_angle = calculate_angle(left_hip, left_shoulder, right_shoulder)

        # Check if posture is correct
        if hip_angle >= HIP_ANGLE_THRESHOLD and shoulder_angle >= SHOULDER_ANGLE_THRESHOLD:
            if not pose_correct:  # If just corrected posture
                threading.Thread(target=speak_feedback, args=("Hold the position.",)).start()
                last_time = time.time()  # Start timing from the moment of correction

            if last_time is not None:
                hold_time += time.time() - last_time  # Update total hold time
                last_time = time.time()  # Update last recorded time

            pose_correct = True
        else:
            if pose_correct:  # If posture was correct but now lost
                threading.Thread(target=speak_feedback, args=("Posture lost, pausing timer.",)).start()
            pose_correct = False
            last_time = None  # Stop timing

        # Display Timer on Screen
        timer_text = f"Hold Timer: {int(hold_time)}s" if hold_time > 0 else "Get into position!"
        cv2.putText(image, timer_text, (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.putText(image, f'Hip Angle: {int(hip_angle)}', (50, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        cv2.putText(image, f'Shoulder Angle: {int(shoulder_angle)}', (50, 200), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

        # If timer reaches 30 seconds, complete the exercise
        if hold_time >= TIMER_DURATION:
            threading.Thread(target=speak_feedback, args=("Well done! You completed the hold.",)).start()
            hold_time = 0  # Reset hold time for next session

        # Draw Landmarks
        mp_drawing.draw_landmarks(image, result.pose_landmarks, mp_pose.POSE_CONNECTIONS)

    # Show Output
    cv2.imshow("Upward Dog Exercise Tracker", image)

    if cv2.waitKey(10) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
