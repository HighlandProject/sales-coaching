let startButton = document.getElementById('start');
let stopButton = document.getElementById('stop');
let mediaRecorder;
let audioChunks = [];

startButton.addEventListener('click', async () => {
    let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };
    mediaRecorder.onstop = () => {
        let audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        sendAudioToServer(audioBlob);
        audioChunks = [];
    };
    mediaRecorder.start();
    startButton.disabled = true;
    stopButton.disabled = false;
});

stopButton.addEventListener('click', () => {
    mediaRecorder.stop();
    startButton.disabled = false;
    stopButton.disabled = true;
});

mediaRecorder.onstop = () => {
    let audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    sendAudioToServer(audioBlob);
    audioChunks = [];
};

function sendAudioToServer(blob) {
    let formData = new FormData();
    formData.append("audio_data", blob, "audio.wav");
    
    fetch('/upload', {
        method: 'POST',
        body: formData
    }).then(response => {
        return response.text();
    }).then(data => {
        console.log(data);
        window.location.href = "/?path=audio.wav";
    }).catch(error => {
        console.error(error);
    });
}