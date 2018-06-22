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
                // console.log("chunks" + chunks[0])
                console.log("recorder stopped");

                var blob = new Blob(chunks, { 'type' : 'audio/wav; codecs=opus' });
                // console.log(blob)
                chunks = [];

                // Add url attribute to anchor
                // var url = URL.createObjectURL(blob);
                // var ahref = document.getElementById('downloadblob'); 
                // ahref.href = url

                //Send audio file to flask API
                // var xhr = new XMLHttpRequest();
                // var fd = new FormData();
                // fd.append("file", blob, 'audio.wav')
                // xhr.open('POST', 'http://127.0.0.1:5005/api/audio', true);
                // //Send the proper header information along with the request
                // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                // xhr.send(fd)
                // console.log("sent the blob")

                var fd = new FormData();
                fd.append('file', 'audio.wav');
                fd.append('data', blob);
                $.ajax({
                    type: 'POST',
                    url: 'http://127.0.0.1:5005/api/audio',
                    data: fd,
                    processData: false,
                    contentType: false
                }).done(function(data) {
                    document.getElementById('productdescription').innerHTML = data;
                    console.log(data);
                });
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