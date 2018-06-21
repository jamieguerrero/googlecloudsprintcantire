import io
import os

from flask import Flask, render_template, request, redirect, Response
from flask_cors import CORS

# Imports the Google Cloud client library
from google.cloud import speech
from google.cloud.speech import enums
from google.cloud.speech import types

app = Flask(__name__)
CORS(app)

# Instantiates a client
client = speech.SpeechClient(credentials="qwiklabs-gcp-9586e575cae6194c.json")

@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/api/audio', methods = ['POST'])
def post_audio():
    if request.method == 'POST':
        # get data using flask
        blob = request.get_data()
        print blob

        # Loads the audio into memory
        audio = types.RecognitionAudio(content=blob)

        config = types.RecognitionConfig(
            encoding=enums.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code='en-US')

        # Detects speech in the audio file
        response = client.recognize(config, audio)

        for result in response.results:
            print('Transcript: {}'.format(result.alternatives[0].transcript))

        return response

if __name__ == '__main__':
    app.run(use_reloader=True, port=5002)