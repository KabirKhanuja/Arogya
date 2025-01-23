import mediapipe as mp
import cv2

def detect_squat(frame, pose_results):
    """Function to detect squat exercises and count reps."""
    global squat_counter
    if not pose_results.pose_landmarks:
        return frame
    
    landmarks = pose_results.pose_landmarks.landmark
    left_knee = landmarks[mp.solutions.pose.PoseLandmark.LEFT_KNEE]
    right_knee = landmarks[mp.solutions.pose.PoseLandmark.RIGHT_KNEE]
    left_hip = landmarks[mp.solutions.pose.PoseLandmark.LEFT_HIP]
    right_hip = landmarks[mp.solutions.pose.PoseLandmark.RIGHT_HIP]
    
    # Example logic to detect a full squat (knee bend)
    if left_knee.y < left_hip.y and right_knee.y < right_hip.y:
        squat_counter += 1
        cv2.putText(frame, f"Squat {squat_counter}", (50, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    else:
        # Detect incorrect form
        cv2.putText(frame, "Incorrect Squat!", (50, 200), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

    return frame
