
from flask import Flask, jsonify, request
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import threading
import time
import os

app = Flask(__name__)
CORS(app)

# Global state
detection_state = {
    'active': False,
    'ambulance_detected': False,
    'frame_number': 0,
    'total_frames': 0,
    'vehicle_count': 0,
    'traffic_light': 'RED'
}

VIDEO_PATH = "input.mp4"

# --------------------------------------------------

def _check_if_ambulance(roi):
    if roi.size == 0 or roi.shape[0] < 20 or roi.shape[1] < 20:
        return False
    
    hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
    lower_white = cv2.inRange(hsv, (0, 0, 180), (180, 40, 255))
    lower_red1 = cv2.inRange(hsv, (0, 100, 100), (10, 255, 255))
    lower_red2 = cv2.inRange(hsv, (160, 100, 100), (180, 255, 255))
    red_mask = cv2.bitwise_or(lower_red1, lower_red2)
    
    total_pixels = roi.shape[0] * roi.shape[1]
    white_percentage = (cv2.countNonZero(lower_white) / total_pixels) * 100
    red_percentage = (cv2.countNonZero(red_mask) / total_pixels) * 100
    
    return white_percentage > 35 or (white_percentage > 25 and red_percentage > 5)

# --------------------------------------------------

def detection_worker():
    global detection_state

    try:
        print("\n🧠 Loading YOLOv8 model...")
        model = YOLO('yolov8n.pt')

        print("🎥 Opening video:", VIDEO_PATH)
        cap = cv2.VideoCapture(VIDEO_PATH)

        if not cap.isOpened():
            print("❌ Error: Cannot open video file")
            detection_state['active'] = False
            return

        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        frame_number = 0

        print("🚀 Detection started...\n")

        while detection_state['active'] and cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_number += 1
            results = model(frame, verbose=False)

            ambulance_found = False
            car_count = 0

            for result in results:
                if result.boxes is not None:
                    for box in result.boxes:
                        class_id = int(box.cls[0])
                        class_name = model.names[class_id]

                        if class_name in ['car', 'truck', 'bus']:
                            car_count += 1
                            x1, y1, x2, y2 = map(int, box.xyxy[0])
                            vehicle_roi = frame[y1:y2, x1:x2]

                            if _check_if_ambulance(vehicle_roi):
                                ambulance_found = True
            
            detection_state.update({
                'frame_number': frame_number,
                'total_frames': total_frames,
                'vehicle_count': car_count,
                'ambulance_detected': ambulance_found,
                'traffic_light': 'GREEN' if ambulance_found else 'RED'
            })

            # 🔥 REAL TERMINAL OUTPUT
            if ambulance_found:
                print(f"🚑 Ambulance detected at frame {frame_number}")
            else:
                print(f"Frame {frame_number} | Vehicles: {car_count}")

            time.sleep(0.05)

        cap.release()
        print("\n✅ Detection finished.")
        detection_state['active'] = False

    except Exception as e:
        print(f"❌ Detection error: {e}")
        detection_state['active'] = False

# --------------------------------------------------
# ROUTES
# --------------------------------------------------

@app.route("/")
def home():
    return jsonify({
        "message": "Ambulance Detection API",
        "status": "running",
        "endpoints": ["/upload", "/start", "/stop", "/status"]
    })

# React se video upload
@app.route("/upload", methods=["POST"])
def upload_video():
    video = request.files["video"]
    video.save(VIDEO_PATH)

    print("\n==============================")
    print("🎥 New video uploaded:", VIDEO_PATH)
    print("==============================\n")

    return jsonify({"status": "uploaded"})

# Start detection
@app.route("/start", methods=["POST"])
def start_detection():
    if not detection_state['active']:
        detection_state['active'] = True
        detection_state['ambulance_detected'] = False

        thread = threading.Thread(target=detection_worker)
        thread.daemon = True
        thread.start()

        return jsonify({"status": "started"})
    return jsonify({"status": "already_running"})

# Stop detection
@app.route("/stop", methods=["POST"])
def stop_detection():
    detection_state['active'] = False
    return jsonify({"status": "stopped"})

# Status
@app.route("/status")
def get_status():
    return jsonify(detection_state)

# --------------------------------------------------

if __name__ == "__main__":
    print("🚀 Starting Ambulance Detection API...")
    print("📡 http://localhost:5000")
    app.run(debug=True, port=5000)
