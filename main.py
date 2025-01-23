import cv2
import mediapipe as mp
from squat import detect_squat
from pushup import detect_pushup
from plank import detect_plank

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_drawing = mp.solutions.drawing_utils

# Open webcam
cap = cv2.VideoCapture(0)

# Function to handle exercise input and switch between them
def choose_exercise():
    print("Choose an exercise: pushup, squat, or plank")
    exercise = input("Enter exercise: ").strip().lower()
    return exercise

def track_pushups(frame, results, pushup_counter, is_pushup_down):
    """Track Pushups and count repetitions."""
    frame, pushup_counter, is_pushup_down = detect_pushup(frame, results, pushup_counter, is_pushup_down)
    return frame, pushup_counter, is_pushup_down

def track_squats(frame, results, squat_counter):
    """Track Squats and count repetitions."""
    frame, squat_counter = detect_squat(frame, results, squat_counter)
    return frame, squat_counter

def track_plank(frame, results, incorrect_count):
    """Track Plank and give feedback."""
    frame, incorrect_count = detect_plank(frame, results, incorrect_count)
    return frame, incorrect_count

# Counter and Feedback Setup
pushup_counter = 0
squat_counter = 0
incorrect_count = 0
exercise_in_progress = True
is_pushup_down = False  # Initialize the state of push-up position

# Get the exercise choice from the user
exercise_choice = choose_exercise()

while cap.isOpened() and exercise_in_progress:
    ret, frame = cap.read()
    if not ret:
        break

    # Convert BGR to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Process frame with MediaPipe Pose
    results = pose.process(rgb_frame)

    # Draw keypoints and connections
    mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

    # Switch between exercises based on the choice
    if exercise_choice == "pushup":
        frame, pushup_counter, is_pushup_down = track_pushups(frame, results, pushup_counter, is_pushup_down)
    elif exercise_choice == "squat":
        frame, squat_counter = track_squats(frame, results, squat_counter)
    elif exercise_choice == "plank":
        frame, incorrect_count = track_plank(frame, results, incorrect_count)
    else:
        print("Invalid exercise choice.")
        break

    # Show repetition counter or status
    if exercise_choice == "pushup":
        cv2.putText(frame, f"Push-ups: {pushup_counter}", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
    elif exercise_choice == "squat":
        cv2.putText(frame, f"Squats: {squat_counter}", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    elif exercise_choice == "plank":
        cv2.putText(frame, f"Plank Status: {'Good Position' if incorrect_count == 0 else 'Adjust Position'}", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

    # Show frame
    cv2.imshow("Exercise Detection", frame)

    # Break loop if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        exercise_in_progress = False

cap.release()
cv2.destroyAllWindows()
