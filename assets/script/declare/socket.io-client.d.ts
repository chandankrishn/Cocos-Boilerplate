//* If your Project contains sockets
//* 1. npm i socket.io
//* 2. uncomment this code you are ready to go with sockets
declare module "socket.io-client/dist/socket.io.js" {
  import io from "socket.io-client";
  export default io;
}
