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

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

parser = argparse.ArgumentParser(description="Shoulder Shrug Tracker")
parser.add_argument("--reps", type=int, default=10, help="Number of repetitions for shoulder shrugs")
args = parser.parse_args()

cap = cv2.VideoCapture(0)

shrug_count = 0
shrug_complete = False
prev_shrug_height = None
buffer_counter = 0

exercise_order = [("shrug", "motion")]
current_exercise = 0 

engine.say(f"Starting with shoulder shrug.")
engine.runAndWait()

def countdown_transition():
    for i in range(3, 0, -1):
        black_screen = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH, 3), dtype=np.uint8)
        cv2.putText(black_screen, f"{i}", (SCREEN_WIDTH // 2 - 50, SCREEN_HEIGHT // 2),
                    cv2.FONT_HERSHEY_SIMPLEX, 4, (255, 255, 255), 5)
        cv2.imshow("Shoulder Shrug Tracker", black_screen)
        cv2.waitKey(1000) 

with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        SCREEN_HEIGHT, SCREEN_WIDTH, _ = frame.shape  
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb_frame)

        PANEL_X = SCREEN_WIDTH - 200 - 50
        PANEL_Y = (SCREEN_HEIGHT - 100) // 2
        panel = np.zeros((100, 200, 3), dtype=np.uint8)
        color = (0, 255, 255)

        current_shrug, current_direction = exercise_order[current_exercise]

        if results.pose_landmarks:
            left_shoulder = results.pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER]
            right_shoulder = results.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER]

            left_shoulder_y = left_shoulder.y
            right_shoulder_y = right_shoulder.y

            avg_shoulder_y = (left_shoulder_y + right_shoulder_y) / 2

            print(f"Left Shoulder: {left_shoulder_y}, Right Shoulder: {right_shoulder_y}, Average Height: {avg_shoulder_y}")

            if prev_shrug_height is not None:
                if avg_shoulder_y < prev_shrug_height - 0.02 and not shrug_complete:  # Shoulders raised (more lenient)
                    shrug_complete = True
                    print("Shrug up detected")
                elif avg_shoulder_y > prev_shrug_height + 0.02 and shrug_complete: 
                    shrug_complete = False
                    print("Shrug down detected")

                if shrug_complete:
                    buffer_counter += 1
                    if buffer_counter > 5: 
                        shrug_count += 1
                        shrug_complete = False
                        buffer_counter = 0

            prev_shrug_height = avg_shoulder_y  
        progress_width = int((shrug_count / args.reps) * 200)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (50 + progress_width, SCREEN_HEIGHT - 30), (0, 255, 0), -1)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (250, SCREEN_HEIGHT - 30), (255, 255, 255), 2)

        cv2.putText(frame, f"Shoulder Shrugs: {shrug_count}/{args.reps}",
                    (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

        if shrug_count >= args.reps:
            current_exercise += 1
            if current_exercise < len(exercise_order):
                black_screen = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH, 3), dtype=np.uint8)
                cv2.putText(black_screen, f"Next: {exercise_order[current_exercise][0]} shrug",
                            (50, SCREEN_HEIGHT // 2 - 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                cv2.imshow("Shoulder Shrug Tracker", black_screen)
                cv2.waitKey(1000)

                countdown_transition()  

                engine.say(f"Switching to next exercise.")
                engine.runAndWait()
            else:
                engine.say("All exercises completed. Great job!")
                engine.runAndWait()
                break

        cv2.imshow("Shoulder Shrug Tracker", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
