import cv2
import mediapipe as mp
import numpy as np
import time
import argparse
import pyttsx3

engine = pyttsx3.init()
voices = engine.getProperty('voices')
for voice in voices:
    if "english" in voice.name.lower() and "female" in voice.name.lower():
        engine.setProperty('voice', voice.id)
        break
engine.setProperty('rate', 175)

parser = argparse.ArgumentParser(description="Toe Touch Tracker")
parser.add_argument("--reps", type=int, default=10, help="Number of repetitions")
args = parser.parse_args()
max_reps = args.reps

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

cap = cv2.VideoCapture(0)

engine.say("Stand sideways and ensure your full body is in the frame.")
engine.runAndWait()

start_line = None
lower_line = None
rep_count = 0
phase = "start"
body_detected = False
start_time = None
calibrating = False
calibration_complete = False
hold_time = None

def calculate_angle(a, b, c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)
    ba = a - b
    bc = c - b
    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
    angle = np.degrees(np.arccos(np.clip(cosine_angle, -1.0, 1.0)))
    return angle

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    h, w, _ = frame.shape
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(rgb_frame)

    leg_straight = True
    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark
        hip = (int(landmarks[mp_pose.PoseLandmark.RIGHT_HIP].x * w), int(landmarks[mp_pose.PoseLandmark.RIGHT_HIP].y * h))
        knee = (int(landmarks[mp_pose.PoseLandmark.RIGHT_KNEE].x * w), int(landmarks[mp_pose.PoseLandmark.RIGHT_KNEE].y * h))
        ankle = (int(landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE].x * w), int(landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE].y * h))

        angle = calculate_angle(hip, knee, ankle)
        leg_straight = angle > 170  # Leg must be almost straight (near 180°)

        fingertip_y = int(landmarks[mp_pose.PoseLandmark.RIGHT_INDEX].y * h)
        body_detected = True

        if not calibrating and not calibration_complete:
            engine.say("Stand straight for 5 seconds to set your start position.")
            engine.runAndWait()
            calibrating = True
            start_time = time.time()

        if calibrating and not calibration_complete:
            cv2.putText(frame, "Hold still to set start position...", (50, 50), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)

            if time.time() - start_time > 5:
                start_line = fingertip_y + 10 
                engine.say("Now, do one toe touch and hold your lowest position for 5 seconds.")
                engine.runAndWait()
                start_time = time.time()
                calibrating = False
                calibration_complete = "lower"

        elif calibration_complete == "lower":
            cv2.putText(frame, "Hold lowest position for 5 seconds...", (50, 50), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)

            if lower_line is None or fingertip_y > lower_line:
                lower_line = fingertip_y

            if time.time() - start_time > 5:
                calibration_complete = True
                engine.say("Calibration complete. Start your toe touches.")
                engine.runAndWait()

    else:
        body_detected = False
        cv2.putText(frame, "Ensure full body is in frame!", (50, 50), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

    if start_line and lower_line:
        cv2.line(frame, (50, start_line), (w - 50, start_line), (255, 0, 0), 2)
        cv2.line(frame, (50, lower_line), (w - 50, lower_line), (0, 255, 0), 2)

        if phase == "start" and fingertip_y >= start_line - 10:
            phase = "down"

        elif phase == "down" and fingertip_y >= lower_line - 10:
            hold_time = time.time()
            phase = "hold"

        elif phase == "hold" and time.time() - hold_time >= 0.5:
            if leg_straight:
                phase = "up"
            else:
                cv2.putText(frame, "Straighten your leg!", (50, 100), 
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                engine.say("Straighten your leg!")
                engine.runAndWait()
                phase = "start"  # Reset phase if form is incorrect

        elif phase == "up" and fingertip_y <= start_line + 10:
            if leg_straight:
                rep_count += 1
                phase = "start"
                engine.say(f"Repetition {rep_count}")
                engine.runAndWait()
            else:
                cv2.putText(frame, "Straighten your leg!", (50, 100), 
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

    cv2.putText(frame, f"Reps: {rep_count}/{max_reps}", 
                (50, h - 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    if rep_count >= max_reps:
        engine.say("Exercise completed. Great job!")
        engine.runAndWait()
        break

    mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                              mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=3),
                              mp_drawing.DrawingSpec(color=(255, 0, 0), thickness=2, circle_radius=2))

    cv2.imshow("Toe Touch Tracker", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
