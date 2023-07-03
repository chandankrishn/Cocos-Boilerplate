//* In this constant file you need to add all the interface for all the request being made
interface Lobby {
  cards?: [];
  userdata: {
    name: string;
    balance: number;
  };
  openedCards: {};
}

interface GameData {
  cards?: [];
  userdata: {
    name: string;
    balance: number;
  };
  openedCards: {};
}

export const Response = { Lobby: {} as Lobby, GameData: {} as GameData };
