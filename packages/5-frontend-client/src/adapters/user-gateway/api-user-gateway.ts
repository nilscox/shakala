import { InvalidImageFormat } from 'frontend-domain';
import { UserGateway } from 'frontend-domain/src/user/user.gateway';

import { HttpGateway } from '../http-gateway/http.gateway';

export class ApiUserGateway implements UserGateway {
  constructor(private readonly http: HttpGateway) {}

  async changeProfileImage(image: File): Promise<string> {
    const body = new FormData();

    body.set('profileImage', image);

    const response = await this.http.post<string, FormData>(`/account/profile-image`, {
      body,
      onError: (error) => {
        if (error.status === 400 && error.response.body.code === 'InvalidImageFormat') {
          throw new InvalidImageFormat();
        }

        throw error;
      },
    });

    return response.body;
  }
}
