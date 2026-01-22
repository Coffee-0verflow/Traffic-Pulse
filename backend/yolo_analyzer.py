import cv2
import sys
import json
from ultralytics import YOLO
import numpy as np

def analyze_video(video_path, ambulance_direction):
    # Load YOLO model
    model = YOLO('yolov8n.pt')  # Using nano version for speed
    
    # Vehicle classes in COCO dataset
    vehicle_classes = [2, 3, 5, 7]  # car, motorcycle, bus, truck
    
    cap = cv2.VideoCapture(video_path)
    
    results = {
        'total_vehicles': 0,
        'vehicles_by_frame': [],
        'congestion_level': 0,
        'ambulance_path_clear': False,
        'recommendations': []
    }
    
    frame_count = 0
    total_detections = 0
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        frame_count += 1
        
        # Run YOLO detection
        detections = model(frame, verbose=False)
        
        frame_vehicles = 0
        for detection in detections:
            boxes = detection.boxes
            if boxes is not None:
                for box in boxes:
                    class_id = int(box.cls[0])
                    confidence = float(box.conf[0])
                    
                    if class_id in vehicle_classes and confidence > 0.5:
                        frame_vehicles += 1
                        total_detections += 1
        
        results['vehicles_by_frame'].append(frame_vehicles)
        
        # Process every 30th frame for performance
        if frame_count % 30 == 0:
            break
    
    cap.release()
    
    # Calculate metrics
    results['total_vehicles'] = total_detections
    avg_vehicles_per_frame = total_detections / max(frame_count, 1)
    results['congestion_level'] = min(100, avg_vehicles_per_frame * 10)
    
    # Ambulance path analysis based on direction
    direction_zones = {
        'north': 'Clear northern lanes for emergency access',
        'south': 'Prioritize southern route optimization', 
        'east': 'Optimize eastern corridor traffic flow',
        'west': 'Clear western approach for ambulance'
    }
    
    results['ambulance_path_clear'] = results['congestion_level'] < 50
    results['recommendations'] = [
        direction_zones.get(ambulance_direction, 'Optimize traffic flow'),
        f'Detected {total_detections} vehicles - {"Low" if avg_vehicles_per_frame < 3 else "High"} congestion',
        'Implement emergency vehicle priority signals' if not results['ambulance_path_clear'] else 'Maintain current signal timing'
    ]
    
    return results

if __name__ == "__main__":
    video_path = sys.argv[1]
    ambulance_direction = sys.argv[2]
    
    try:
        analysis_result = analyze_video(video_path, ambulance_direction)
        print(json.dumps(analysis_result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))