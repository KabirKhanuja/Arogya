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

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

# Argument parser for reps
parser = argparse.ArgumentParser(description="Wrist Rotation Tracker")
parser.add_argument("--reps", type=int, default=5, help="Number of repetitions per direction per hand")
args = parser.parse_args()

# OpenCV Video Capture
cap = cv2.VideoCapture(0)

# Rotation tracking variables
rotation_count = {"right_clockwise": 0, "right_counterclockwise": 0, "left_clockwise": 0, "left_counterclockwise": 0}
prev_angle = {"right": None, "left": None}
rotation_complete = {"right": False, "left": False}
buffer_counter = {"right": 0, "left": 0}

# Panel settings
PANEL_WIDTH, PANEL_HEIGHT = 300, 300
SCREEN_WIDTH, SCREEN_HEIGHT = 640, 480  # Default screen size

# Exercise sequence: Right Hand (CW → CCW) → Left Hand (CW → CCW)
exercise_order = [
    ("right", "clockwise"),
    ("right", "counterclockwise"),
    ("left", "clockwise"),
    ("left", "counterclockwise")
]
current_exercise = 0  # Start with right hand clockwise

# Announce the first exercise
engine.say(f"Starting with the {exercise_order[0][0]} hand, {exercise_order[0][1]}.")
engine.runAndWait()

# Timer Start
start_time = time.time()

# Function for countdown transition
def countdown_transition():
    for i in range(3, 0, -1):
        black_screen = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH, 3), dtype=np.uint8)
        cv2.putText(black_screen, f"{i}", (SCREEN_WIDTH // 2 - 50, SCREEN_HEIGHT // 2),
                    cv2.FONT_HERSHEY_SIMPLEX, 4, (255, 255, 255), 5)
        cv2.imshow("Wrist Rotation Tracker", black_screen)
        cv2.waitKey(1000)  # Wait for 1 second

# Start MediaPipe Hands
with mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5, max_num_hands=1) as hands:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Flip image for a mirrored effect
        frame = cv2.flip(frame, 1)
        SCREEN_HEIGHT, SCREEN_WIDTH, _ = frame.shape  # Adjust dynamically
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb_frame)

        # Determine current hand & direction
        current_hand, current_direction = exercise_order[current_exercise]
        current_key = f"{current_hand}_{current_direction}"

        # Set UI elements
        PANEL_X = SCREEN_WIDTH - PANEL_WIDTH - 50 if current_hand == "right" else 50
        PANEL_Y = (SCREEN_HEIGHT - PANEL_HEIGHT) // 2
        panel = np.zeros((PANEL_HEIGHT, PANEL_WIDTH, 3), dtype=np.uint8)
        color = (0, 255, 255)

        if results.multi_hand_landmarks:
            for hand_landmarks, handedness in zip(results.multi_hand_landmarks, results.multi_handedness):
                hand_label = handedness.classification[0].label.lower()
                if hand_label != current_hand:
                    continue  # Ignore if it's not the current hand

                # Get key landmarks
                wrist = hand_landmarks.landmark[mp_hands.HandLandmark.WRIST]
                index_base = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_MCP]

                # Convert coordinates
                h, w, _ = frame.shape
                wrist_x, wrist_y = int(wrist.x * w), int(wrist.y * h)
                index_x, index_y = int(index_base.x * w), int(index_base.y * h)

                # Draw hand
                mp_drawing.draw_landmarks(panel, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                # Calculate rotation angle
                angle = np.arctan2(index_y - wrist_y, index_x - wrist_x) * 180 / np.pi

                # Rotation detection
                if prev_angle[hand_label] is not None:
                    diff = angle - prev_angle[hand_label]

                    # Check rotation direction
                    if (current_direction == "clockwise" and diff > 8) or (current_direction == "counterclockwise" and diff < -8):
                        rotation_complete[hand_label] = True

                    # Count reps
                    if rotation_complete[hand_label] and abs(angle) > 140:
                        buffer_counter[hand_label] += 1
                        if buffer_counter[hand_label] > 7:
                            rotation_count[current_key] += 1
                            rotation_complete[hand_label] = False
                            buffer_counter[hand_label] = 0

                prev_angle[hand_label] = angle

        # Progress Bar
        progress_width = int((rotation_count[current_key] / args.reps) * 300)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (50 + progress_width, SCREEN_HEIGHT - 30), (0, 255, 0), -1)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (350, SCREEN_HEIGHT - 30), (255, 255, 255), 2)

        # Display Information
        cv2.putText(frame, f"{current_hand.capitalize()} Hand - {current_direction.capitalize()} Rotations: {rotation_count[current_key]}/{args.reps}",
                    (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

        # Show Panel
        frame[PANEL_Y:PANEL_Y + PANEL_HEIGHT, PANEL_X:PANEL_X + PANEL_WIDTH] = panel

        # Check if reps are completed for this phase
        if rotation_count[current_key] >= args.reps:
            current_exercise += 1
            if current_exercise < len(exercise_order):
                next_hand, next_direction = exercise_order[current_exercise]

                # Show transition screen
                countdown_transition()

                engine.say(f"Switching to {next_hand} hand, {next_direction}.")
                engine.runAndWait()
            else:
                engine.say("All exercises completed. Great job!")
                engine.runAndWait()
                break

        # Show the frame
        cv2.imshow("Wrist Rotation Tracker", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

# Timer End
end_time = time.time()
total_time = int(end_time - start_time)

# Accuracy Calculation
if total_time <= 130:
    accuracy = 100.0
else:
    accuracy = (130 / total_time) * 100

# Display Final Black Screen
final_screen = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH, 3), dtype=np.uint8)
cv2.putText(final_screen, f"Total Time: {total_time} sec", (50, SCREEN_HEIGHT // 2 - 50),
            cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
cv2.putText(final_screen, f"Accuracy: {accuracy:.2f}%", (50, SCREEN_HEIGHT // 2 + 50),
            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
cv2.imshow("Final Results", final_screen)
cv2.waitKey(5000)  # Show for 5 seconds

cap.release()
cv2.destroyAllWindows()
