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

engine.setProperty('rate', 175)  # Adjust speed for natural speech

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

# Argument parser for reps
parser = argparse.ArgumentParser(description="Cobra Pose Tracker")
parser.add_argument("--reps", type=int, default=5, help="Number of repetitions")
args = parser.parse_args()

# OpenCV Video Capture
cap = cv2.VideoCapture(0)

# Rep counting variables
rep_count = 0
prev_position = None
buffer_counter = 0
lowered = True  # Track if user has returned to start position

# Announce the exercise
engine.say("Lie flat on your stomach with your legs extended. Place your palms under your shoulders. Begin Cobra Pose.")
engine.runAndWait()

# Start MediaPipe Pose
with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Flip image for a mirrored effect
        frame = cv2.flip(frame, 1)
        SCREEN_HEIGHT, SCREEN_WIDTH, _ = frame.shape  # Adjust dynamically

        # Convert frame to RGB for Mediapipe
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb_frame)

        if results.pose_landmarks:
            # Extract key landmarks
            landmarks = results.pose_landmarks.landmark
            left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
            right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]
            left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP]
            right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP]

            # Convert coordinates
            h, w, _ = frame.shape
            left_shoulder_y = int(left_shoulder.y * h)
            right_shoulder_y = int(right_shoulder.y * h)
            left_hip_y = int(left_hip.y * h)
            right_hip_y = int(right_hip.y * h)

            # Calculate shoulder & hip midpoint heights
            shoulder_avg_y = (left_shoulder_y + right_shoulder_y) / 2
            hip_avg_y = (left_hip_y + right_hip_y) / 2

            # Calculate upper body lift height
            lift_height = hip_avg_y - shoulder_avg_y

            # Determine Cobra Pose movement
            if prev_position is not None:
                height_diff = lift_height - prev_position

                # Detect upward movement (lifting)
                if height_diff < -8:
                    lowered = False

                # Detect downward movement (lowering)
                if height_diff > 8 and not lowered:
                    buffer_counter += 1
                    if buffer_counter > 5:  # Stability check
                        rep_count += 1
                        lowered = True
                        buffer_counter = 0

            prev_position = lift_height

        # Progress Bar
        progress_width = int((rep_count / args.reps) * SCREEN_WIDTH)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (50 + progress_width, SCREEN_HEIGHT - 30), (0, 255, 0), -1)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (SCREEN_WIDTH - 50, SCREEN_HEIGHT - 30), (255, 255, 255), 2)

        # Display Information
        cv2.putText(frame, f"Cobra Pose: {rep_count}/{args.reps}",
                    (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

        # Show the frame
        cv2.imshow("Cobra Pose Tracker", frame)

        # Stop when reps are completed
        if rep_count >= args.reps:
            engine.say("All repetitions completed. Great job!")
            engine.runAndWait()
            break

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
