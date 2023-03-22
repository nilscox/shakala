export interface ProfileImagePort {
  getProfileImageUrl(email: string): Promise<string>;
}
