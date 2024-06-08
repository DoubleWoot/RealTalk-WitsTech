from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import nbformat
from nbconvert.preprocessors import ExecutePreprocessor
from werkzeug.utils import secure_filename
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/upload": {"origins": "http://localhost:5173"}})

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
            output_path = process_wav_to_spec(filepath)
            return send_file(output_path, mimetype='image/png')
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
        output_image_path = os.path.splitext(filepath)[0] + '_spectrogram.png'
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

if __name__ == '__main__':
    app.run(debug=True)