const net = require('net');
const readline = require('readline');

const client = net.createConnection({
  host: 'localhost',
  port: 5000
});

var rol = 0;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
    });

client.on('connect', () => {
  console.log('Conectado al servidor');
  
  client.on('data', (data) => {
    var n_data = JSON.parse(data);
    console.log('Datos recibidos:', n_data);
    if(n_data.action == 0)
    {
        setTimeout(() =>{
            client.write(JSON.stringify({action: 6}));
            
        }, 1000);
    }

    if(n_data.action == 6)
    {
        setTimeout(() =>{
            client.write(JSON.stringify({action: 2, key_room : "prueba"}));
            
        }, 1000);
    }

    if(n_data.action == 7)
    {
        rol = n_data.rol;
        console.log("juego inicializado");
    }

    if(n_data.action == 13)
    {
        if(n_data.turn == rol)
        {
            rl.question('Por favor, introduce un movimiento: ', (dato) => {
                console.log(`El dato recibido es: ${dato}`);
            });
        }
    }
    
    if(n_data.action == 12)
    {
        console.log("restaurando");
    }
    //client.write("Hola");

  });


  
});





client.on('error', (error) => {
  console.error('Error al conectar al servidor:', error.message);
});

client.on('close', () => {
  console.log('Conexión cerrada');
  rl.close();
});