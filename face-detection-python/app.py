from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64

app = Flask(__name__)

@app.route('/detect-faces', methods=['POST'])
def detect_faces():
    data = request.get_json()
    images_base64 = data.get('images', [])

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    detection_results = []

    for img_str in images_base64:
        img_data = base64.b64decode(img_str)
        npimg = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)

        detection_results.append({
            'faces_detected': len(faces),
            'boxes': faces.tolist()  # List of bounding boxes
        })

    return jsonify({'faces': detection_results})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
