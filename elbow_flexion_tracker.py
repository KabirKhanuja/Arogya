import cv2
import mediapipe as mp
import numpy as np
import time

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False, model_complexity=1, smooth_landmarks=True)

# Open webcam
cap = cv2.VideoCapture(0)

flexion_count = 0
extension_count = 0
bending = True  # Start with flexion first
last_move_time = 0

# Pose landmark indices
LEFT_ELBOW = 13
LEFT_SHOULDER = 11
LEFT_WRIST = 15

# Movement thresholds
FLEXION_THRESHOLD = 50   # Detects elbow bending
EXTENSION_THRESHOLD = 160  # Detects elbow straightening
BUFFER_TIME = 1.0  # Time required before counting next rep

def calculate_angle(a, b, c):
    """Calculate the angle between three points (shoulder, elbow, wrist)."""
    a = np.array(a)  # Shoulder
    b = np.array(b)  # Elbow
    c = np.array(c)  # Wrist
    
    ab = a - b
    bc = c - b

    cosine_angle = np.dot(ab, bc) / (np.linalg.norm(ab) * np.linalg.norm(bc))
    angle = np.arccos(np.clip(cosine_angle, -1.0, 1.0))
    
    return np.degrees(angle)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    h, w, _ = frame.shape
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(frame_rgb)

    feedback = "Start by Bending Your Arm"

    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark

        # Get keypoints
        shoulder = (int(landmarks[LEFT_SHOULDER].x * w), int(landmarks[LEFT_SHOULDER].y * h))
        elbow = (int(landmarks[LEFT_ELBOW].x * w), int(landmarks[LEFT_ELBOW].y * h))
        wrist = (int(landmarks[LEFT_WRIST].x * w), int(landmarks[LEFT_WRIST].y * h))

        # Calculate elbow angle
        elbow_angle = calculate_angle(shoulder, elbow, wrist)

        # If flexing (bending the elbow)
        if bending:
            if elbow_angle < FLEXION_THRESHOLD and time.time() - last_move_time > BUFFER_TIME:
                flexion_count += 1
                bending = False  # Switch to extension
                last_move_time = time.time()
                feedback = "Flexion Counted! Now Straighten Your Arm"

        # If extending (straightening the elbow)
        elif not bending:
            if elbow_angle > EXTENSION_THRESHOLD and time.time() - last_move_time > BUFFER_TIME:
                extension_count += 1
                bending = True  # Switch back to flexion
                last_move_time = time.time()
                feedback = "Extension Counted! Now Bend Your Arm"

        # Display instructions
        cv2.putText(frame, "Perform Smooth, Controlled Movements", (50, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
        cv2.putText(frame, f"Flexions: {flexion_count}", (50, 70), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        cv2.putText(frame, f"Extensions: {extension_count}", (50, 110), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
        cv2.putText(frame, feedback, (50, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    cv2.imshow("Elbow Flexion & Extension Tracker", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
