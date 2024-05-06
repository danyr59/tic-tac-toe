const net = require('net');

const client = net.createConnection({
  host: 'localhost',
  port: 5000
});

client.on('connect', () => {
  console.log('Conectado al servidor');

  client.write(JSON.stringify({dato: "hola", dato2: "hola"}));
  
  client.on('data', (data) => {
    var n_data = JSON.parse(data);
    console.log('Datos recibidos:', n_data);
    //client.write("Hola");

  });

  setTimeout(() =>{
    client.write(JSON.stringify({dato: "hola", dato2: 1}));
    console.log("envie cosas");

  }, 4000);
  setTimeout(() =>{
    client.write(JSON.stringify({dato: "hola", dato2: 2}));
    console.log("envie cosas");

  }, 6000);
  setTimeout(() =>{
    client.write(JSON.stringify({dato: "hola", dato2: 3}));
    console.log("envie cosas");

  }, 8000);
});





client.on('error', (error) => {
  console.error('Error al conectar al servidor:', error.message);
});

client.on('close', () => {
  console.log('Conexión cerrada');
});