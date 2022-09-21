export interface UserGateway {
  changeProfileImage(image: File): Promise<string>;
}
