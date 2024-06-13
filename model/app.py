from flask import Flask, request, jsonify, send_file, make_response
from flask_cors import CORS
import os
import nbformat
from nbconvert.preprocessors import ExecutePreprocessor
from werkzeug.utils import secure_filename
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
CORS(app, resources={r"/upload": {"origins": "http://localhost:5173"}})

model_id = "Anthuni/thesis_model"
token = "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"     

model = ViTForImageClassification.from_pretrained(model_id, token=token)
feature_extractor = ViTFeatureExtractor.from_pretrained(model_id, token=token)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATA_FOLDER = os.path.join(BASE_DIR, 'data')
os.makedirs(DATA_FOLDER, exist_ok=True)

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
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        filename = f"audio_{timestamp}.wav"
        filepath = os.path.join(DATA_FOLDER, filename)
        file.save(filepath)
        
        try:
            #Preprocess the uploaded file
            output_path = process_wav_to_spec(filepath)

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

def process_wav_to_spec(filepath):
    notebook_path = os.path.join(BASE_DIR, 'Wav2Spec.ipynb')
    
    try:
        with open(notebook_path) as f:
            nb = nbformat.read(f, as_version=4)
        ep = ExecutePreprocessor(timeout=600, kernel_name='python3')

        ##Set directory to save the image
        output_image_path = os.path.splitext(filepath)[0] + '_spectrogram.png'

        ##Add new code in the Jupyter notebook
        #(to load the uploaded file in the notebook)
        newcell = nbformat.v4.new_code_cell(f"""
        img = wav2melspec(r"{filepath}")                       
        img.save(r"{output_image_path}")      
        """)

        nb.cells.append(newcell)
        ep.preprocess(nb, {'metadata': {'path': './'}})
    
        if not os.path.exists(output_image_path):
            raise FileNotFoundError(f"Output image {output_image_path} not created.")
        
        return output_image_path
    
    except Exception as e:
        print(f"Error executing notebook: {e}")
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