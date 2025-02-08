import cv2
import mediapipe as mp
import numpy as np
import time
import argparse
import pyttsx3
import threading

engine = pyttsx3.init()
voices = engine.getProperty('voices')
for voice in voices:
    if "english" in voice.name.lower() and "female" in voice.name.lower():
        engine.setProperty('voice', voice.id)
        break
engine.setProperty('rate', 175)

parser = argparse.ArgumentParser(description="Shoulder Shrug Tracker")
parser.add_argument("--reps", type=int, default=10, help="Number of repetitions")
args = parser.parse_args()
max_reps = args.reps

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

cap = cv2.VideoCapture(0)

def progress_bar(frame, progress):
    bar_length = 300
    filled_length = int(bar_length * progress)
    cv2.rectangle(frame, (50, 30), (50 + bar_length, 50), (200, 200, 200), -1)
    cv2.rectangle(frame, (50, 30), (50 + filled_length, 50), (0, 255, 0), -1)
    cv2.putText(frame, f"Progress: {int(progress * 100)}%", (50, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

def speak_message(message):
    engine.say(message)
    engine.runAndWait()

start_line = None
shrugged_line = None
rep_count = 0
phase = "start"
body_detected = False
start_time = None
calibrating = False
calibration_complete = False
hold_time = None

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    h, w, _ = frame.shape
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(rgb_frame)

    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark
        right_shoulder_y = int(landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].y * h)
        left_shoulder_y = int(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].y * h)
        avg_shoulder_y = (right_shoulder_y + left_shoulder_y) // 2
        body_detected = True

        if not calibrating and not calibration_complete:
            threading.Thread(target=speak_message, args=("Hold still to set your resting shoulder position for 5 seconds.",)).start()
            calibrating = True
            start_time = time.time()

        if calibrating and not calibration_complete:
            cv2.putText(frame, "Hold still to set resting shoulder position...", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
            if time.time() - start_time > 5:
                start_line = avg_shoulder_y - 20
                threading.Thread(target=speak_message, args=("Now, shrug your shoulders up and hold for 5 seconds.",)).start()
                start_time = time.time()
                calibrating = False
                calibration_complete = "shrugged"

        elif calibration_complete == "shrugged":
            cv2.putText(frame, "Hold shrugged position for 5 seconds...", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
            if shrugged_line is None or avg_shoulder_y < shrugged_line:
                shrugged_line = avg_shoulder_y + 10
            if time.time() - start_time > 5:
                calibration_complete = True
                threading.Thread(target=speak_message, args=("Calibration complete. Start shrugging your shoulders.",)).start()

    else:
        body_detected = False
        cv2.putText(frame, "Ensure your upper body is in frame!", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

    if start_line and shrugged_line:
        cv2.line(frame, (50, start_line), (w - 50, start_line), (255, 0, 0), 2)
        cv2.line(frame, (50, shrugged_line), (w - 50, shrugged_line), (0, 255, 0), 2)
        if phase == "start" and avg_shoulder_y >= start_line - 5:
            phase = "up"
        elif phase == "up" and avg_shoulder_y <= shrugged_line + 5:
            hold_time = time.time()
            phase = "hold"
        elif phase == "hold" and time.time() - hold_time >= 0.5:
            phase = "down"
        elif phase == "down" and avg_shoulder_y >= start_line - 5:
            rep_count += 1
            phase = "start"

    progress_bar(frame, rep_count / max_reps)

    cv2.putText(frame, f"Reps: {rep_count}/{max_reps}", (50, h - 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    if rep_count >= max_reps:
        threading.Thread(target=speak_message, args=("Exercise completed. Great job!",)).start()
        break

    mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                              mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=3),
                              mp_drawing.DrawingSpec(color=(255, 0, 0), thickness=2, circle_radius=2))

    cv2.imshow("Shoulder Shrug Tracker", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
