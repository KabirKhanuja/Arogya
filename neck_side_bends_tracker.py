import cv2
import mediapipe as mp
import numpy as np
import time

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False, model_complexity=1, smooth_landmarks=True)

# Open webcam
cap = cv2.VideoCapture(0)

neck_bend_count = 0
current_side = "LEFT"  # Start with left tilt
bent = False
last_rep_time = 0  

# Pose landmark indices
LEFT_EAR = 7
RIGHT_EAR = 8
LEFT_SHOULDER = 11
RIGHT_SHOULDER = 12

# Movement thresholds
TILT_THRESHOLD = 10  # Detects tilts more easily
RESET_THRESHOLD = 5   # Ensures head returns to center before counting next rep
BUFFER_TIME = 0.5     # Time required before counting next rep

def calculate_angle(a, b):
    """Calculate the angle between two points."""
    return np.degrees(np.arctan2(b[1] - a[1], b[0] - a[0]))

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    h, w, _ = frame.shape
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(frame_rgb)

    feedback = "Keep Head Centered"
    direction = f"Tilt {current_side} First"

    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark

        # Get keypoints
        left_ear = (int(landmarks[LEFT_EAR].x * w), int(landmarks[LEFT_EAR].y * h))
        right_ear = (int(landmarks[RIGHT_EAR].x * w), int(landmarks[RIGHT_EAR].y * h))
        left_shoulder = (int(landmarks[LEFT_SHOULDER].x * w), int(landmarks[LEFT_SHOULDER].y * h))
        right_shoulder = (int(landmarks[RIGHT_SHOULDER].x * w), int(landmarks[RIGHT_SHOULDER].y * h))

        # Calculate tilt angles
        left_tilt_angle = abs(calculate_angle(left_ear, left_shoulder))
        right_tilt_angle = abs(calculate_angle(right_ear, right_shoulder))

        # Determine if the user has tilted far enough
        if current_side == "LEFT" and left_tilt_angle > TILT_THRESHOLD:
            feedback = "Good! Now Tilt Right"
            if not bent and time.time() - last_rep_time > BUFFER_TIME:
                neck_bend_count += 1
                bent = True
                last_rep_time = time.time()
                current_side = "RIGHT"  # Switch to right next
        elif current_side == "RIGHT" and right_tilt_angle > TILT_THRESHOLD:
            feedback = "Good! Now Tilt Left"
            if not bent and time.time() - last_rep_time > BUFFER_TIME:
                neck_bend_count += 1
                bent = True
                last_rep_time = time.time()
                current_side = "LEFT"  # Switch to left next
        elif max(left_tilt_angle, right_tilt_angle) < RESET_THRESHOLD:
            bent = False  # Reset rep tracking when head returns to center

        # Display instructions
        cv2.putText(frame, "Face Forward for Best Tracking", (50, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
        cv2.putText(frame, f"Tilt: {current_side}", (50, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        cv2.putText(frame, feedback, (50, 110), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.putText(frame, f"Reps: {neck_bend_count}", (50, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

    cv2.imshow("Neck Side Bends Tracker", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
