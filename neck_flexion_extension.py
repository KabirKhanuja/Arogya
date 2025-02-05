import cv2
import mediapipe as mp
import numpy as np

class NeckFlexionExtensionTracker:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.6, min_tracking_confidence=0.6)
        self.mp_drawing = mp.solutions.drawing_utils

        # Tracking Variables
        self.flexion_reps = 0  # Chin to chest reps
        self.extension_reps = 0  # Looking up reps
        self.stage = "Align Head"
        self.prev_nose_y = None
        self.direction = None
        self.start_exercise = False  

        # UI Variables
        self.overlay_color = (0, 0, 0)

    def draw_guidelines(self, frame):
        """ Draws a yellow guideline for head alignment. """
        h, w, _ = frame.shape
        head_level = h // 3
        cv2.line(frame, (50, head_level), (w-50, head_level), (0, 255, 255), 2)  
        cv2.putText(frame, "Align head with the yellow line", (50, head_level - 10), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)

    def detect_movement(self, frame):
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.pose.process(frame_rgb)

        h, w, _ = frame.shape
        feedback = "Align Head First"
        color = (0, 0, 255)
        self.overlay_color = (0, 0, 0)  # Default overlay color

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark

            nose_y = int(landmarks[self.mp_pose.PoseLandmark.NOSE].y * h)
            head_level = h // 3  

            # Head Alignment
            if not self.start_exercise:
                if abs(nose_y - head_level) > 15:
                    feedback = "Adjust Head Position"
                    color = (0, 0, 255)
                    self.overlay_color = (0, 0, 100)  # Red overlay
                else:
                    self.start_exercise = True
                    self.stage = "Flex Down"
                    feedback = "Aligned! Start Flexing Down"
                    color = (0, 255, 0)
                    self.overlay_color = (0, 100, 0)  # Green overlay

            else:
                # Neck Movement Detection
                if self.prev_nose_y is None:
                    self.prev_nose_y = nose_y

                movement = nose_y - self.prev_nose_y

                if movement > 6:  # Moving downward (Chin to chest)
                    if self.direction != "down":
                        self.direction = "down"
                        if self.stage == "Flex Down":
                            self.flexion_reps += 1
                            feedback = f"Flexion Rep {self.flexion_reps}/10 ✅"
                            self.overlay_color = (0, 150, 0)  # Green for correct reps
                        elif self.stage == "Extend Up":
                            self.extension_reps += 1
                            feedback = f"Extension Rep {self.extension_reps}/10 ✅"
                            self.overlay_color = (0, 150, 0)  # Green for correct reps

                elif movement < -6:  # Moving upward (Looking up)
                    self.direction = "up"
                    feedback = "Slowly Look Down"
                    color = (255, 165, 0)
                    self.overlay_color = (100, 100, 0)  # Orange for adjustment

                if self.flexion_reps == 10 and self.extension_reps == 0:
                    self.stage = "Extend Up"
                    feedback = "Switch to Looking Up!"
                    color = (0, 255, 255)
                    self.overlay_color = (100, 100, 0)  # Yellow

                if self.extension_reps == 10:
                    self.stage = "Completed! 🎉"
                    feedback = "Exercise Complete!"
                    color = (0, 255, 0)
                    self.overlay_color = (0, 200, 0)  # Bright Green for completion

                self.prev_nose_y = nose_y

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

            cv2.putText(frame, "Welcome to Neck Flexion & Extension Tracker!", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)
            cv2.putText(frame, "Press 'S' to Start", (50, 120), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)
            cv2.putText(frame, "Press 'Q' to Quit", (50, 180), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)

            cv2.imshow("Neck Flexion & Extension", frame)

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
            cv2.putText(frame, f"Flexion Reps: {self.flexion_reps}/10", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
            cv2.putText(frame, f"Extension Reps: {self.extension_reps}/10", (50, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

            cv2.imshow("Neck Flexion & Extension", frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    tracker = NeckFlexionExtensionTracker()
    tracker.track_exercise()
