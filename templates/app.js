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

            localStorage.setItem('myTest', JSON.stringify(blob.toString()));
            var url = URL.createObjectURL(blob);

            var ahref = document.getElementById("downloadtheblob")
            ahref.href = url

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://127.0.0.1:5002/api/audio', true);

            //Send the proper header information along with the request
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function() {
                //Call a function when the state changes.
                if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    // Request finished. Do processing here.
                    console.log("finished XMLHttpRequest")
                }
            }
            console.log("Got here!")
            xhr.send(blob)

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