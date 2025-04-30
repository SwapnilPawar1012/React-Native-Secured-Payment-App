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
    print("Received images:", len(images_base64))

    if len(images_base64) != 24:
        return jsonify({'error': 'Exactly 28 images required (20 stored + 4 current)'}), 400

    # Split images
    stored_images_base64 = images_base64[:20]
    current_images_base64 = images_base64[20:]

    # Decode stored images
    stored_images = []
    for img_str in stored_images_base64:
        try: 
            img_data = base64.b64decode(img_str)
            npimg = np.frombuffer(img_data, np.uint8)
            img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
            if img is None:
                raise ValueError("Image decoding failed")
            stored_images.append(img)
        except Exception as e:
            return jsonify({'error': f'Error decoding image: {str(e)}'}), 400

    # Decode and validate current images
    current_images = []
    valid_face_found = False

    for img_str in current_images_base64:
        try:
            img_data = base64.b64decode(img_str)
            npimg = np.frombuffer(img_data, np.uint8)
            img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

            if img is not None and validate_face_image(img):
                print("Valid face image found.")
                valid_face_found = True
                current_images.append(img)
            else:
                print("Invalid face image.")
                current_images.append(None)  # placeholder for invalid images
        except Exception:
            print(f"Exception while decoding: {e}")
            current_images.append(None)  # placeholder for invalid images

    # If none of the current images are valid
    if not valid_face_found:
        return jsonify({
            'message': 'No valid faces found in current images.',
            'error': True,
            'code': 400
        }), 400

    # Proceed with face matching
    results = []
    for idx, current_img in enumerate(current_images):
        if current_img is None:
            results.append({
                'current_photo_index': idx,
                'match_found_with_stored': False,
                'note': 'Invalid or no face detected'
            })
            continue

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


def validate_face_image(img):
    """
    Validate if the given image contains a detectable face.
    This function uses OpenCV's Haar cascades for simplicity.
    """
    # Load the pre-trained face detector
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    # Convert the image to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Detect faces in the image
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=8, minSize=(50, 50))
    
    print(f"Faces detected: {len(faces)}")
    # Return true if at least one face is detected
    return len(faces) > 0

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
