export const API_END_POINTS = {
    LOBBY: "/lobby",
    SPIN_WHEEL: "/game/wheelOfFortuneResultSpinner",
    HISTORY: "/game/history",
    REGISTER: "",
    RESET_PASSWORD: "",
};

export const enum DEPLOYMENT_MODE {
    LOCAL = 0,
    DEVELOPMENT,
    STAGING,
    PRODUCTION,
}

export enum GAME_ROUNDS {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOURS = 4,
}

export enum REVEALING_CARDS {
    ONE = 3,
    TWO = 2,
    THREE = 1,
    FOUR = 1,
}

export let SERVER = DEPLOYMENT_MODE.DEVELOPMENT;
export let HISTORY_LIMIT = 20;

export const REQUEST_TYPE = {
    GET: "get",
    POST: "post",
    PUT: "put",
};

export const API_TEST_KEYS = {
    LOCAL: "test",
    DEVELOPMENT: "development",
    STAGING: "staging",
};

export const BASE_ADDRESS = {
    LOCAL: "http://192.180.0.68:4002/v1",
    DEVELOPMENT: "https://api-bt2-uat.btmm222.com/v1",
    STAGING: "https://master-api-uat.btmm222.com/v1",
    PRODUCTION: "https://api.btmm222.com/v1",
};
export const SOKCET_URLS = {
    // LOCAL: "http://192.180.0.68:4001/",
    DEVELOPMENT: "https://socket-uat.btmm222.com/",
    LOCAL: "https://7b5c-122-160-165-213.ngrok-free.app/",
    STAGING: "https://socket.btmm222.com/",
    PRODUCTION: "https://socket.btmm222.com/",
};

export const SOCKET_EVENTS = {
    Connect: "connect",
    Reconnect: "reconnection",
    Reconnecting: "reconnecting",
    Disconnect: "disconnect",
    Error: "error",
    Message: "message",
    EventTest: "Test",
    SingleEvent: "SingleEvent",
};
