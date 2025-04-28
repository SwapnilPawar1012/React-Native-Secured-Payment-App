from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64
from deepface import DeepFace

app = Flask(__name__)

@app.route('/detect-faces', methods=['POST'])
def detect_faces():
    data = request.get_json()
    images_base64 = data.get('images', [])

    if len(images_base64) != 10:
        return jsonify({'error': 'Exactly 10 images required (8 stored + 2 current)'}), 400

    # Split images
    stored_images_base64 = images_base64[:8]
    current_images_base64 = images_base64[8:]

    # Decode base64 to numpy arrays
    stored_images = []
    for img_str in stored_images_base64:
        img_data = base64.b64decode(img_str)
        npimg = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
        stored_images.append(img)

    current_images = []
    for img_str in current_images_base64:
        img_data = base64.b64decode(img_str)
        npimg = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
        current_images.append(img)

    # Now verify: match each current image with all stored images
    results = []

    for idx, current_img in enumerate(current_images):
        match_found = False
        for stored_img in stored_images:
            try:
                verification = DeepFace.verify(current_img, stored_img, model_name='VGG-Face', enforce_detection=False)
                if verification["verified"]:
                    match_found = True
                    break
            except Exception as e:
                print(f"Error comparing images: {e}")
                continue
        
        results.append({
            'current_photo_index': idx,
            'match_found_with_stored': match_found
        })

    return jsonify({'results': results})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
