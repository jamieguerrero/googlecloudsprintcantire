import io, os, sys, wave, requests, json

from flask import Flask, render_template, request, redirect, Response
from flask_cors import CORS

# Imports the Google Cloud client library
from google.cloud import datastore

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

        # Open file and write binary (blob) data
        f = open('./file.wav', 'w+')
        f.write(request.data)
        f.close()

        params = (('key', 'AIzaSyAxgxicufBuHtEMsqScWdu4Uaivs0Laox4'),)

        # Datastore Data
        myBucket = 'canadiantired'
        storeHeaders = {
            'Content-Type': 'audio/wav',
            'Authorization':  'Bearer AIzaSyAxgxicufBuHtEMsqScWdu4Uaivs0Laox4'
        }

        os.environ['GOOGLE_APPLICATION_CREDENTIALS']='credentials.json'

        # Instantiates a client
        datastore_client = datastore.Client()

        task = datastore_client.key('sampletask1')
        print(datastore_client.get(task))

        # # The kind for the new entity
        # kind = 'Task'
        # # The name/ID for the new entity
        # name = 'sampletask1'
        # # The Cloud Datastore key for the new entity
        # task_key = datastore_client.key(kind, name)

        # # Prepares the new entity
        # task = datastore.Entity(key=task_key)
        # task['description'] = 'Buy milk'

        # # Saves the entity
        # datastore_client.put(task)

        # print('Saved {}: {}'.format(task.key.name, task['description']))


        # storeAPI = 'https://datastore.googleapis.com/v1/upload/storage/v1/b/' + myBucket + '/o?uploadType=media&name=myObject'
        # send f file to datastore
        # storeResponse = requests.post(url=storeAPI, data=f, params=params)
        # print(storeResponse.status_code, storeResponse.reason, storeResponse.text)


        # Speech Data
        speechHeaders = {'Content-Type': 'application/json'}
        speech = {
            "config": {
                "encoding":"FLAC",
                "sample_rate": 16000,
                "language_code": "en-US"
            },
            "audio": {
                "uri":"gs://cloud-samples-tests/speech/brooklyn.flac"
            }
        }
        speechData = json.dumps(speech)

        speechAPI = 'https://speech.googleapis.com/v1beta1/speech:syncrecognize'
        speechResponse = requests.post(url=speechAPI, data=speechData, params=params, headers=speechHeaders)
        print(speechResponse.status_code, speechResponse.reason, speechResponse.text)

        return speechResponse.text

if __name__ == '__main__':
    app.run(use_reloader=True, port=5005)