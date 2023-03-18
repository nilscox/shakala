export type ThreadDto = {
  id: string;
  author: {
    nick: string;
    profileImage: string;
  };
  text: string;
};
