import { WebSocketServer} from "ws";
import { GameManager } from "./gameManager";

const wss = new WebSocketServer({ port: 8080 });
const gameMgr = new GameManager();

wss.on("connection", function connection(ws : WebSocket) {
  gameMgr.addUser(ws);

  ws.addEventListener("close", () => gameMgr.removeUser(ws));
});
