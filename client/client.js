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
    //client.write("Hola");
    setTimeout(() =>{
      client.write("hola otra vez x1");
      console.log("envie cosas");

    }, 4000);
    setTimeout(() =>{
      client.write("hola otra vez x2");
      console.log("envie cosas");

    }, 6000);
    setTimeout(() =>{
      client.write("hola otra vez x3");
      console.log("envie cosas");

    }, 8000);
  });
});





client.on('error', (error) => {
  console.error('Error al conectar al servidor:', error.message);
});

client.on('close', () => {
  console.log('Conexión cerrada');
});