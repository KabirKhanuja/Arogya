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

# Initialize MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils

# Argument parser for reps
parser = argparse.ArgumentParser(description="Neck Rotation Tracker")
parser.add_argument("--reps", type=int, default=5, help="Number of repetitions for neck rotation")
args = parser.parse_args()

# OpenCV Video Capture
cap = cv2.VideoCapture(0)

# Rotation tracking variables
rotation_count = 0
prev_angle = None
rotation_complete = False
buffer_counter = 0

# Exercise sequence: Anticlockwise rotation -> Clockwise rotation
exercise_order = ["anticlockwise", "clockwise"]
current_exercise = 0  # Start with anticlockwise rotation

# Announce the first exercise (anticlockwise rotation)
engine.say(f"Starting {exercise_order[current_exercise]} neck rotation.")
engine.runAndWait()

# Function for countdown transition
def countdown_transition():
    for i in range(3, 0, -1):
        black_screen = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH, 3), dtype=np.uint8)
        cv2.putText(black_screen, f"{i}", (SCREEN_WIDTH // 2 - 50, SCREEN_HEIGHT // 2),
                    cv2.FONT_HERSHEY_SIMPLEX, 4, (255, 255, 255), 5)
        cv2.imshow("Neck Rotation Tracker", black_screen)
        cv2.waitKey(1000)  # Wait for 1 second

# Start MediaPipe Face Mesh
with mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5) as face_mesh:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Flip image for a mirrored effect
        frame = cv2.flip(frame, 1)
        SCREEN_HEIGHT, SCREEN_WIDTH, _ = frame.shape  # Adjust dynamically
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(rgb_frame)

        # Set UI elements
        PANEL_X = SCREEN_WIDTH - 200 - 50
        PANEL_Y = (SCREEN_HEIGHT - 100) // 2
        panel = np.zeros((100, 200, 3), dtype=np.uint8)
        color = (0, 255, 255)

        # Determine current exercise direction
        current_direction = exercise_order[current_exercise]

        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                # Get key landmarks for head rotation (e.g., landmark 10, 1, 30, etc.)
                nose = face_landmarks.landmark[1]
                chin = face_landmarks.landmark[152]

                # Convert coordinates
                h, w, _ = frame.shape
                nose_x, nose_y = int(nose.x * w), int(nose.y * h)
                chin_x, chin_y = int(chin.x * w), int(chin.y * h)

                # Calculate rotation angle (based on movement between nose and chin)
                angle = np.arctan2(chin_y - nose_y, chin_x - nose_x) * 180 / np.pi

                # Rotation detection: Detect noticeable rotations
                if prev_angle is not None:
                    diff = angle - prev_angle
                    if current_direction == "anticlockwise":
                        if abs(diff) > 8:  # Increase sensitivity threshold to avoid small movements
                            rotation_complete = True

                    if rotation_complete and abs(angle) > 60:  # Angle threshold for full rotation
                        buffer_counter += 1
                        if buffer_counter > 10:  # Confirm completion after some buffer
                            rotation_count += 1
                            rotation_complete = False
                            buffer_counter = 0

                    # For clockwise rotation, we reverse the direction of angle change
                    if current_direction == "clockwise":
                        if abs(diff) > 8:  # Increase sensitivity threshold
                            rotation_complete = True

                    if rotation_complete and abs(angle) < -60:  # Angle threshold for full clockwise rotation
                        buffer_counter += 1
                        if buffer_counter > 10:  # Confirm completion after some buffer
                            rotation_count += 1
                            rotation_complete = False
                            buffer_counter = 0

                prev_angle = angle

        # Progress Bar
        progress_width = int((rotation_count / args.reps) * 200)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (50 + progress_width, SCREEN_HEIGHT - 30), (0, 255, 0), -1)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (250, SCREEN_HEIGHT - 30), (255, 255, 255), 2)

        # Display Information
        cv2.putText(frame, f"Neck Rotations: {rotation_count}/{args.reps}",
                    (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

        # Check if reps are completed for this phase
        if rotation_count >= args.reps:
            # Show transition screen to indicate completion of the current exercise
            black_screen = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH, 3), dtype=np.uint8)
            cv2.putText(black_screen, "Exercise Complete!", (50, SCREEN_HEIGHT // 2 - 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
            cv2.imshow("Neck Rotation Tracker", black_screen)
            cv2.waitKey(1000)

            # Transition to the next exercise
            current_exercise += 1
            if current_exercise < len(exercise_order):
                # Show countdown only for the transition from anticlockwise to clockwise
                countdown_transition()

                engine.say(f"Switching to {exercise_order[current_exercise]} neck rotation.")
                engine.runAndWait()

            # Reset for next exercise
            rotation_count = 0

        # Show the frame
        cv2.imshow("Neck Rotation Tracker", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
