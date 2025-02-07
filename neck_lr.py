import cv2
import mediapipe as mp
import numpy as np
import argparse
import pyttsx3
import time

# Initialize Text-to-Speech Engine
engine = pyttsx3.init()
voices = engine.getProperty('voices')

# Set Female British English Voice
for voice in voices:
    if "english" in voice.name.lower() and "female" in voice.name.lower():
        engine.setProperty('voice', voice.id)
        break

engine.setProperty('rate', 175)  # Adjusting speed for natural speech

# Argument parser for reps
parser = argparse.ArgumentParser(description="Neck Left-Right Tracker")
parser.add_argument("--reps", type=int, default=5, help="Number of left-right repetitions")
args = parser.parse_args()

# MediaPipe Pose Initialization
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

# OpenCV Video Capture
cap = cv2.VideoCapture(0)

# Tracking variables
prev_x = None
left_reached = False
right_reached = False
rep_count = 0

# Exercise Sequence: Left Side First → Right Side
exercise_order = ["left", "right"]
current_exercise = 0

# Function for countdown transition
def countdown_transition():
    for i in range(3, 0, -1):
        black_screen = np.zeros((480, 640, 3), dtype=np.uint8)
        cv2.putText(black_screen, f"{i}", (640 // 2 - 50, 480 // 2),
                    cv2.FONT_HERSHEY_SIMPLEX, 4, (255, 255, 255), 5)
        cv2.imshow("Neck Left-Right Tracker", black_screen)
        cv2.waitKey(1000)  # Wait for 1 second

# Announce start instructions
engine.say("Starting neck left-right exercise. First, turn your head fully to the left, then fully to the right. Let's begin.")
engine.runAndWait()

# Start with left side
countdown_transition()

# Capture loop
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Flip image for mirror effect
    frame = cv2.flip(frame, 1)
    h, w, _ = frame.shape
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    # Process pose landmarks
    results = pose.process(rgb_frame)
    
    if results.pose_landmarks:
        # Get nose position
        nose = results.pose_landmarks.landmark[mp_pose.PoseLandmark.NOSE]
        nose_x = int(nose.x * w)
        
        # Set movement thresholds dynamically
        if prev_x is None:
            prev_x = nose_x
            center_threshold = w // 2
            left_threshold = center_threshold - 50  # Adjust if needed
            right_threshold = center_threshold + 50  # Adjust if needed
        
        # Detect head movements
        if nose_x < left_threshold:  # Head fully left
            left_reached = True

        if nose_x > right_threshold:  # Head fully right
            right_reached = True
        
        # Count reps when a full left-right cycle is completed
        if left_reached and right_reached:
            rep_count += 1
            left_reached = False
            right_reached = False

        prev_x = nose_x  # Update previous position

    # Progress Bar
    progress_width = int((rep_count / args.reps) * 300)
    cv2.rectangle(frame, (50, h - 50), (50 + progress_width, h - 30), (0, 255, 0), -1)
    cv2.rectangle(frame, (50, h - 50), (350, h - 30), (255, 255, 255), 2)

    # Display info
    cv2.putText(frame, f"Neck Left-Right Reps: {rep_count}/{args.reps}", (50, 50),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

    # Check if reps for left side are complete
    if rep_count >= args.reps and current_exercise == 0:
        current_exercise = 1
        rep_count = 0  # Reset count for right side
        
        # Transition to right side
        black_screen = np.zeros((480, 640, 3), dtype=np.uint8)
        cv2.putText(black_screen, "Switch to Right Side", (50, 240),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        cv2.imshow("Neck Left-Right Tracker", black_screen)
        cv2.waitKey(1000)

        engine.say("Now, switch to the right side. Begin.")
        engine.runAndWait()
        countdown_transition()

    # If both sides are complete, end the exercise
    if rep_count >= args.reps and current_exercise == 1:
        engine.say("Exercise complete. Well done!")
        engine.runAndWait()
        break

    # Show output
    cv2.imshow("Neck Left-Right Tracker", frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
