import time
import cv2
import numpy as np
import pyttsx3

# Initialize text-to-speech engine
engine = pyttsx3.init()
engine.setProperty('rate', 150)  # Adjust speech speed

def speak(text):
    """Speaks the given text."""
    engine.say(text)
    engine.runAndWait()

def generate_background(phase_time, cycle_time, width, height):
    """Generates a smooth gradient background with changing colors based on breathing phase."""
    phase_ratio = phase_time / cycle_time
    r = int(255 * abs(np.sin(phase_ratio * np.pi)))  # Red component
    g = int(200 * abs(np.cos(phase_ratio * np.pi / 2)))  # Green component
    b = int(150 + 100 * np.sin(phase_ratio * np.pi))  # Blue component

    gradient = np.ones((height, width, 3), dtype=np.uint8) * np.array([b, g, r], dtype=np.uint8)
    return gradient

def draw_text(frame, text, color):
    """Draws centered text on the screen."""
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 2
    thickness = 4
    size = cv2.getTextSize(text, font, font_scale, thickness)[0]

    x = (frame.shape[1] - size[0]) // 2
    y = (frame.shape[0] + size[1]) // 2

    cv2.putText(frame, text, (x, y), font, font_scale, color, thickness)

def guided_meditation(duration):
    """Runs the guided meditation session with smooth transitions and speech guidance."""
    cap = cv2.VideoCapture(0)  # Open camera
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    width = int(cap.get(3))  # Get frame width
    height = int(cap.get(4))  # Get frame height

    start_time = time.time()
    cycle_time = 14  # One cycle (breathe in, hold, breathe out)
    last_spoken = None  # Track last spoken phase

    while time.time() - start_time < duration:
        phase_time = (time.time() - start_time) % cycle_time  

        if phase_time < 4:
            text = "Breathe In..."
            color = (255, 200, 100)  # Warm golden color
            if last_spoken != "Breathe In":
                speak("Breathe in")
                last_spoken = "Breathe In"

        elif phase_time < 8:
            text = "Hold..."
            color = (255, 255, 150)  # Soft yellow
            if last_spoken != "Hold":
                speak("Hold")
                last_spoken = "Hold"

        else:
            text = "Breathe Out..."
            color = (150, 200, 255)  # Calming blue
            if last_spoken != "Breathe Out":
                speak("Breathe out")
                last_spoken = "Breathe Out"

        ret, frame = cap.read()
        if not ret:
            print("Error: Could not read frame.")
            break

        # Resize frame to match background size
        frame = cv2.resize(frame, (width, height))

        # Generate gradient background and convert to uint8
        gradient_bg = generate_background(phase_time, cycle_time, width, height)
        
        # Ensure frame is in uint8 format
        frame = cv2.convertScaleAbs(frame)

        # Blend images safely
        blended = cv2.addWeighted(gradient_bg.astype(np.uint8), 0.6, frame.astype(np.uint8), 0.4, 0)

        draw_text(blended, text, color)
        cv2.imshow("Guided Meditation", blended)

        if cv2.waitKey(1) & 0xFF == 27:  # Press 'ESC' to exit
            break

    cap.release()
    cv2.destroyAllWindows()

# Ask user for duration
meditation_time = int(input("Enter meditation duration in seconds: "))

# Start meditation
guided_meditation(meditation_time)
