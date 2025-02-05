import cv2
import mediapipe as mp
import numpy as np

class NeckRotationTracker:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.8, min_tracking_confidence=0.8)
        self.mp_drawing = mp.solutions.drawing_utils

        # Tracking Variables
        self.left_reps = 0  
        self.right_reps = 0  
        self.stage = "Align Head"
        self.prev_left_shoulder_x = None
        self.prev_right_shoulder_x = None
        self.direction = None
        self.start_exercise = False  
        self.min_movement_threshold = 10  # Increased threshold for clearer detection

        # UI Variables
        self.overlay_color = (0, 0, 0)

    def draw_guidelines(self, frame):
        """ Draws a guideline for head positioning. """
        h, w, _ = frame.shape
        head_center_x = w // 2
        cv2.line(frame, (head_center_x, 50), (head_center_x, h - 50), (0, 255, 255), 2)  
        cv2.putText(frame, "Align head with the yellow line", (head_center_x - 100, 40), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)

    def detect_movement(self, frame):
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.pose.process(frame_rgb)

        h, w, _ = frame.shape
        feedback = "Align Head First"
        color = (0, 0, 255)
        self.overlay_color = (0, 0, 0)

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark

            # Get positions for the left and right shoulders and the nose
            left_shoulder_x = int(landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER].x * w)
            right_shoulder_x = int(landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER].x * w)
            nose_x = int(landmarks[self.mp_pose.PoseLandmark.NOSE].x * w)

            # Head Alignment Check: The head should be centered
            head_center_x = w // 2
            if not self.start_exercise:
                if abs(nose_x - head_center_x) > 20:  # More strict head alignment check
                    feedback = "Adjust Head Position"
                    color = (0, 0, 255)
                    self.overlay_color = (0, 0, 100)
                else:
                    self.start_exercise = True
                    self.stage = "Start Rotation"
                    feedback = "Aligned! Start Rotating Left"
                    color = (0, 255, 0)
                    self.overlay_color = (0, 100, 0)

            else:
                # Neck Rotation Detection
                if self.prev_left_shoulder_x is None or self.prev_right_shoulder_x is None:
                    self.prev_left_shoulder_x = left_shoulder_x
                    self.prev_right_shoulder_x = right_shoulder_x

                # Calculate movement
                movement_left = left_shoulder_x - self.prev_left_shoulder_x
                movement_right = right_shoulder_x - self.prev_right_shoulder_x

                total_movement = abs(movement_left) + abs(movement_right)

                # Check if movement is significant enough to count as a rotation
                if total_movement > self.min_movement_threshold:
                    if movement_left > movement_right and self.direction != "left":  # Moving left
                        self.direction = "left"
                        self.left_reps += 1
                        feedback = f"Left Rep {self.left_reps}/10 ✅"
                        self.overlay_color = (0, 150, 0)
                    elif movement_right > movement_left and self.direction != "right":  # Moving right
                        self.direction = "right"
                        self.right_reps += 1
                        feedback = f"Right Rep {self.right_reps}/10 ✅"
                        self.overlay_color = (0, 150, 0)

                # Update stage after reaching 10 reps for one side
                if self.left_reps == 10 and self.right_reps == 0:
                    self.stage = "Rotate Right"
                    feedback = "Switch to Rotating Right!"
                    color = (0, 255, 255)
                    self.overlay_color = (100, 100, 0)

                if self.right_reps == 10:
                    self.stage = "Completed! 🎉"
                    feedback = "Exercise Complete!"
                    color = (0, 255, 0)
                    self.overlay_color = (0, 200, 0)

                # Store current positions for next frame comparison
                self.prev_left_shoulder_x = left_shoulder_x
                self.prev_right_shoulder_x = right_shoulder_x

            # Draw Guidelines
            self.draw_guidelines(frame)

        return feedback, color

    def draw_overlay(self, frame):
        """ Draws a semi-transparent overlay for visual feedback. """
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, 0), (frame.shape[1], frame.shape[0]), self.overlay_color, -1)
        return cv2.addWeighted(overlay, 0.2, frame, 0.8, 0)

    def show_start_screen(self):
        """ Display a start screen with instructions. """
        cap = cv2.VideoCapture(0)
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            frame = cv2.flip(frame, 1)
            h, w, _ = frame.shape

            cv2.putText(frame, "Welcome to Neck Rotations Tracker!", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)
            cv2.putText(frame, "Press 'S' to Start", (50, 120), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)
            cv2.putText(frame, "Press 'Q' to Quit", (50, 180), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)

            cv2.imshow("Neck Rotations", frame)

            key = cv2.waitKey(1) & 0xFF
            if key == ord('s'):
                cap.release()
                cv2.destroyAllWindows()
                return
            elif key == ord('q'):
                cap.release()
                cv2.destroyAllWindows()
                exit()

    def track_exercise(self):
        self.show_start_screen()

        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("Error: Could not open webcam.")
            return

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame = cv2.flip(frame, 1)
            feedback, color = self.detect_movement(frame)
            frame = self.draw_overlay(frame)

            # Display Feedback
            cv2.putText(frame, f"Status: {feedback}", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)
            cv2.putText(frame, f"Left Reps: {self.left_reps}/10", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
            cv2.putText(frame, f"Right Reps: {self.right_reps}/10", (50, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

            cv2.imshow("Neck Rotations", frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    tracker = NeckRotationTracker()
    tracker.track_exercise()
