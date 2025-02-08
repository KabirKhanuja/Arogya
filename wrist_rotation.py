import cv2
import mediapipe as mp
import numpy as np
import argparse
import pyttsx3
import time


engine = pyttsx3.init()
voices = engine.getProperty('voices')


for voice in voices:
    if "english" in voice.name.lower() and "female" in voice.name.lower():
        engine.setProperty('voice', voice.id)
        break

engine.setProperty('rate', 175)  


mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils


parser = argparse.ArgumentParser(description="Wrist Rotation Tracker")
parser.add_argument("--reps", type=int, default=5, help="Number of repetitions per direction per hand")
args = parser.parse_args()


cap = cv2.VideoCapture(0)


rotation_count = {"right_clockwise": 0, "right_counterclockwise": 0, "left_clockwise": 0, "left_counterclockwise": 0}
prev_angle = {"right": None, "left": None}
rotation_complete = {"right": False, "left": False}
buffer_counter = {"right": 0, "left": 0}


PANEL_WIDTH, PANEL_HEIGHT = 300, 300
SCREEN_WIDTH, SCREEN_HEIGHT = 640, 480  


exercise_order = [
    ("right", "clockwise"),
    ("right", "counterclockwise"),
    ("left", "clockwise"),
    ("left", "counterclockwise")
]
current_exercise = 0  


engine.say(f"Starting with the {exercise_order[0][0]} hand, {exercise_order[0][1]}.")
engine.runAndWait()


def countdown_transition():
    for i in range(3, 0, -1):
        black_screen = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH, 3), dtype=np.uint8)
        cv2.putText(black_screen, f"{i}", (SCREEN_WIDTH // 2 - 50, SCREEN_HEIGHT // 2),
                    cv2.FONT_HERSHEY_SIMPLEX, 4, (255, 255, 255), 5)
        cv2.imshow("Wrist Rotation Tracker", black_screen)
        cv2.waitKey(1000)  


with mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5, max_num_hands=1) as hands:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        
        frame = cv2.flip(frame, 1)
        SCREEN_HEIGHT, SCREEN_WIDTH, _ = frame.shape  
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb_frame)

        
        current_hand, current_direction = exercise_order[current_exercise]
        current_key = f"{current_hand}_{current_direction}"

        
        PANEL_X = SCREEN_WIDTH - PANEL_WIDTH - 50 if current_hand == "right" else 50
        PANEL_Y = (SCREEN_HEIGHT - PANEL_HEIGHT) // 2
        panel = np.zeros((PANEL_HEIGHT, PANEL_WIDTH, 3), dtype=np.uint8)
        color = (0, 255, 255)

        if results.multi_hand_landmarks:
            for hand_landmarks, handedness in zip(results.multi_hand_landmarks, results.multi_handedness):
                hand_label = handedness.classification[0].label.lower()
                if hand_label != current_hand:
                    continue  

                
                wrist = hand_landmarks.landmark[mp_hands.HandLandmark.WRIST]
                index_base = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_MCP]

                
                h, w, _ = frame.shape
                wrist_x, wrist_y = int(wrist.x * w), int(wrist.y * h)
                index_x, index_y = int(index_base.x * w), int(index_base.y * h)

                
                mp_drawing.draw_landmarks(panel, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                
                angle = np.arctan2(index_y - wrist_y, index_x - wrist_x) * 180 / np.pi

                
                if prev_angle[hand_label] is not None:
                    diff = angle - prev_angle[hand_label]

                    
                    if (current_direction == "clockwise" and diff > 8) or (current_direction == "counterclockwise" and diff < -8):
                        rotation_complete[hand_label] = True

                    
                    if rotation_complete[hand_label] and abs(angle) > 140:
                        buffer_counter[hand_label] += 1
                        if buffer_counter[hand_label] > 7:
                            rotation_count[current_key] += 1
                            rotation_complete[hand_label] = False
                            buffer_counter[hand_label] = 0

                prev_angle[hand_label] = angle

       
        progress_width = int((rotation_count[current_key] / args.reps) * 300)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (50 + progress_width, SCREEN_HEIGHT - 30), (0, 255, 0), -1)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (350, SCREEN_HEIGHT - 30), (255, 255, 255), 2)

        
        cv2.putText(frame, f"{current_hand.capitalize()} Hand - {current_direction.capitalize()} Rotations: {rotation_count[current_key]}/{args.reps}",
                    (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

        
        frame[PANEL_Y:PANEL_Y + PANEL_HEIGHT, PANEL_X:PANEL_X + PANEL_WIDTH] = panel

        
        if rotation_count[current_key] >= args.reps:
            current_exercise += 1
            if current_exercise < len(exercise_order):
                next_hand, next_direction = exercise_order[current_exercise]

                black_screen = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH, 3), dtype=np.uint8)
                cv2.putText(black_screen, f"Next: {next_hand.capitalize()} Hand - {next_direction.capitalize()}",
                            (50, SCREEN_HEIGHT // 2 - 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                cv2.imshow("Wrist Rotation Tracker", black_screen)
                cv2.waitKey(1000)

                countdown_transition() 

                engine.say(f"Switching to {next_hand} hand, {next_direction}.")
                engine.runAndWait()
            else:
                engine.say("All exercises completed. Great job!")
                engine.runAndWait()
                break

        
        cv2.imshow("Wrist Rotation Tracker", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
