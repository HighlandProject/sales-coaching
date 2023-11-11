import os
from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'audio_data' in request.files:
        audio = request.files['audio_data']
        if not os.path.exists('recordings'):
            os.mkdir('recordings')
        audio.save(os.path.join('recordings', 'audio.wav'))
        return 'Audio Saved'
    return 'No Audio Found'

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)