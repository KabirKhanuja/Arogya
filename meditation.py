import time
import cv2
import numpy as np
import pyttsx3
import pygame
import mediapipe as mp

def speak(text):
    engine = pyttsx3.init()
    engine.setProperty('rate', 150)
    engine.say(text)
    engine.runAndWait()

def play_background_music(audio_file):
    pygame.mixer.init()
    pygame.mixer.music.load(audio_file)
    pygame.mixer.music.play(-1)

def stop_background_music():
    pygame.mixer.music.stop()

def segment_user(frame):
    mp_selfie_segmentation = mp.solutions.selfie_segmentation
    with mp_selfie_segmentation.SelfieSegmentation(model_selection=1) as selfie_segmentation:
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = selfie_segmentation.process(frame_rgb)
        mask = results.segmentation_mask
        mask = (mask > 0.5).astype(np.uint8)
        return mask

def guided_meditation(duration, audio_file, background_video):
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return
    
    bg_cap = cv2.VideoCapture(background_video)
    if not bg_cap.isOpened():
        print("Error: Could not open background video.")
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
        
        ret_bg, background = bg_cap.read()
        if not ret_bg:
            bg_cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            ret_bg, background = bg_cap.read()
        
        background = cv2.resize(background, (width, height))
        mask = segment_user(frame)
        frame[mask == 0] = background[mask == 0]
        
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 2
        thickness = 4
        size = cv2.getTextSize(text, font, font_scale, thickness)[0]
        x = (frame.shape[1] - size[0]) // 2
        y = (frame.shape[0] + size[1]) // 2
        cv2.putText(frame, text, (x, y), font, font_scale, color, thickness)
        
        cv2.imshow("Guided Meditation", frame)
        
        if cv2.waitKey(1) & 0xFF == 27:
            break
    
    cap.release()
    bg_cap.release()
    cv2.destroyAllWindows()
    stop_background_music()

meditation_time = int(input("Enter meditation duration in seconds: "))
audio_file = "arogya-testing\meditation-music-without-nature-sound-256142.mp3"  
background_video = "arogya-testing\97998-646668826_small.mp4"

guided_meditation(meditation_time, audio_file, background_video)
