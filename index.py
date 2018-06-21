import io, os, sys, wave, requests, json

from flask import Flask, render_template, request, redirect, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/api/audio', methods = ['POST'])
def post_audio():
    if request.method == 'POST':
         # get data using flask
        blob = request.get_data()
        data = request.data
        # print data

        # Open file and write binary (blob) data
        f = open('./file.wav', 'wb')
        f.write(request.data)
        f.close()

        params = (('key', 'AIzaSyB9-zDftEXnwBxQKJGivvS8Ku11ehMH3ac'),)

        headers = {'Content-Type': 'application/json'}

        data = {
            "config": {
                "encoding":"FLAC",
                "sample_rate": 16000,
                "language_code": "en-US"
            },
            "audio": {
                "uri":"gs://cloud-samples-tests/speech/brooklyn.flac"
            }
        }

        jsonData = json.dumps(data)

        api_url = 'https://speech.googleapis.com/v1beta1/speech:syncrecognize'
        r = requests.post(url=api_url, data=jsonData, params=params, headers=headers)
        print(r.status_code, r.reason, r.text)

        return r.text

if __name__ == '__main__':
    app.run(use_reloader=True, port=5005)