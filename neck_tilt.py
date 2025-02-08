import cv2
import mediapipe as mp
import numpy as np
import argparse
import pyttsx3
import time

# Initialize Text-to-Speech Engine
engine = pyttsx3.init()
engine.setProperty('rate', 175)

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Argument parser for reps
parser = argparse.ArgumentParser(description="Neck Tilt Exercise Tracker")
parser.add_argument("--reps", type=int, default=5, help="Number of repetitions per direction")
args = parser.parse_args()

# OpenCV Video Capture
cap = cv2.VideoCapture(0)

# Rep Counting Variables
rep_count = {"tilt_left": 0, "tilt_right": 0}
direction_flag = {"tilt_left": False, "tilt_right": False}
buffer_counter = {"tilt_left": 0, "tilt_right": 0}

# Exercise Sequence (Only Tilts)
exercise_order = ["tilt_left", "tilt_right"]
current_exercise = 0  # Start with Left Tilts

# Announce First Exercise
engine.say(f"Starting with {exercise_order[0].replace('_', ' ')}.")
engine.runAndWait()

# Countdown Transition Function
def countdown_transition():
    for i in range(3, 0, -1):
        black_screen = np.zeros((480, 640, 3), dtype=np.uint8)
        cv2.putText(black_screen, f"{i}", (250, 250), cv2.FONT_HERSHEY_SIMPLEX, 4, (255, 255, 255), 5)
        cv2.imshow("Neck Tilt Tracker", black_screen)
        cv2.waitKey(1000)  # Wait for 1 second

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Flip image for mirrored effect
    frame = cv2.flip(frame, 1)
    h, w, _ = frame.shape
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(rgb_frame)

    # Get Current Exercise
    current_direction = exercise_order[current_exercise]

    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark

        # Get Key Positions
        nose = landmarks[mp_pose.PoseLandmark.NOSE]
        left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
        right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]

        nose_x, nose_y = int(nose.x * w), int(nose.y * h)
        left_shoulder_x, left_shoulder_y = int(left_shoulder.x * w), int(left_shoulder.y * h)
        right_shoulder_x, right_shoulder_y = int(right_shoulder.x * w), int(right_shoulder.y * h)

        # Movement Detection for Tilts
        if current_direction == "tilt_left" and nose_x < left_shoulder_x - 20:
            direction_flag["tilt_left"] = True
        if current_direction == "tilt_right" and nose_x > right_shoulder_x + 20:
            direction_flag["tilt_right"] = True

        # Count Repetitions
        if direction_flag[current_direction] and abs(nose_x - ((left_shoulder_x + right_shoulder_x) // 2)) < 15:
            buffer_counter[current_direction] += 1
            if buffer_counter[current_direction] > 7:
                rep_count[current_direction] += 1
                direction_flag[current_direction] = False
                buffer_counter[current_direction] = 0

    # Progress Bar
    progress_width = int((rep_count[current_direction] / args.reps) * 300)
    cv2.rectangle(frame, (50, 430), (50 + progress_width, 450), (0, 255, 0), -1)
    cv2.rectangle(frame, (50, 430), (350, 450), (255, 255, 255), 2)

    # Show Rep Count
    cv2.putText(frame, f"{current_direction.replace('_', ' ').capitalize()}: {rep_count[current_direction]}/{args.reps}",
                (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

    # Check if Reps Are Completed for This Exercise
    if rep_count[current_direction] >= args.reps:
        current_exercise += 1
        if current_exercise < len(exercise_order):
            next_exercise = exercise_order[current_exercise]

            # Black Screen Transition
            black_screen = np.zeros((480, 640, 3), dtype=np.uint8)
            cv2.putText(black_screen, f"Next: {next_exercise.replace('_', ' ').capitalize()}",
                        (50, 250), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
            cv2.imshow("Neck Tilt Tracker", black_screen)
            cv2.waitKey(1000)

            countdown_transition()  # Show 3...2...1 countdown

            engine.say(f"Switching to {next_exercise.replace('_', ' ')}.")
            engine.runAndWait()
        else:
            engine.say("All exercises completed. Great job!")
            engine.runAndWait()
            break

    # Show the Frame
    cv2.imshow("Neck Tilt Tracker", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
