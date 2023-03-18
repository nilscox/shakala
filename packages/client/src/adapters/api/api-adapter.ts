import { HttpPort } from '../http/http.port';

export class ApiAdapter {
  constructor(protected readonly http: HttpPort) {}

  withToken(token: string | undefined): this {
    const clone = Object.create(Object.getPrototypeOf(this));

    clone.http = this.http.withToken(token);

    return clone;
  }
}
