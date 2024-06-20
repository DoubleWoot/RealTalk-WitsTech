from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
from transformers import ViTForImageClassification, ViTFeatureExtractor
import torch
import torch.nn.functional as F

#For opening images
from PIL import Image

#For converting images to base64 (for JSON parsing)
from io import BytesIO
import base64

app = Flask(__name__)
#CORS(app, resources={r"/upload": {"origins": "http://localhost:5173"}})
CORS(app)

model_id = "Anthuni/Final_Thesis_Model"
token = "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"     

model = ViTForImageClassification.from_pretrained(model_id, token=token)
feature_extractor = ViTFeatureExtractor.from_pretrained(model_id, token=token)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATA_FOLDER = os.path.join(BASE_DIR, 'data')
os.makedirs(DATA_FOLDER, exist_ok=True)

def clean_data_folder():
    for filename in os.listdir(DATA_FOLDER):
        file_path = os.path.join(DATA_FOLDER, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
        except Exception as e:
            print(f'Failed to delete {file_path}. Reason: {e}') 

@app.route('/')
def index():
    return "Flask Server is running."

@app.route('/favicon.ico')
def favicon():
    return '', 204

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and file.filename.endswith('.wav'):
        clean_data_folder()
        
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        filename = f"audio_{timestamp}.wav"
        filepath = os.path.join(DATA_FOLDER, filename)
        file.save(filepath)
        
        try:
            #Preprocess the uploaded file
            output_path = preprocessor(filepath)

            #open the saved file
            image = Image.open(output_path)

            #Convert file to base 64
            buffered = BytesIO()
            image.save(buffered, format="PNG")
            spectrogram_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

            #Run the file through the model to get the decision
            score, result = model_inference(image)

            #Create a JSON object to be returned and parsed in the client side
            response = {
                'spectrogram_url': spectrogram_base64,
                'result': result,
                'score': score
            }
            return jsonify(response), 200
            # return send_file(output_path, mimetype='image/png')
        
        except Exception as e:
            print(f"Error processing file: {e}")
            return jsonify({'error': str(e)}), 500
        
    return jsonify({'error': 'File type not allowed'}), 400
    
def preprocessor(filepath):
    try:
        import wav_to_spec as to_spec
        output_image_path = os.path.splitext(filepath)[0] + '_spectrogram.png'
        img = to_spec.wav2melspec(filepath)
        img.save(output_image_path)
        
        return output_image_path
    except Exception as e:
        print(f"Error {e}")
        raise

    

def model_inference(image):
    inputs = feature_extractor(images=image, return_tensors="pt")
    with torch.no_grad():
        logits = model(**inputs).logits

    probabilities = F.softmax(logits, dim=-1)
    confidence_score = probabilities.max().item() * 100

    if probabilities.argmax().item() == 0:
        result = "Fake"
    elif probabilities.argmax().item() == 1:
        result = "Real"
    else:
        result = "no decision"
        
    return (str(round(confidence_score, 2)) + "%", result)

if __name__ == '__main__':
    app.run(debug=True)