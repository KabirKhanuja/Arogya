import cv2
import mediapipe as mp
import numpy as np
import time

# Initialize MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1, refine_landmarks=True)

# Open webcam
cap = cv2.VideoCapture(0)

chin_tuck_count = 0
tucked = False
baseline_distance = None  
baseline_nose_x = None  
last_rep_time = 0  # Buffer time tracker

# Face Mesh landmark indices
CHIN_INDEX = 152   
NOSE_INDEX = 1     
FOREHEAD_INDEX = 10  

def get_distance(p1, p2):
    return np.linalg.norm(np.array(p1) - np.array(p2))

def get_angle(a, b, c):
    a, b, c = np.array(a), np.array(b), np.array(c)
    ba, bc = a - b, c - b
    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
    return np.degrees(np.arccos(np.clip(cosine_angle, -1.0, 1.0)))

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    h, w, _ = frame.shape
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(frame_rgb)

    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            # Extract key points
            chin = face_landmarks.landmark[CHIN_INDEX]
            nose = face_landmarks.landmark[NOSE_INDEX]
            forehead = face_landmarks.landmark[FOREHEAD_INDEX]

            # Convert to pixel coordinates
            chin = (int(chin.x * w), int(chin.y * h))
            nose = (int(nose.x * w), int(nose.y * h))
            forehead = (int(forehead.x * w), int(forehead.y * h))

            # Draw points
            cv2.circle(frame, chin, 5, (0, 255, 0), -1)
            cv2.circle(frame, nose, 5, (0, 0, 255), -1)
            cv2.circle(frame, forehead, 5, (255, 0, 0), -1)

            # Calculate distances
            nose_chin_distance = get_distance(nose, chin)

            # Set initial baseline values (first frame)
            if baseline_distance is None:
                baseline_distance = nose_chin_distance
                baseline_nose_x = nose[0]  

            # Calculate angle
            chin_tuck_angle = get_angle(forehead, nose, chin)

            # Ignore reps if head moves sideways (more than ~2.5 cm)
            if abs(nose[0] - baseline_nose_x) > w * 0.025:  
                feedback = "Keep Head Still!"
                tucked = False
            else:
                # Chin tuck detection
                tuck_threshold = baseline_distance * 0.94  # 6% reduction needed
                angle_threshold = 152  # Allows up to 152°

                if nose_chin_distance < tuck_threshold and chin_tuck_angle < angle_threshold:
                    feedback = "Perfect Chin Tuck!"
                    if not tucked and time.time() - last_rep_time > 0.5:  # Buffer of 0.5 sec
                        chin_tuck_count += 1  
                        tucked = True
                        last_rep_time = time.time()  # Update buffer timer
                elif nose_chin_distance < baseline_distance * 0.97:
                    feedback = "Almost there! Tuck more."
                    tucked = False
                elif nose_chin_distance >= baseline_distance * 0.99:  # Return to baseline
                    tucked = False
                    feedback = "Tuck Your Chin More"

            # Display instructions
            cv2.putText(frame, "Face Diagonally for Best Tracking", (50, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
            cv2.putText(frame, "1. Keep Head Still", (50, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            cv2.putText(frame, "2. Tuck Chin Inward", (50, 85), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            cv2.putText(frame, "3. Hold, then Return", (50, 110), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            cv2.putText(frame, feedback, (50, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.putText(frame, f"Reps: {chin_tuck_count}", (50, 190), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

    cv2.imshow("Chin Tuck Tracker - FINAL Optimized", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
