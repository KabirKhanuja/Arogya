import cv2
import mediapipe as mp
import numpy as np
import pyttsx3
import argparse

# Argument parser for reps
parser = argparse.ArgumentParser(description="Shoulder Roll Tracker")
parser.add_argument("--reps", type=int, default=5, help="Number of repetitions per direction")
args = parser.parse_args()

# Initialize Text-to-Speech Engine
engine = pyttsx3.init()
engine.setProperty('rate', 175)

# Set Female British English Voice (if available)
voices = engine.getProperty('voices')
for voice in voices:
    if "english" in voice.name.lower() and "female" in voice.name.lower():
        engine.setProperty('voice', voice.id)
        break

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

# OpenCV Video Capture
cap = cv2.VideoCapture(0)

# Shoulder movement tracking
roll_count = {"forward": 0, "backward": 0}
prev_position = None
movement_stage = None  # "up" or "down"
direction = "forward"  # Start with forward rolls
buffer_counter = 0
motion_threshold = 6  # Sensitivity for movement detection

# Announce starting position
engine.say(f"Position yourself straight. Start with {direction} shoulder rolls.")
engine.runAndWait()

# Function for transition countdown
def countdown_transition():
    for i in range(3, 0, -1):
        black_screen = np.zeros((480, 640, 3), dtype=np.uint8)
        cv2.putText(black_screen, f"{i}", (250, 250),
                    cv2.FONT_HERSHEY_SIMPLEX, 4, (255, 255, 255), 5)
        cv2.imshow("Shoulder Roll Tracker", black_screen)
        cv2.waitKey(1000)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Flip image for natural mirror effect
    frame = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(rgb_frame)

    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark

        # Get shoulder Y-coordinates
        h, w, _ = frame.shape
        left_y = int(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].y * h)
        right_y = int(landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].y * h)

        # Compute average shoulder height
        avg_shoulder_y = (left_y + right_y) // 2

        # Track movement range
        if prev_position is not None:
            if avg_shoulder_y < prev_position - motion_threshold:  # Shoulders move UP
                movement_stage = "up"
            elif avg_shoulder_y > prev_position + motion_threshold and movement_stage == "up":  # Shoulders move DOWN
                movement_stage = "down"
                buffer_counter += 1  # Count only after a full up-down cycle

                if buffer_counter >= 1:  # Adjusted for better responsiveness
                    roll_count[direction] += 1
                    buffer_counter = 0

        prev_position = avg_shoulder_y

    # Progress Bar
    progress_width = int((roll_count[direction] / args.reps) * 300)
    cv2.rectangle(frame, (50, 400), (50 + progress_width, 420), (0, 255, 0), -1)
    cv2.rectangle(frame, (50, 400), (350, 420), (255, 255, 255), 2)

    # Display Information
    cv2.putText(frame, f"Shoulder Rolls - {direction.capitalize()}: {roll_count[direction]}/{args.reps}",
                (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

    # Check if reps completed for this phase
    if roll_count[direction] >= args.reps:
        if direction == "forward":
            direction = "backward"
            roll_count["backward"] = 0  # Reset backward reps count
            engine.say("Now switch to backward rolls.")
            engine.runAndWait()
            countdown_transition()
        else:
            engine.say("All shoulder rolls completed. Well done!")
            engine.runAndWait()
            break

    # Show the frame
    cv2.imshow("Shoulder Roll Tracker", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
