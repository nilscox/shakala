export interface ProfileImagePort {
  getProfileImageUrl(userId: string): Promise<string>;
}
