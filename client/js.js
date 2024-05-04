var socket = io.connect('http://192.168.0.108:5000');
var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.send(input.value);
        input.value = '';
    }
});

socket.on('connect', function () {
    console.log('Cliente se ha conectado al servidor!');
});

socket.on('message', function (data) {
    console.log('Recibido un mensaje del servidor!', data);
    var item = document.createElement('li');
    item.textContent = data;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('disconnect', function () {
    console.log('El cliente se ha desconectado!');
});