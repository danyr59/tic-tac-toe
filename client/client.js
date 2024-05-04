const net = require('net');

const client = net.createConnection({
  host: 'localhost',
  port: 5000
});

client.on('connect', () => {
  console.log('Conectado al servidor');

  client.write('Hola desde el cliente');

  client.on('data', (data) => {
    console.log('Datos recibidos:', data.toString());
  });
});

setTimeout(() =>
{
  client.write("5555");
}, 5000);

client.on('error', (error) => {
  console.error('Error al conectar al servidor:', error.message);
});

client.on('close', () => {
  console.log('Conexión cerrada');
});