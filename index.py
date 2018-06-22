import io, os, sys, wave, requests, json

from flask import Flask, render_template, request, redirect, Response, send_file
from flask_cors import CORS
from pydub import AudioSegment

# Imports the Google Cloud client library
from google.cloud import storage
from google.cloud import speech

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
        print (request.form['file'])
        print "======"
        print(request.data)

        # Open file and write binary (blob) data
        f = open('./audio.wav', 'w+')
        f.write(request.data)
        f.close()

        os.environ['GOOGLE_APPLICATION_CREDENTIALS']='credentials.json'
        params = (('key', 'AIzaSyAxgxicufBuHtEMsqScWdu4Uaivs0Laox4'),)

        # =========================Storage API=========================
        # storage REST api
        # storageAPI = 'https://www.googleapis.com/storage/v1/b/canadiantired/o/test.wav'
        # storageResponse = requests.get(url=storageAPI, params=params)
        # print storageResponse.text

        # Instantiates a client
        storage_client = storage.Client()

        #This creates a new bucket
        # # The name for the new bucket
        bucket_name = 'canadiantired'

        # # Creates the new bucket
        # bucket = storage_client.create_bucket(bucket_name)

        # print('Bucket {} created.'.format(bucket.name))

        def upload_blob(bucket_name, source_file_name, destination_blob_name):
            """Uploads a file to the bucket."""
            storage_client = storage.Client()
            bucket = storage_client.get_bucket(bucket_name)
            blob = bucket.blob(destination_blob_name)

            print('Blob {} is publicly accessible at {}'.format( 
                blob.name, blob.public_url))

            blob.upload_from_filename(source_file_name)
            blob.make_public()

            print('File {} uploaded to {}.'.format(
                source_file_name,
                destination_blob_name))

        upload_blob(bucket_name, 'audio.wav', 'audio.wav')
        

        # =========================Speech Data API=========================
        # Here down works
        
        speechHeaders = {'Content-Type': 'application/json'}
        # speech = {
        #     "config": {
        #         "encoding":"LINEAR16",
        #         "sample_rate": 16000,
        #         "language_code": "en-US"
        #     },
        #     "audio": {
        #         "uri":"gs://canadiantired/audio.wav"
        #     }
        # }

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
        # print(speechResponse.status_code, speechResponse.reason, speechResponse.text)

        # =========================ElasticSearch API=========================
        elasticHeaders = {'Content-Type': 'application/json', }
        elastic = {
                
                "productid" : "bike4",
                "eng_desc" : "how old is the Brooklyn Bridge",
                "ratings" : "3"
                
        }

        elasticData = json.dumps(elastic)
        # data = open('request.json', 'rb').read() #json request file required
        elasticResponse = requests.get('http://104.198.254.220:9200/_search?q=bike')
        # a = json.loads(response.text)

        print elasticResponse
        return elasticResponse.text

if __name__ == '__main__':
    app.run(use_reloader=True, port=5005)