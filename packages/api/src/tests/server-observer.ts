import { Server } from 'http';
import { Socket } from 'net';

export class ServerObserver {
  private sockets = new Set<Socket>();

  constructor(private readonly server: Server) {
    this.server.on('connection', (socket) => {
      this.sockets.add(socket);
      server.once('close', () => this.sockets.delete(socket));
    });
  }

  closeAllConnections() {
    for (const socket of this.sockets) {
      socket.destroy();
      this.sockets.delete(socket);
    }
  }
}
