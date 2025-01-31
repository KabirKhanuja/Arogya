import os

def main():
    while True:
        print("\nSelect an Exercise to Track:")
        print("1. Chin Tucks")
        print("2. Neck Side Bends")
        print("3. Shoulder Rolls")
        print("4. Elbow Flexion & Extension")
        print("5. Wrist Circles")
        print("6. Exit")
        
        choice = input("Enter the number of the exercise: ")

        if choice == "1":
            os.system("python3 exercises/chin_tuck_tracker.py")
        elif choice == "2":
            os.system("python3 exercises/neck_side_bends.py")
        elif choice == "3":
            os.system("python3 exercises/shoulder_rolls.py")
        elif choice == "4":
            os.system("python3 exercises/elbow_flexion_tracker.py")
        elif choice == "5":
            os.system("python3 exercises/wrist_circles_tracker.py")
        elif choice == "6":
            print("Exiting program.")
            break
        else:
            print("Invalid input. Please enter a valid number.")

if __name__ == "__main__":
    main()
