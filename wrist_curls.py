import cv2
import mediapipe as mp
import numpy as np
import argparse
import pyttsx3
import time

# Initialize Text-to-Speech Engine
engine = pyttsx3.init()
engine.setProperty('rate', 175)

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

# Argument parser for reps
parser = argparse.ArgumentParser(description="Wrist Curl Tracker")
parser.add_argument("--reps", type=int, default=10, help="Number of repetitions per hand")
args = parser.parse_args()

# OpenCV Video Capture
cap = cv2.VideoCapture(0)

# Exercise state
current_hand = "right"  # Start with right hand
rep_count = 0  # Tracks repetitions for each hand
movement_state = "down"  # Initial movement state

# Panel settings
PANEL_WIDTH, PANEL_HEIGHT = 300, 300
SCREEN_WIDTH, SCREEN_HEIGHT = 640, 480  # Default screen size

# Function for countdown transition
def countdown_transition():
    for i in range(3, 0, -1):
        black_screen = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH, 3), dtype=np.uint8)
        cv2.putText(black_screen, f"{i}", (SCREEN_WIDTH // 2 - 50, SCREEN_HEIGHT // 2),
                    cv2.FONT_HERSHEY_SIMPLEX, 4, (255, 255, 255), 5)
        cv2.imshow("Wrist Curl Tracker", black_screen)
        cv2.waitKey(1000)  # Wait for 1 second

# Announce the start
engine.say(f"Starting with the {current_hand} hand.")
engine.runAndWait()

# Start MediaPipe Hands
with mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5, max_num_hands=1) as hands:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Flip for mirrored effect
        frame = cv2.flip(frame, 1)
        SCREEN_HEIGHT, SCREEN_WIDTH, _ = frame.shape  # Adjust dynamically
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb_frame)

        # Set panel position based on current hand
        PANEL_X = SCREEN_WIDTH - PANEL_WIDTH - 50 if current_hand == "right" else 50
        PANEL_Y = (SCREEN_HEIGHT - PANEL_HEIGHT) // 2
        panel = np.zeros((PANEL_HEIGHT, PANEL_WIDTH, 3), dtype=np.uint8)

        # Process Hand Landmarks
        if results.multi_hand_landmarks:
            for hand_landmarks, handedness in zip(results.multi_hand_landmarks, results.multi_handedness):
                hand_label = handedness.classification[0].label.lower()
                if hand_label != current_hand:
                    continue  # Ignore if it's not the current hand

                # Extract Wrist and Index Finger (as an elbow approximation)
                wrist = hand_landmarks.landmark[mp_hands.HandLandmark.WRIST]
                index_finger = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_PIP]  # Approximate elbow

                # Convert Coordinates
                h, w, _ = frame.shape
                wrist_y = int(wrist.y * h)
                elbow_y = int(index_finger.y * h)

                # Draw Hand
                mp_drawing.draw_landmarks(panel, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                # Define movement threshold relative to elbow
                threshold_up = elbow_y - 20
                threshold_down = elbow_y + 20

                # Track Repetitions Properly
                if movement_state == "down" and wrist_y < threshold_up:
                    movement_state = "up"

                if movement_state == "up" and wrist_y > threshold_down:
                    movement_state = "down"
                    rep_count += 1  # Count one full rep (up & down)

        # Draw Progress Bar
        progress_width = int((rep_count / args.reps) * 300)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (50 + progress_width, SCREEN_HEIGHT - 30), (0, 255, 0), -1)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (350, SCREEN_HEIGHT - 30), (255, 255, 255), 2)

        # Display Information
        cv2.putText(frame, f"{current_hand.capitalize()} Hand Reps: {rep_count}/{args.reps}",
                    (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)

        # Show Panel
        frame[PANEL_Y:PANEL_Y + PANEL_HEIGHT, PANEL_X:PANEL_X + PANEL_WIDTH] = panel

        # Check if reps are completed for this hand
        if rep_count >= args.reps:
            rep_count = 0  # Reset reps for the next hand
            current_hand = "left" if current_hand == "right" else "done"

            if current_hand == "left":
                # Transition Screen
                black_screen = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH, 3), dtype=np.uint8)
                cv2.putText(black_screen, "Switching to Left Hand", (50, SCREEN_HEIGHT // 2 - 50),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                cv2.imshow("Wrist Curl Tracker", black_screen)
                cv2.waitKey(1000)
                countdown_transition()  # Show 3...2...1 countdown

                engine.say("Switching to left hand.")
                engine.runAndWait()

            elif current_hand == "done":
                engine.say("All exercises completed. Well done!")
                engine.runAndWait()
                break

        # Show the frame
        cv2.imshow("Wrist Curl Tracker", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
