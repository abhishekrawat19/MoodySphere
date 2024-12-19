// Theme switcher
document.getElementById('light-theme-button').addEventListener('click', () => {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
});

document.getElementById('dark-theme-button').addEventListener('click', () => {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
});

// Dataset analysis script
document.getElementById('analyze-dataset-button').addEventListener('click', () => {
    const fileInput = document.getElementById('dataset-input');
    const resultsDiv = document.getElementById('dataset-results');
    resultsDiv.innerHTML = '';

    if (fileInput.files.length === 0) {
        resultsDiv.innerHTML = '<p>Please upload a dataset file.</p>';
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        const content = event.target.result;
        // Here you can add your dataset analysis logic, e.g., parsing the file and displaying results
        resultsDiv.innerHTML = '<p>Dataset loaded successfully.</p>';
        console.log(content); // For demonstration purposes
    };

    if (file.type === "text/csv") {
        reader.readAsText(file);
    } else if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        reader.readAsArrayBuffer(file);
        reader.onloadend = (event) => {
            const arrayBuffer = event.target.result;
            /* You can integrate a library like SheetJS (xlsx) to parse Excel files */
            resultsDiv.innerHTML = '<p>Excel file loaded successfully.</p>';
            console.log(arrayBuffer); // For demonstration purposes
        };
    } else {
        resultsDiv.innerHTML = '<p>Unsupported file type. Please upload a CSV or Excel file.</p>';
    }
});

// Twitter fetch script
document.getElementById('fetch-tweets-button').addEventListener('click', () => {
    const keyword = document.getElementById('twitter-keyword').value;
    if (keyword) {
        fetch(`https://api.example.com/search/tweets?q=${encodeURIComponent(keyword)}`)
            .then(response => response.json())
            .then(data => {
                const resultsDiv = document.getElementById('twitter-results');
                resultsDiv.innerHTML = '';
                data.statuses.forEach(status => {
                    const tweetDiv = document.createElement('div');
                    tweetDiv.classList.add('tweet');
                    tweetDiv.innerHTML = `<p><strong>@${status.user.screen_name}</strong>: ${status.text}</p>`;
                    resultsDiv.appendChild(tweetDiv);
                });
            })
            .catch(error => console.error('Error fetching tweets:', error));
    }
});

// Audio recording script
let mediaRecorder;
let recordedChunks = [];

document.getElementById('record-audio-button').addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
    } else {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        recordedChunks.push(e.data);
                    }
                };
                mediaRecorder.onstop = () => {
                    const blob = new Blob(recordedChunks, { type: 'audio/wav' });
                    const audioURL = URL.createObjectURL(blob);
                    const audioElement = document.createElement('audio');
                    audioElement.src = audioURL;
                    audioElement.controls = true;
                    document.getElementById('recorded-audio').appendChild(audioElement);
                    recordedChunks = [];
                };
                mediaRecorder.start();
            })
            .catch(error => console.error('Error accessing audio devices.', error));
    }
});
