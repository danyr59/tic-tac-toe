const net = require('net');
const readline = require('readline');


const ACTION = {
  AUTHENTICATION: 0,
  NEW_ROOM: 1,
  CHOOSE_ROOM: 2,
  SELECT_MOVEMENT: 3,
  OUT_ROOM: 4,
  OUT_GAME: 5,
  LIST_ROOM: 6,
  START_GAME: 7,
};

const ACTION_GAME = {
  MOVE: 10,
  CLOSE: 11,
  RESTART: 12,
  UPDATE: 13,
  WIN: 14,
};




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
    if(n_data.action == ACTION.AUTHENTICATION)
    {
      console.log("en el menu de inicio")
      setTimeout(() =>{
        client.write(JSON.stringify({action: ACTION.NEW_ROOM, key_room: "prueba"}));
        
      }, 3000);
    }

    if(n_data.action == ACTION.NEW_ROOM)
    {
      if(n_data.status == 1)
       {
         setTimeout(() =>{
           client.write(JSON.stringify({action: ACTION.LIST_ROOM}));
           
         }, 1000);
       }else
       {
        console.log("no se creo la sala");
       }
    }

    if(n_data.action == 4)
    {
      console.log("se cerro la sala");
      rl.question('nueva sala: ', (d) => {
          client.write(JSON.stringify({action: 4, key_room: d}));
      });
    }

    if(n_data.action == 7)
    {
        rol = n_data.rol;
        console.log("juego inicializado");
    }

    if(n_data.action == 13)
    {
        if(n_data.status == 0)
        {
          if(n_data.turn == rol)
          {
              rl.question('Por favor, introduce un movimiento: ', (d) => {
                client.write(JSON.stringify({action: 10, move: parseInt(d)}));
                if(d === "10")
                  client.write(JSON.stringify({action: 11}));
                else
                  client.write(JSON.stringify({action: 10, move: parseInt(d)}));
              });
          }
        }
        if(n_data.status == 2)
        {
          console.log("casilla ocupada");
          if(n_data.turn == rol)
          {
              rl.question('Por favor, introduce un movimiento: ', (d) => {
                if(d === "10")
                  client.write(JSON.stringify({action: 11}));
                else
                  client.write(JSON.stringify({action: 10, move: parseInt(d)}));
              });
          }
        }
        if(n_data.status == 4)
        {
          rl.question('Tablero lleno,¿deseas reiniciar? (SI = 1, NO = 0): ', (d) => {
            if(d == 0)
              client.write(JSON.stringify({action: 11}));
            else
              client.write(JSON.stringify({action: 12}));

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
});