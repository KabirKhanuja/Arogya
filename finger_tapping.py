import cv2
import mediapipe as mp
import numpy as np
import pyttsx3
import time

# Initialize Text-to-Speech Engine
engine = pyttsx3.init()
engine.setProperty('rate', 175)

# Select Female British English Voice
voices = engine.getProperty('voices')
for voice in voices:
    if "english" in voice.name.lower() and "female" in voice.name.lower():
        engine.setProperty('voice', voice.id)
        break

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

# OpenCV Video Capture
cap = cv2.VideoCapture(0)

# Exercise Variables
exercise_order = ["right", "left"]
current_exercise = 0
finger_tap_count = 0
reps = 10  # Adjust repetitions as needed
tapping_complete = False
SCREEN_WIDTH, SCREEN_HEIGHT = 640, 480  # Default screen size

# Panel settings
PANEL_WIDTH, PANEL_HEIGHT = 300, 300

# Announce First Exercise
engine.say(f"Start with the {exercise_order[0]} hand.")
engine.runAndWait()

# Function for Transition Countdown
def countdown_transition():
    for i in range(3, 0, -1):
        black_screen = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH, 3), dtype=np.uint8)
        cv2.putText(black_screen, f"{i}", (SCREEN_WIDTH // 2 - 50, SCREEN_HEIGHT // 2),
                    cv2.FONT_HERSHEY_SIMPLEX, 4, (255, 255, 255), 5)
        cv2.imshow("Finger Tapping Exercise", black_screen)
        cv2.waitKey(1000)

# Start MediaPipe Hands
with mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5, max_num_hands=1) as hands:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Flip image for mirrored effect
        frame = cv2.flip(frame, 1)
        SCREEN_HEIGHT, SCREEN_WIDTH, _ = frame.shape  # Adjust dynamically
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb_frame)

        # Set current hand for exercise
        current_hand = exercise_order[current_exercise]

        # Set Panel Position
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
                thumb_tip = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_TIP]
                index_tip = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP]
                middle_tip = hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_TIP]
                ring_tip = hand_landmarks.landmark[mp_hands.HandLandmark.RING_FINGER_TIP]
                pinky_tip = hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_TIP]

                # Convert coordinates
                h, w, _ = frame.shape
                thumb_x, thumb_y = int(thumb_tip.x * w), int(thumb_tip.y * h)
                index_x, index_y = int(index_tip.x * w), int(index_tip.y * h)
                middle_x, middle_y = int(middle_tip.x * w), int(middle_tip.y * h)
                ring_x, ring_y = int(ring_tip.x * w), int(ring_tip.y * h)
                pinky_x, pinky_y = int(pinky_tip.x * w), int(pinky_tip.y * h)

                # Draw hand landmarks
                mp_drawing.draw_landmarks(panel, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                # Check if thumb is touching any finger
                threshold = 30  # Distance threshold
                if (abs(thumb_x - index_x) < threshold and abs(thumb_y - index_y) < threshold) or \
                   (abs(thumb_x - middle_x) < threshold and abs(thumb_y - middle_y) < threshold) or \
                   (abs(thumb_x - ring_x) < threshold and abs(thumb_y - ring_y) < threshold) or \
                   (abs(thumb_x - pinky_x) < threshold and abs(thumb_y - pinky_y) < threshold):
                    if not tapping_complete:
                        finger_tap_count += 1
                        tapping_complete = True
                else:
                    tapping_complete = False

        # Progress Bar
        progress_width = int((finger_tap_count / reps) * 300)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (50 + progress_width, SCREEN_HEIGHT - 30), (0, 255, 0), -1)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (350, SCREEN_HEIGHT - 30), (255, 255, 255), 2)

        # Display Information
        cv2.putText(frame, f"{current_hand.capitalize()} Hand - Taps: {finger_tap_count}/{reps}",
                    (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

        # Show Panel
        frame[PANEL_Y:PANEL_Y + PANEL_HEIGHT, PANEL_X:PANEL_X + PANEL_WIDTH] = panel

        # Check if reps are completed for this phase
        if finger_tap_count >= reps:
            current_exercise += 1
            if current_exercise < len(exercise_order):
                next_hand = exercise_order[current_exercise]

                # Show transition screen
                black_screen = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH, 3), dtype=np.uint8)
                cv2.putText(black_screen, f"Next: {next_hand.capitalize()} Hand",
                            (50, SCREEN_HEIGHT // 2 - 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                cv2.imshow("Finger Tapping Exercise", black_screen)
                cv2.waitKey(1000)

                countdown_transition()  # Show 3...2...1 countdown

                engine.say(f"Switching to {next_hand} hand.")
                engine.runAndWait()
                finger_tap_count = 0  # Reset count for the new hand
            else:
                engine.say("All exercises completed. Great job!")
                engine.runAndWait()
                break

        # Show the frame
        cv2.imshow("Finger Tapping Exercise", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
