import mediapipe as mp
import cv2

def detect_plank(frame, pose_results):
    """Function to detect plank position and give feedback."""
    if not pose_results.pose_landmarks:
        return frame
    
    landmarks = pose_results.pose_landmarks.landmark
    left_shoulder = landmarks[mp.solutions.pose.PoseLandmark.LEFT_SHOULDER]
    right_shoulder = landmarks[mp.solutions.pose.PoseLandmark.RIGHT_SHOULDER]
    left_hip = landmarks[mp.solutions.pose.PoseLandmark.LEFT_HIP]
    right_hip = landmarks[mp.solutions.pose.PoseLandmark.RIGHT_HIP]
    left_ankle = landmarks[mp.solutions.pose.PoseLandmark.LEFT_ANKLE]
    right_ankle = landmarks[mp.solutions.pose.PoseLandmark.RIGHT_ANKLE]

    # Here you can add the logic to check if the body is straight in plank position
    # For simplicity, we'll assume that if the body is not straight, it's incorrect
    if left_shoulder.y > left_hip.y and right_shoulder.y > right_hip.y:
        cv2.putText(frame, "Good Plank Position", (50, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    else:
        cv2.putText(frame, "Adjust Plank Position", (50, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

    return frame
