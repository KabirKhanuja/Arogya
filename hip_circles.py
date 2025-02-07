import cv2
import mediapipe as mp
import numpy as np
import argparse
import pyttsx3
import time

# Initialize Text-to-Speech Engine
engine = pyttsx3.init()
voices = engine.getProperty('voices')

# Set Female British English Voice
for voice in voices:
    if "english" in voice.name.lower() and "female" in voice.name.lower():
        engine.setProperty('voice', voice.id)
        break

engine.setProperty('rate', 175)  # Adjust speed for natural speech

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

# Argument parser for reps
parser = argparse.ArgumentParser(description="Hip Circles Tracker")
parser.add_argument("--reps", type=int, default=5, help="Number of repetitions per direction")
args = parser.parse_args()

# OpenCV Video Capture
cap = cv2.VideoCapture(0)

# Rotation tracking variables
rotation_count = {"clockwise": 0, "counterclockwise": 0}
prev_angle = None
rotation_complete = False
buffer_counter = 0

# Panel settings
PANEL_WIDTH = 300  # Width of the black panel
SCREEN_WIDTH, SCREEN_HEIGHT = 640, 480  # Default screen size

# Exercise sequence: Clockwise → Counterclockwise
exercise_order = ["clockwise", "counterclockwise"]
current_exercise = 0  # Start with clockwise

# Announce the first exercise
engine.say(f"Stand straight with feet shoulder-width apart. Start rotating your hips {exercise_order[0]}.")
engine.runAndWait()

# Start MediaPipe Pose
with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Flip image for a mirrored effect
        frame = cv2.flip(frame, 1)
        SCREEN_HEIGHT, SCREEN_WIDTH, _ = frame.shape  # Adjust dynamically

        # Convert frame to RGB for Mediapipe
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb_frame)

        # Determine current direction
        current_direction = exercise_order[current_exercise]

        # Set UI elements
        PANEL_X = SCREEN_WIDTH - PANEL_WIDTH  # Black panel on the right side
        panel = np.zeros((SCREEN_HEIGHT, PANEL_WIDTH, 3), dtype=np.uint8)  # Black background

        if results.pose_landmarks:
            # Extract key landmarks
            landmarks = results.pose_landmarks.landmark
            hip_left = landmarks[mp_pose.PoseLandmark.LEFT_HIP]
            hip_right = landmarks[mp_pose.PoseLandmark.RIGHT_HIP]

            # Convert coordinates
            h, w, _ = frame.shape
            hip_left_x, hip_left_y = int(hip_left.x * w), int(hip_left.y * h)
            hip_right_x, hip_right_y = int(hip_right.x * w), int(hip_right.y * h)

            # Calculate rotation angle using hips
            angle = np.arctan2(hip_right_y - hip_left_y, hip_right_x - hip_left_x) * 180 / np.pi

            # Rotation detection
            if prev_angle is not None:
                diff = angle - prev_angle

                # Check rotation direction
                if (current_direction == "clockwise" and diff > 8) or (current_direction == "counterclockwise" and diff < -8):
                    rotation_complete = True

                # Count reps
                if rotation_complete and abs(angle) > 40:
                    buffer_counter += 1
                    if buffer_counter > 7:
                        rotation_count[current_direction] += 1
                        rotation_complete = False
                        buffer_counter = 0

            prev_angle = angle

            # Draw silhouette on black panel
            panel_silhouette = panel.copy()
            mp_drawing.draw_landmarks(panel_silhouette, results.pose_landmarks, mp_pose.POSE_CONNECTIONS, 
                                      mp_drawing.DrawingSpec(color=(255, 255, 255), thickness=2, circle_radius=2),
                                      mp_drawing.DrawingSpec(color=(255, 255, 255), thickness=2))
            panel[:, :] = panel_silhouette  # Update panel with silhouette

        # Progress Bar
        progress_width = int((rotation_count[current_direction] / args.reps) * PANEL_WIDTH)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (50 + progress_width, SCREEN_HEIGHT - 30), (0, 255, 0), -1)
        cv2.rectangle(frame, (50, SCREEN_HEIGHT - 50), (PANEL_WIDTH + 50, SCREEN_HEIGHT - 30), (255, 255, 255), 2)

        # Display Information
        cv2.putText(frame, f"Hip Circles - {current_direction.capitalize()}: {rotation_count[current_direction]}/{args.reps}",
                    (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

        # Combine the two views (normal + silhouette panel)
        combined_view = np.hstack((frame, panel))

        # Check if reps are completed for this phase
        if rotation_count[current_direction] >= args.reps:
            current_exercise += 1
            if current_exercise < len(exercise_order):
                next_direction = exercise_order[current_exercise]

                # Show transition screen
                black_screen = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH + PANEL_WIDTH, 3), dtype=np.uint8)
                cv2.putText(black_screen, f"Next: {next_direction.capitalize()} Rotations",
                            (SCREEN_WIDTH // 2 - 100, SCREEN_HEIGHT // 2 - 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                cv2.imshow("Hip Circles Tracker", black_screen)
                cv2.waitKey(1000)

                # Countdown transition
                for i in range(3, 0, -1):
                    black_screen = np.zeros((SCREEN_HEIGHT, SCREEN_WIDTH + PANEL_WIDTH, 3), dtype=np.uint8)
                    cv2.putText(black_screen, f"{i}", (SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2),
                                cv2.FONT_HERSHEY_SIMPLEX, 4, (255, 255, 255), 5)
                    cv2.imshow("Hip Circles Tracker", black_screen)
                    cv2.waitKey(1000)

                engine.say(f"Switching to {next_direction} rotations.")
                engine.runAndWait()
            else:
                engine.say("All exercises completed. Great job!")
                engine.runAndWait()
                break

        # Show the combined view
        cv2.imshow("Hip Circles Tracker", combined_view)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
