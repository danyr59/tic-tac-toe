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
    ITS_NOT_TURN: 1,
    BOX_OCCUPED: 2,
    WIN: 3,
    ALL_BOX_OCCUPED: 4
  };
  
  const STATUS_RESTART = {
    WAITING_ANOTHER_USER: 0,
    WAITING_RESPONSE: 1
  
  }

  export {ACTION,STATUS,STATUS_RESTART }