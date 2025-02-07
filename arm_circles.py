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
parser = argparse.ArgumentParser(description="Arm Circle Tracker")
parser.add_argument("--reps", type=int, default=5, help="Number of repetitions for each arm circle direction")
args = parser.parse_args()

# OpenCV Video Capture
cap = cv2.VideoCapture(0)

# Arm circle tracking variables
circle_count = 0
prev_angle = None
circle_complete = False
buffer_counter = 0
previous_direction = None

# Exercise sequence (Arm Circles: Right Clockwise → Right Anticlockwise → Left Clockwise → Left Anticlockwise)
exercise_order = [("right", "clockwise"), ("right", "anticlockwise"), ("left", "clockwise"), ("left", "anticlockwise")]
current_exercise = 0  # Start with right hand clockwise circles

# Function for countdown transition
def countdown_transition():
    for i in range(3, 0, -1):
        black_screen = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH, 3), dtype=np.uint8)
        cv2.putText(black_screen, f"{i}", (SCREEN_WIDTH // 2 - 50, SCREEN_HEIGHT // 2),
                    cv2.FONT_HERSHEY_SIMPLEX, 4, (255, 255, 255), 5)
        cv2.imshow("Arm Circle Tracker", black_screen)
        cv2.waitKey(1000)  # Wait for 1 second

# Function for providing instructions before starting
def give_instructions():
    engine.say("Next exercise: Arm Circles.")
    engine.say("Extend your arms to the sides and rotate them in small circles.")
    engine.say("Start with right hand clockwise rotations, then switch to anticlockwise.")
    engine.say("After completing, switch to left hand clockwise, then anticlockwise rotations.")
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

        # Set UI elements
        PANEL_X = SCREEN_WIDTH - 200 - 50
        PANEL_Y = (SCREEN_HEIGHT - 100) // 2
        panel = np.zeros((100, 200, 3), dtype=np.uint8)
        color = (0, 255, 255)

        # Determine current exercise direction (right hand or left hand, clockwise or anticlockwise)
        current_hand, current_direction = exercise_order[current_exercise]

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark

            if current_hand == "right":
                shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]
                elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW]
            else:
                shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
                elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW]

            # Convert coordinates
            h, w, _ = frame.shape
            shoulder_x, shoulder_y = int(shoulder.x * w), int(shoulder.y * h)
            elbow_x, elbow_y = int(elbow.x * w), int(elbow.y * h)

            # Calculate the angle between shoulder and elbow using the angle between two vectors (cross product)
            shoulder_to_elbow_x = elbow_x - shoulder_x
            shoulder_to_elbow_y = elbow_y - shoulder_y

            # Calculate angle in degrees using arctangent
            angle = np.arctan2(shoulder_to_elbow_y, shoulder_to_elbow_x) * 180 / np.pi

            # Detect arm rotation direction and count reps
            if prev_angle is not None:
                diff = angle - prev_angle

                # Detect a clockwise rotation
                if current_direction == "clockwise":
                    if diff > 15:  # Detect a clockwise rotation with a larger threshold
                        circle_complete = True

                # Detect an anticlockwise rotation
                elif current_direction == "anticlockwise":
                    if diff < -15:  # Detect an anticlockwise rotation with a larger threshold
                        circle_complete = True

                # Count reps (full circle)
                if circle_complete and abs(angle) > 50:  # Angle threshold for complete rotation (more strict)
                    buffer_counter += 1
                    if buffer_counter > 3:  # Confirm completion after buffer time
                        circle_count += 1
                        circle_complete = False
                        buffer_counter = 0

            prev_angle = angle

        # Progress Bar
        progress_width = int((circle_count / args.reps) * 200)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (50 + progress_width, SCREEN_HEIGHT - 30), (0, 255, 0), -1)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (250, SCREEN_HEIGHT - 30), (255, 255, 255), 2)

        # Display Information
        cv2.putText(frame, f"Arm Circles: {circle_count}/{args.reps}",
                    (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

        # Check if reps are completed for this phase
        if circle_count >= args.reps:
            current_exercise += 1
            if current_exercise < len(exercise_order):
                # Show transition screen
                black_screen = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH, 3), dtype=np.uint8)
                cv2.putText(black_screen, f"Next: {exercise_order[current_exercise][0]} arm {exercise_order[current_exercise][1]}",
                            (50, SCREEN_HEIGHT // 2 - 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                cv2.imshow("Arm Circle Tracker", black_screen)
                cv2.waitKey(1000)

                countdown_transition()  # Show 3...2...1 countdown

                engine.say(f"Switching to {exercise_order[current_exercise][0]} arm {exercise_order[current_exercise][1]} rotation.")
                engine.runAndWait()
            else:
                engine.say("All exercises completed. Great job!")
                engine.runAndWait()
                break

        # Show the frame
        cv2.imshow("Arm Circle Tracker", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
