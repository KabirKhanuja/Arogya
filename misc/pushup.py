import cv2
import mediapipe as mp

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_drawing = mp.solutions.drawing_utils

def detect_pushup(frame, pose_results, pushup_counter, is_pushup_down):
    """Function to detect push-up exercises and count reps."""
    if not pose_results.pose_landmarks:
        return frame, pushup_counter, is_pushup_down

    landmarks = pose_results.pose_landmarks.landmark

    # Get keypoints for shoulder, elbow, and wrist
    left_shoulder = landmarks[mp.solutions.pose.PoseLandmark.LEFT_SHOULDER]
    right_shoulder = landmarks[mp.solutions.pose.PoseLandmark.RIGHT_SHOULDER]
    left_elbow = landmarks[mp.solutions.pose.PoseLandmark.LEFT_ELBOW]
    right_elbow = landmarks[mp.solutions.pose.PoseLandmark.RIGHT_ELBOW]

    # Check for elbow position: should be lower than shoulders in down position
    elbow_bent = left_elbow.y > left_shoulder.y and right_elbow.y > right_shoulder.y

    # Detect the push-up transition
    if elbow_bent and not is_pushup_down:
        # Transition to down position, reset flag
        is_pushup_down = True
    elif not elbow_bent and is_pushup_down:
        # Transition to up position, increment counter
        pushup_counter += 1
        is_pushup_down = False

    # Show the counter on screen
    cv2.putText(frame, f"Push-ups: {pushup_counter}", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

    return frame, pushup_counter, is_pushup_down
