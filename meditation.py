import time
import cv2
import numpy as np
import pyttsx3
import pygame

engine = pyttsx3.init()
engine.setProperty('rate', 150)

def speak(text):
    engine.say(text)
    engine.runAndWait()

def play_background_music(audio_file):
    pygame.mixer.init()
    pygame.mixer.music.load(audio_file)
    pygame.mixer.music.play(-1)

def stop_background_music():
    pygame.mixer.music.stop()

def generate_background(phase_time, cycle_time, width, height):
    phase_ratio = phase_time / cycle_time
    r = int(255 * abs(np.sin(phase_ratio * np.pi)))
    g = int(200 * abs(np.cos(phase_ratio * np.pi / 2)))
    b = int(150 + 100 * np.sin(phase_ratio * np.pi))
    gradient = np.ones((height, width, 3), dtype=np.uint8) * np.array([b, g, r], dtype=np.uint8)
    return gradient

def draw_text(frame, text, color):
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 2
    thickness = 4
    size = cv2.getTextSize(text, font, font_scale, thickness)[0]
    x = (frame.shape[1] - size[0]) // 2
    y = (frame.shape[0] + size[1]) // 2
    cv2.putText(frame, text, (x, y), font, font_scale, color, thickness)

def guided_meditation(duration, audio_file):
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    width = int(cap.get(3))
    height = int(cap.get(4))
    play_background_music(audio_file)

    start_time = time.time()
    cycle_time = 14
    last_spoken = None

    while time.time() - start_time < duration:
        phase_time = (time.time() - start_time) % cycle_time  

        if phase_time < 4:
            text = "Breathe In..."
            color = (255, 200, 100)
            if last_spoken != "Breathe In":
                speak("Breathe in")
                last_spoken = "Breathe In"

        elif phase_time < 8:
            text = "Hold..."
            color = (255, 255, 150)
            if last_spoken != "Hold":
                speak("Hold")
                last_spoken = "Hold"

        else:
            text = "Breathe Out..."
            color = (150, 200, 255)
            if last_spoken != "Breathe Out":
                speak("Breathe out")
                last_spoken = "Breathe Out"

        ret, frame = cap.read()
        if not ret:
            print("Error: Could not read frame.")
            break

        frame = cv2.resize(frame, (width, height))
        gradient_bg = generate_background(phase_time, cycle_time, width, height)
        frame = cv2.convertScaleAbs(frame)
        blended = cv2.addWeighted(gradient_bg.astype(np.uint8), 0.6, frame.astype(np.uint8), 0.4, 0)
        draw_text(blended, text, color)
        cv2.imshow("Guided Meditation", blended)

        if cv2.waitKey(1) & 0xFF == 27:
            break

    cap.release()
    cv2.destroyAllWindows()
    stop_background_music()

meditation_time = int(input("Enter meditation duration in seconds: "))
audio_file = "meditation-music-without-nature-sound-256142.mp3"
guided_meditation(meditation_time, audio_file)
