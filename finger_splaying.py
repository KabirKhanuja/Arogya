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
parser = argparse.ArgumentParser(description="Finger Splaying Tracker")
parser.add_argument("--reps", type=int, default=5, help="Number of repetitions per hand")
args = parser.parse_args()

# OpenCV Video Capture
cap = cv2.VideoCapture(0)

# Tracking variables
splay_count = {"right": 0, "left": 0}
prev_spread = {"right": None, "left": None}
splay_complete = {"right": False, "left": False}

# UI Panel settings
PANEL_WIDTH, PANEL_HEIGHT = 300, 300
SCREEN_WIDTH, SCREEN_HEIGHT = 640, 480  

# Exercise sequence: Right Hand → Left Hand
exercise_order = ["right", "left"]
current_exercise = 0  # Start with right hand

# Announce first hand
engine.say(f"Starting with the {exercise_order[0]} hand.")
engine.runAndWait()

# Function for countdown transition
def countdown_transition():
    for i in range(3, 0, -1):
        black_screen = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH, 3), dtype=np.uint8)
        cv2.putText(black_screen, f"{i}", (SCREEN_WIDTH // 2 - 50, SCREEN_HEIGHT // 2),
                    cv2.FONT_HERSHEY_SIMPLEX, 4, (255, 255, 255), 5)
        cv2.imshow("Finger Splaying Tracker", black_screen)
        cv2.waitKey(1000)

# Start MediaPipe Hands
with mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5, max_num_hands=1) as hands:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Flip image for mirrored effect
        frame = cv2.flip(frame, 1)
        SCREEN_HEIGHT, SCREEN_WIDTH, _ = frame.shape  
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb_frame)

        # Determine current hand
        current_hand = exercise_order[current_exercise]

        # Set UI elements
        PANEL_X = SCREEN_WIDTH - PANEL_WIDTH - 50 if current_hand == "right" else 50
        PANEL_Y = (SCREEN_HEIGHT - PANEL_HEIGHT) // 2
        panel = np.zeros((PANEL_HEIGHT, PANEL_WIDTH, 3), dtype=np.uint8)

        if results.multi_hand_landmarks:
            for hand_landmarks, handedness in zip(results.multi_hand_landmarks, results.multi_handedness):
                hand_label = handedness.classification[0].label.lower()
                if hand_label != current_hand:
                    continue  # Ignore the wrong hand

                # Get key landmarks for tracking spread
                index_tip = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP]
                pinky_tip = hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_TIP]

                # Convert coordinates
                h, w, _ = frame.shape
                index_x, index_y = int(index_tip.x * w), int(index_tip.y * h)
                pinky_x, pinky_y = int(pinky_tip.x * w), int(pinky_tip.y * h)

                # Draw hand
                mp_drawing.draw_landmarks(panel, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                # Calculate spread distance
                spread_distance = abs(pinky_x - index_x)

                # Threshold for detecting spread and closure
                if prev_spread[hand_label] is not None:
                    spread_diff = spread_distance - prev_spread[hand_label]

                    if spread_diff > 15:  # Fingers spreading out
                        splay_complete[hand_label] = True

                    if splay_complete[hand_label] and spread_diff < -15:  # Fingers coming back together
                        splay_count[hand_label] += 1
                        splay_complete[hand_label] = False

                prev_spread[hand_label] = spread_distance

        # Progress Bar
        progress_width = int((splay_count[current_hand] / args.reps) * 300)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (50 + progress_width, SCREEN_HEIGHT - 30), (0, 255, 0), -1)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (350, SCREEN_HEIGHT - 30), (255, 255, 255), 2)

        # Display Information
        cv2.putText(frame, f"{current_hand.capitalize()} Hand - Finger Splays: {splay_count[current_hand]}/{args.reps}",
                    (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

        # Show Panel
        frame[PANEL_Y:PANEL_Y + PANEL_HEIGHT, PANEL_X:PANEL_X + PANEL_WIDTH] = panel

        # Check if reps are completed for this hand
        if splay_count[current_hand] >= args.reps:
            current_exercise += 1
            if current_exercise < len(exercise_order):
                next_hand = exercise_order[current_exercise]

                # Show transition screen
                black_screen = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH, 3), dtype=np.uint8)
                cv2.putText(black_screen, f"Next: {next_hand.capitalize()} Hand",
                            (50, SCREEN_HEIGHT // 2 - 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                cv2.imshow("Finger Splaying Tracker", black_screen)
                cv2.waitKey(1000)

                countdown_transition()  # Show 3...2...1 countdown

                engine.say(f"Switching to {next_hand} hand.")
                engine.runAndWait()
            else:
                engine.say("All exercises completed. Great job!")
                engine.runAndWait()
                break

        # Show the frame
        cv2.imshow("Finger Splaying Tracker", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
