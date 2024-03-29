// eslint-disable-next-line import/default
import jsonwebtoken from 'jsonwebtoken';

export const jwt = {
  encode(payload: object): string {
    // eslint-disable-next-line import/no-named-as-default-member
    return jsonwebtoken.sign(payload, 'secret');
  },

  decode<Payload extends object>(value: string): Payload {
    // eslint-disable-next-line import/no-named-as-default-member
    return jsonwebtoken.verify(value, 'secret') as Payload;
  },
};
