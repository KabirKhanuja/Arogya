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

parser = argparse.ArgumentParser(description="Arm Circle Tracker")
parser.add_argument("--reps", type=int, default=5, help="Number of repetitions for each arm circle direction")
args = parser.parse_args()

cap = cv2.VideoCapture(0)

circle_count = 0
prev_angle = None
circle_complete = False
buffer_counter = 0
previous_direction = None

exercise_order = [("right", "clockwise"), ("right", "anticlockwise"), ("left", "clockwise"), ("left", "anticlockwise")]
current_exercise = 0

def countdown_transition():
    for i in range(3, 0, -1):
        black_screen = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH, 3), dtype=np.uint8)
        cv2.putText(black_screen, f"{i}", (SCREEN_WIDTH // 2 - 50, SCREEN_HEIGHT // 2),
                    cv2.FONT_HERSHEY_SIMPLEX, 4, (255, 255, 255), 5)
        cv2.imshow("Arm Circle Tracker", black_screen)
        cv2.waitKey(1000)  

def give_instructions():
    engine.say("Next exercise: Arm Circles.")
    engine.say("Extend your arms to the sides and rotate them in small circles.")
    engine.say("Start with right hand clockwise rotations, then switch to anticlockwise.")
    engine.say("After completing, switch to left hand clockwise, then anticlockwise rotations.")
    engine.runAndWait()

with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    
    give_instructions()

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

        current_hand, current_direction = exercise_order[current_exercise]

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark

            if current_hand == "right":
                shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]
                elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW]
            else:
                shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
                elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW]

            h, w, _ = frame.shape
            shoulder_x, shoulder_y = int(shoulder.x * w), int(shoulder.y * h)
            elbow_x, elbow_y = int(elbow.x * w), int(elbow.y * h)

            shoulder_to_elbow_x = elbow_x - shoulder_x
            shoulder_to_elbow_y = elbow_y - shoulder_y

            angle = np.arctan2(shoulder_to_elbow_y, shoulder_to_elbow_x) * 180 / np.pi

            if prev_angle is not None:
                diff = angle - prev_angle

                if current_direction == "clockwise":
                    if diff > 15:  
                        circle_complete = True

                elif current_direction == "anticlockwise":
                    if diff < -15: 
                        circle_complete = True

                if circle_complete and abs(angle) > 50: 
                    buffer_counter += 1
                    if buffer_counter > 3: 
                        circle_count += 1
                        circle_complete = False
                        buffer_counter = 0

            prev_angle = angle

        progress_width = int((circle_count / args.reps) * 200)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (50 + progress_width, SCREEN_HEIGHT - 30), (0, 255, 0), -1)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (250, SCREEN_HEIGHT - 30), (255, 255, 255), 2)

        cv2.putText(frame, f"Arm Circles: {circle_count}/{args.reps}",
                    (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

        if circle_count >= args.reps:
            current_exercise += 1
            if current_exercise < len(exercise_order):
                black_screen = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH, 3), dtype=np.uint8)
                cv2.putText(black_screen, f"Next: {exercise_order[current_exercise][0]} arm {exercise_order[current_exercise][1]}",
                            (50, SCREEN_HEIGHT // 2 - 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                cv2.imshow("Arm Circle Tracker", black_screen)
                cv2.waitKey(1000)

                countdown_transition()

                engine.say(f"Switching to {exercise_order[current_exercise][0]} arm {exercise_order[current_exercise][1]} rotation.")
                engine.runAndWait()
            else:
                engine.say("All exercises completed. Great job!")
                engine.runAndWait()
                break

        cv2.imshow("Arm Circle Tracker", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
