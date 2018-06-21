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
            console.log(stream)
            record.onmousedown = function() {
                mediaRecorder.start();
                console.log(mediaRecorder.state);
                console.log("recorder started");
                record.style.background = "red";
                record.style.color = "black";
            }

            record.onmouseup = function() {
                mediaRecorder.stop();
                console.log(mediaRecorder.state);
                console.log("recorder stopped");
                record.style.background = "";
                record.style.color = "";
            }

            var chunks = [];
            mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data);
            }

            mediaRecorder.onstop = function(e) {
            
            console.log("recorder stopped");

            var clipName = prompt('Enter a name for your sound clip');

            var blob = new Blob(chunks, { 'type' : 'audio/wav; codecs=opus' });
            chunks = [];
            console.log(blob.toString('base64'));
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