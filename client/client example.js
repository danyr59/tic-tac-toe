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
  MOVE: 10,
  CLOSE: 11,
  RESTART: 12,
  UPDATE: 13,
  WIN: 14
};

const STATUS = {
  OK: 0,
  ITS_NOT_TURN : 1,
  BOX_OCCUPED :2,
  WIN: 3,
  ALL_BOX_OCCUPED: 4
};

const STATUS_RESTART = {
  WAITING_ANOTHER_USER : 0,
  WAITING_RESPONSE: 1

}


const client = net.createConnection({
  host: 'tcp://0.tcp.ngrok.io',
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

    if(n_data.action == ACTION.OUT_ROOM)
    {
      console.log("se cerro la sala");
      rl.question('nueva sala: ', (d) => {
          client.write(JSON.stringify({action: ACTION.NEW_ROOM, key_room: d}));
      });
    }

    if(n_data.action == ACTION.START_GAME)
    {
        rol = n_data.rol;
        console.log("juego inicializado");
    }

    if(n_data.action == ACTION.UPDATE)
    {
        if(n_data.status == STATUS.OK)
        {
          if(n_data.turn == rol)
          {
              rl.question('Por favor, introduce un movimiento: ', (d) => {
                //client.write(JSON.stringify({action: ACTION.MOVE, move: parseInt(d)}));
                if(d === "10")
                  client.write(JSON.stringify({action: ACTION.CLOSE}));
                else
                  client.write(JSON.stringify({action: ACTION.MOVE, move: parseInt(d)}));
              });
          }
        }

        if(n_data.status == STATUS.ITS_NOT_TURN)
        {
          console.log("turno equivocado")
        }

        if(n_data.status == STATUS.WIN)
        {
          console.log("!GANASTEE!");
        }

        if(n_data.status == STATUS.BOX_OCCUPED)
        {
          console.log("casilla ocupada");
          if(n_data.turn == rol)
          {
              rl.question('Por favor, introduce un movimiento: ', (d) => {
                if(d === "10")
                  client.write(JSON.stringify({action: ACTION.CLOSE}));
                else
                  client.write(JSON.stringify({action: ACTION.MOVE, move: parseInt(d)}));
              });
          }
        }
        if(n_data.status == STATUS.ALL_BOX_OCCUPED)
        {
          rl.question('Tablero lleno,¿deseas reiniciar? (SI = 1, NO = 0): ', (d) => {
            if(d == 0)
              client.write(JSON.stringify({action: ACTION.CLOSE}));
            else
              client.write(JSON.stringify({action: ACTION.RESTART}));

          });
          
        }
    }
    
    if (n_data.action == ACTION.RESTART) {
      if(n_data.status == STATUS_RESTART.WAITING_ANOTHER_USER)
      {
        console.log("Esperando a que su compañero responda");

      }
      if(n_data.status == STATUS_RESTART.WAITING_RESPONSE)
      {
        // rl.question('Tu compañero marco para reiniciar,¿deseas reiniciar? (SI = 1, NO = 0): ', (d) => {
        //   if (d == 0)
        //     client.write(JSON.stringify({ action: ACTION.CLOSE }));
        //   else
        //     client.write(JSON.stringify({ action: ACTION.RESTART }));

        // });
        console.log("Tu compañero marco para continuar");

      }
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
