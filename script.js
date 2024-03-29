window.onload = function() {
    const popupCloseButton = document.getElementById('popup-close-button');
    const popupChat = document.getElementById('popup-chat');
    const popupMessageInput = document.getElementById('popup-message-input');
    const popupSendButton = document.getElementById('popup-send-button');
    const popupStartRecordButton = document.getElementById('popup-start-record-button');
    const popupStopRecordButton = document.getElementById('popup-stop-record-button');
    const popupPlayButton = document.getElementById('popup-play-button');
    const popupChatMessages = document.getElementById('popup-chat-messages');

    popupCloseButton.addEventListener('click', function() {
        popupChat.style.display = 'none';
    });

    setTimeout(function() {
        popupChat.style.display = 'block';
    }, 2000);

    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    let mediaRecorder;
    let audioChunks = [];

    function sendMessage(message, container, textColor) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.style.color = textColor;
        container.appendChild(messageElement);
    }

    function respondToMessage(message, container) {
        const keywordsResponses = {
            'привет': ['Привет!', 'Здравствуйте!', 'Добрый день!'],
            'миэм': ['Если вы хотите узнать больше о МИЭМ НИУ ВШЭ, перейдите по быстрым ссылкам МИЭМ'],
            'лмс': ['ЛМС - Личный кабинет студента. Если вы хотите перейти в ЛМС, ссылка находится в верхней части экрана.'],
            'адрес главного корпуса': ['Главный корпус НИУ ВШЭ находится по адресу Покровский бульвар, 11'],
            'пока': ['До свидания!', 'Пока-пока!', 'Удачи!']
        };

        for (const keyword in keywordsResponses) {
            if (message.toLowerCase().includes(keyword)) {
                const responses = keywordsResponses[keyword];
                const response = getRandomElement(responses);
                sendMessage(response, container, '#1a1aff');
                break;
            }
        }
    }

    popupSendButton.addEventListener('click', function() {
        const message = popupMessageInput.value;
        sendMessage(message, popupChatMessages, '#000000');
        respondToMessage(message, popupChatMessages);
        popupMessageInput.value = '';
    });

    async function startRecording() {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = function(event) {
            audioChunks.push(event.data);
        };
        mediaRecorder.start();
        popupStopRecordButton.disabled = false;
        popupStartRecordButton.disabled = true;
        popupPlayButton.disabled = true;
    }

    function stopRecording() {
        mediaRecorder.stop();
        popupStopRecordButton.disabled = true;
        popupStartRecordButton.disabled = false;
        popupPlayButton.disabled = false;
    }

    popupStartRecordButton.addEventListener('click', startRecording);
    popupStopRecordButton.addEventListener('click', stopRecording);

    function playRecording() {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioURL = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioURL);
        audio.play();
    }

    popupPlayButton.addEventListener('click', playRecording);

    var map = L.map('map').setView([55.8033070999, 37.41033554077], 16.5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.marker([55.8033070999409, 37.41033554077149]).addTo(map)
        .bindPopup('МИЭМ НИУ ВШЭ') 
        .openPopup();
};
