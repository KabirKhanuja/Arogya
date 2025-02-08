import cv2
import mediapipe as mp
import numpy as np
import time
import argparse
import pyttsx3  # Text-to-speech for voice guidance

# Initialize MediaPipe Face Detection
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh()

# OpenCV Video Capture
cap = cv2.VideoCapture(0)

# Initialize Text-to-Speech Engine
engine = pyttsx3.init()
engine.setProperty("rate", 150)  # Set speech speed

# Argument parser for reps
parser = argparse.ArgumentParser()
parser.add_argument("--reps", type=int, default=5, help="Number of reps to track")
args = parser.parse_args()

# Variables for tracking
initial_nose_x = None
leftmost_nose_x = None
rightmost_nose_x = None
rep_count = 0
phase = "setup_initial"
start_time = time.time()
completed = False  # Flag to prevent repeated completion messages

# Function to Speak Instructions
def speak(text):
    engine.say(text)
    engine.runAndWait()

# Start Instructions
speak("Hold still for 5 seconds to set your initial position.")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)  # Flip for mirror effect
    h, w, _ = frame.shape

    # Convert frame to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_frame)

    if results.multi_face_landmarks:
        face_landmarks = results.multi_face_landmarks[0]

        # Get nose landmark (reference point)
        nose = face_landmarks.landmark[1]  # Nose tip index
        nose_x = int(nose.x * w)

        # Draw nose point
        cv2.circle(frame, (nose_x, int(nose.y * h)), 5, (0, 255, 0), -1)

        # Step 1: Capture Initial Forward Position
        if phase == "setup_initial":
            cv2.putText(frame, "Hold still... Setting Initial Position", (50, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)

            if time.time() - start_time >= 5:
                initial_nose_x = nose_x
                speak("Now, turn your head to the left and hold for five seconds.")
                phase = "setup_left"
                start_time = time.time()

        # Step 2: Capture Leftmost Position
        elif phase == "setup_left":
            cv2.putText(frame, "Turn your head LEFT & hold for 5 seconds", (50, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)

            if time.time() - start_time >= 5:
                leftmost_nose_x = nose_x
                speak("Now, turn your head to the right and hold for five seconds.")
                phase = "setup_right"
                start_time = time.time()

        # Step 3: Capture Rightmost Position
        elif phase == "setup_right":
            cv2.putText(frame, "Turn your head RIGHT & hold for 5 seconds", (50, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)

            if time.time() - start_time >= 5:
                rightmost_nose_x = nose_x
                speak("Start the exercise. Turn fully left and right to complete one repetition.")
                phase = "count_reps"

        # Step 4: Count Repetitions
        elif phase == "count_reps":
            if leftmost_nose_x is not None and rightmost_nose_x is not None:
                # Draw line indicators for reference
                cv2.line(frame, (leftmost_nose_x, 0), (leftmost_nose_x, h), (255, 0, 0), 2)
                cv2.line(frame, (rightmost_nose_x, 0), (rightmost_nose_x, h), (0, 0, 255), 2)

                # Turned fully right
                if nose_x >= rightmost_nose_x - 10:
                    phase = "return_left"

        elif phase == "return_left":
            if nose_x <= leftmost_nose_x + 10:
                rep_count += 1
                print(f"Reps Completed: {rep_count}/{args.reps}")
                phase = "count_reps"

        # Display rep count
        cv2.putText(frame, f"Reps: {rep_count}/{args.reps}", (50, 100),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)

        # Display progress bar
        bar_x = 50
        bar_y = 150
        bar_width = 300
        bar_height = 20
        fill_width = int((rep_count / args.reps) * bar_width)
        cv2.rectangle(frame, (bar_x, bar_y), (bar_x + bar_width, bar_y + bar_height), (200, 200, 200), 2)
        cv2.rectangle(frame, (bar_x, bar_y), (bar_x + fill_width, bar_y + bar_height), (0, 255, 0), -1)

        # Show progress completion (only once)
        if rep_count >= args.reps and not completed:
            speak("Exercise completed. Great job!")
            cv2.putText(frame, "Exercise Completed!", (50, 200),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            completed = True  # Prevents multiple repetitions

            time.sleep(3)  # Give user time to see the completion message
            break  # Exit the program

    cv2.imshow("Neck Rotation Tracker", frame)

    # Press 'q' to quit manually
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
