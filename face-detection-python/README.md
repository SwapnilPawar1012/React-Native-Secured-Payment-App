python --version

python -m venv venv 
    Delete the old venv if it was wrong: rm -rf venv

source venv/Scripts/activate

python -m pip install --upgrade pip

pip install -r requirements.txt ***

pip install tensorflow==2.11

pip install deepface==0.0.93
pip install deepface==0.0.93 --use-deprecated=legacy-resolver

pip install flask deepface opencv-python numpy

RUN PYTHON: python app.py
