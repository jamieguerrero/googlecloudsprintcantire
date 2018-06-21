var record = document.querySelector('.record');
var stop = document.querySelector('.stop');
var soundClips = document.querySelector('.sound-clips');

function handleSuccess(stream) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia supported.');
        navigator.mediaDevices.getUserMedia ({audio: true})
        // Success callback
        .then(function(stream) {
            var mediaRecorder = new MediaRecorder(stream);

            record.onmousedown = function() {
                mediaRecorder.start();
                console.log(mediaRecorder.state);
                console.log("recorder started");
            }

            record.onmouseup = function() {
                mediaRecorder.stop();
                console.log(mediaRecorder.state);
                console.log("recorder stopped");
            }

            // Take audio chunks and turn into blob
            var chunks = [];
            mediaRecorder.ondataavailable = function(e) {
                chunks.push(e.data);
            }

            // When recording stops, send off to flask api
            mediaRecorder.onstop = function(e) {
            
                console.log("recorder stopped");

                // var clipName = prompt('Enter a name for your sound clip');

                var blob = new Blob(chunks, { 'type' : 'audio/wav; codecs=opus' });
                chunks = [];

                //Send audio file to flask API
                var xhr = new XMLHttpRequest();
                var fd = new FormData();
                fd.append("wav", blob)
                xhr.open('POST', 'http://127.0.0.1:5005/api/audio', true);
                //Send the proper header information along with the request
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                // xhr.send(fd)
                xhr.send(fd)
                console.log("sent the blob")

            }
        })

        // Error callback
        .catch(function(err) {
            console.log('The following getUserMedia error occured: ' + err);
        }
    );} 
    else {
        console.log('getUserMedia not supported on your browser!');
    }
}

navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(handleSuccess);