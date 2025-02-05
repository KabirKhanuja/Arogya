import cv2
import mediapipe as mp

class ChinTuckTracker:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.8, min_tracking_confidence=0.8)
        self.mp_drawing = mp.solutions.drawing_utils

        # Tracking Variables
        self.reps = 0  
        self.stage = "Align Chin"
        self.prev_nose_y = None
        self.start_exercise = False  

        # Thresholds for chin movement detection
        self.movement_threshold = 10  # Increase if needed for better sensitivity

        # UI Variables
        self.overlay_color = (0, 0, 0)

    def draw_guidelines(self, frame):
        """ Draws a guideline for chin positioning. """
        h, w, _ = frame.shape
        cv2.line(frame, (w // 2, 50), (w // 2, h - 50), (0, 255, 255), 2)  
        cv2.putText(frame, "Align chin with the yellow line", (w // 2 - 150, 40), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)

    def detect_movement(self, frame):
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.pose.process(frame_rgb)

        h, w, _ = frame.shape
        feedback = "Align Chin First"
        color = (0, 0, 255)
        self.overlay_color = (0, 0, 0)

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark

            # Get positions for the nose and shoulders
            nose_y = int(landmarks[self.mp_pose.PoseLandmark.NOSE].y * h)
            nose_x = int(landmarks[self.mp_pose.PoseLandmark.NOSE].x * w)

            # Chin Tuck Check
            if not self.start_exercise:
                if abs(nose_y - h // 2) > 20:  # More strict alignment check
                    feedback = "Adjust Chin Position"
                    color = (0, 0, 255)
                    self.overlay_color = (0, 0, 100)
                else:
                    self.start_exercise = True
                    self.stage = "Start Chin Tucks"
                    feedback = "Aligned! Start Chin Tucks"
                    color = (0, 255, 0)
                    self.overlay_color = (0, 100, 0)

            else:
                # Chin Tuck Detection
                if self.prev_nose_y is None:
                    self.prev_nose_y = nose_y

                # Calculate chin tuck movement (vertical movement of the nose)
                chin_movement = self.prev_nose_y - nose_y

                if chin_movement > self.movement_threshold:
                    self.reps += 1
                    feedback = f"Chin Tuck {self.reps}/10 ✅"
                    self.overlay_color = (0, 150, 0)

                # Update stage after reaching 10 reps
                if self.reps == 10:
                    self.stage = "Completed! 🎉"
                    feedback = "Exercise Complete!"
                    color = (0, 255, 0)
                    self.overlay_color = (0, 200, 0)

                # Store the nose position for the next comparison
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

            cv2.putText(frame, "Welcome to Chin Tuck Tracker!", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)
            cv2.putText(frame, "Press 'S' to Start", (50, 120), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)
            cv2.putText(frame, "Press 'Q' to Quit", (50, 180), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)

            cv2.imshow("Chin Tucks", frame)

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
            cv2.putText(frame, f"Reps: {self.reps}/10", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

            cv2.imshow("Chin Tucks", frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    tracker = ChinTuckTracker()
    tracker.track_exercise()
