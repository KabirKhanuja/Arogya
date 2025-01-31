import cv2
import mediapipe as mp
import numpy as np
import time

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False, model_complexity=1, smooth_landmarks=True)

# Open webcam
cap = cv2.VideoCapture(0)

forward_rolls = 0
backward_rolls = 0
rolling_forward = True  # Start with forward roll first
last_roll_time = 0

# Pose landmark indices
LEFT_SHOULDER = 11
RIGHT_SHOULDER = 12

# Movement thresholds
ROLL_THRESHOLD = 10  # Detects shoulder elevation
RESET_THRESHOLD = 5   # Ensures shoulder returns to neutral before switching
BUFFER_TIME = 1.0     # Time required before counting next roll

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

    feedback = "Roll Forward First"

    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark

        # Get keypoints
        left_shoulder = (int(landmarks[LEFT_SHOULDER].x * w), int(landmarks[LEFT_SHOULDER].y * h))
        right_shoulder = (int(landmarks[RIGHT_SHOULDER].x * w), int(landmarks[RIGHT_SHOULDER].y * h))

        # Calculate shoulder movement
        shoulder_motion = abs(left_shoulder[1] - right_shoulder[1])

        # If rolling forward first
        if rolling_forward:
            if shoulder_motion > ROLL_THRESHOLD and time.time() - last_roll_time > BUFFER_TIME:
                forward_rolls += 1
                rolling_forward = False  # Switch to backward roll
                last_roll_time = time.time()
                feedback = "Forward Roll Counted! Now Roll Backward"

        # If rolling backward next
        elif not rolling_forward:
            if shoulder_motion < RESET_THRESHOLD and time.time() - last_roll_time > BUFFER_TIME:
                backward_rolls += 1
                rolling_forward = True  # Switch back to forward roll
                last_roll_time = time.time()
                feedback = "Backward Roll Counted! Now Roll Forward"

        # Display instructions
        cv2.putText(frame, "Perform Smooth, Full Rolls", (50, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
        cv2.putText(frame, f"Forward Rolls: {forward_rolls}", (50, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        cv2.putText(frame, f"Backward Rolls: {backward_rolls}", (50, 110), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
        cv2.putText(frame, feedback, (50, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    cv2.imshow("Shoulder Rolls Tracker", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
