// interface ServerInfo {
//     ip: string,
//     ping: number,
//     name: string,
//     map: string,
//     players: number,
//     limit: number,
//     desc: string,
//     version: string,
//     wave: number,
//     gamemode :string
// }

// export default class Server {

//     public static getStatus(ip : string) {

//     }

// }

import { Socket, createSocket } from "dgram";
import { unpack } from "python-struct";

interface Status {
  name: string;
  map: string;
  players: number | undefined;
  wave: number;
  version: number;
  vertype: string;
  gamemode: number;
  limit: number;
  desc: string;
  modename: string;
  ping: number;
}

class Server {
  server: { host: string; port: number };
  inputServer: { host: string; port: number };
  public info: Partial<Status> = {};

  constructor(
    serverHost: string,
    serverPort: number = 6567,
    inputPort: number = 6859
  ) {
    this.server = { host: serverHost, port: serverPort };
    this.inputServer = { host: serverHost, port: inputPort };
  }

  get statusString(): string {
    return `${this.server.host}:${this.server.port}:${this.inputServer.port}`;
  }

  get status(): string {
    return `${this.constructor.name}(${this.statusString})`;
  }

  get_status(
    timeout: number = 10.0,
    encoding: string = "utf-8",
    errors: string = "strict"
  ): Promise<Partial<Status>> {
    return new Promise((resolve) => {
      const s: Socket = createSocket("udp4");
      s.connect(this.server.port, this.server.host, () => {
        const sTime = Date.now();
        s.send(Buffer.from([254, 1]));
        s.once("message", (data) => {
          const eTime = Date.now();
          let offset = 1;
          this.info.name = data.slice(1, data[0] + 1).toString();
          data = data.slice(data[0] + 1);
          this.info.map = data.slice(1, data[0] + 1).toString();
          data = data.slice(data[0] + 1);
          this.info.players = Number(unpack(">i", data.slice(0, 4))[0]);
          data = data.slice(4);
          this.info.wave = Number(unpack(">i", data.slice(0, 4))[0]);
          data = data.slice(4);
          this.info.version = Number(unpack(">i", data.slice(0, 4))[0]);
          data = data.slice(4);
          this.info.vertype = data.slice(0, data[0] + 1).toString("utf-8");
          data = data.slice(data[0] + 1);
          this.info.gamemode = Number(unpack(">b", data.slice(0, 1))[0]);
          data = data.slice(1);
          this.info.limit = Number(unpack(">i", data.slice(0, 4))[0]);
          data = data.slice(4);
          this.info.desc = data.slice(0, data[0] + 1).toString("utf-8");
          data = data.slice(data[0] + 1);
          this.info.modename = data.slice(1, data[0] + 1).toString("utf-8");
          data = data.slice(data[0] + 1);

          this.info.ping = Math.round(eTime - sTime);
          s.close();
          resolve(this.info);
        });
      });
    });
  }
}

// Example Usage
const server = new Server("server.mindustry-tool.app");
// Output: Server(example.com:6567:6859)
server.get_status().then((status) => {
  console.log(status);
  // Output: { name: 'Some Server', map: 'Map1', ... }
});
