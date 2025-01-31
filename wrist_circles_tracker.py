import cv2
import mediapipe as mp
import numpy as np
import time

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=1, min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Open webcam
cap = cv2.VideoCapture(0)

clockwise_count = 0
counterclockwise_count = 0
tracking_clockwise = True  # Start with clockwise first
last_move_time = 0

# Threshold settings
BUFFER_TIME = 1.0  # Time required before counting next rep
RADIUS_THRESHOLD = 20  # Minimum movement required to count as a valid rotation

# Track previous positions for circular motion detection
prev_x, prev_y = None, None
circle_points = []

def detect_circle_movement():
    """Detects if the tracked wrist points form a circular pattern."""
    if len(circle_points) < 10:
        return None  # Not enough points to determine direction
    
    # Compute average center of the circle points
    center_x = sum(p[0] for p in circle_points) / len(circle_points)
    center_y = sum(p[1] for p in circle_points) / len(circle_points)

    # Compute angles for each point w.r.t. center
    angles = [np.arctan2(p[1] - center_y, p[0] - center_x) for p in circle_points]

    # Count how many times angles increase/decrease
    clockwise = sum(angles[i] > angles[i-1] for i in range(1, len(angles)))
    counterclockwise = sum(angles[i] < angles[i-1] for i in range(1, len(angles)))

    return "clockwise" if clockwise > counterclockwise else "counterclockwise"

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    h, w, _ = frame.shape
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(frame_rgb)

    feedback = "Start by Rotating Your Wrist"

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            # Get wrist landmark
            wrist = (int(hand_landmarks.landmark[mp_hands.HandLandmark.WRIST].x * w), 
                     int(hand_landmarks.landmark[mp_hands.HandLandmark.WRIST].y * h))

            # Store previous positions for movement tracking
            if prev_x is not None and prev_y is not None:
                movement_distance = np.sqrt((wrist[0] - prev_x) ** 2 + (wrist[1] - prev_y) ** 2)

                if movement_distance > RADIUS_THRESHOLD:
                    circle_points.append(wrist)
                    if len(circle_points) > 10:
                        circle_points.pop(0)  # Keep recent points only
                    
                    # Detect circular movement direction
                    direction = detect_circle_movement()

                    # If rotating clockwise
                    if tracking_clockwise and direction == "clockwise" and time.time() - last_move_time > BUFFER_TIME:
                        clockwise_count += 1
                        tracking_clockwise = False  # Switch to counterclockwise
                        last_move_time = time.time()
                        feedback = "Clockwise Counted! Now Rotate Counterclockwise"

                    # If rotating counterclockwise
                    elif not tracking_clockwise and direction == "counterclockwise" and time.time() - last_move_time > BUFFER_TIME:
                        counterclockwise_count += 1
                        tracking_clockwise = True  # Switch back to clockwise
                        last_move_time = time.time()
                        feedback = "Counterclockwise Counted! Now Rotate Clockwise"

            prev_x, prev_y = wrist  # Update previous position

        # Display instructions
        cv2.putText(frame, "Perform Smooth, Circular Movements", (50, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
        cv2.putText(frame, f"Clockwise: {clockwise_count}", (50, 70), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        cv2.putText(frame, f"Counterclockwise: {counterclockwise_count}", (50, 110), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
        cv2.putText(frame, feedback, (50, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    cv2.imshow("Wrist Circles Tracker", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
