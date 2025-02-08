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

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

# Argument parser for reps
parser = argparse.ArgumentParser(description="Elbow Flexion & Extension Tracker")
parser.add_argument("--reps", type=int, default=5, help="Number of repetitions for each arm")
args = parser.parse_args()

# OpenCV Video Capture
cap = cv2.VideoCapture(0)

# Elbow flexion tracking variables
rep_count = 0
prev_angle = None
flexion_complete = False
buffer_counter = 0

# Exercise sequence (Right Arm First → Left Arm Next)
exercise_order = ["right", "left"]
current_exercise = 0  # Start with right arm

# Function for countdown transition
def countdown_transition():
    for i in range(3, 0, -1):
        black_screen = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH, 3), dtype=np.uint8)
        cv2.putText(black_screen, f"{i}", (SCREEN_WIDTH // 2 - 50, SCREEN_HEIGHT // 2),
                    cv2.FONT_HERSHEY_SIMPLEX, 4, (255, 255, 255), 5)
        cv2.imshow("Elbow Flexion Tracker", black_screen)
        cv2.waitKey(1000)  # Wait for 1 second

# Function for providing instructions before starting
def give_instructions():
    engine.say("Next exercise: Elbow Flexion and Extension.")
    engine.say("Start with your right arm. Bend your elbow to bring your hand towards your shoulder, then extend it back fully.")
    engine.say("Once done, switch to your left arm.")
    engine.runAndWait()

# Start MediaPipe Pose
with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    
    # Give initial instructions
    give_instructions()

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Flip image for a mirrored effect
        frame = cv2.flip(frame, 1)
        SCREEN_HEIGHT, SCREEN_WIDTH, _ = frame.shape  # Adjust dynamically
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb_frame)

        # Determine current arm (right or left)
        current_arm = exercise_order[current_exercise]

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark

            if current_arm == "right":
                shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]
                elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW]
                wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST]
            else:
                shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
                elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW]
                wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST]

            # Convert coordinates
            h, w, _ = frame.shape
            shoulder_x, shoulder_y = int(shoulder.x * w), int(shoulder.y * h)
            elbow_x, elbow_y = int(elbow.x * w), int(elbow.y * h)
            wrist_x, wrist_y = int(wrist.x * w), int(wrist.y * h)

            # Calculate the elbow angle using the law of cosines
            a = np.linalg.norm(np.array([shoulder_x, shoulder_y]) - np.array([elbow_x, elbow_y]))
            b = np.linalg.norm(np.array([elbow_x, elbow_y]) - np.array([wrist_x, wrist_y]))
            c = np.linalg.norm(np.array([shoulder_x, shoulder_y]) - np.array([wrist_x, wrist_y]))

            if a > 0 and b > 0:
                angle = np.arccos((a**2 + b**2 - c**2) / (2 * a * b)) * 180 / np.pi
            else:
                angle = 0

            # Detect flexion and extension
            if prev_angle is not None:
                if angle < 45:  # Detect flexion (elbow bent)
                    flexion_complete = True
                elif angle > 160 and flexion_complete:  # Detect extension (elbow straightened)
                    buffer_counter += 1
                    if buffer_counter > 3:  # Confirm completion after buffer time
                        rep_count += 1
                        flexion_complete = False
                        buffer_counter = 0

            prev_angle = angle

        # Progress Bar
        progress_width = int((rep_count / args.reps) * 200)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (50 + progress_width, SCREEN_HEIGHT - 30), (0, 255, 0), -1)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (250, SCREEN_HEIGHT - 30), (255, 255, 255), 2)

        # Display Information
        cv2.putText(frame, f"Elbow Flexion: {rep_count}/{args.reps}",
                    (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

        # Check if reps are completed for this arm
        if rep_count >= args.reps:
            current_exercise += 1
            if current_exercise < len(exercise_order):
                # Show transition screen
                black_screen = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH, 3), dtype=np.uint8)
                cv2.putText(black_screen, f"Next: {exercise_order[current_exercise]} arm flexion",
                            (50, SCREEN_HEIGHT // 2 - 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                cv2.imshow("Elbow Flexion Tracker", black_screen)
                cv2.waitKey(1000)

                countdown_transition()  # Show 3...2...1 countdown

                engine.say(f"Switching to {exercise_order[current_exercise]} arm flexion.")
                engine.runAndWait()
                rep_count = 0  # Reset rep count for new arm
            else:
                engine.say("All exercises completed. Great job!")
                engine.runAndWait()
                break

        # Show the frame
        cv2.imshow("Elbow Flexion Tracker", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
