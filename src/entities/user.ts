export type User = {
  id: string;
  name: string;
  password: string;
  avatar?: string;
  role: "ADMIN" | "USER" | "GUEST";
  enemies?: Partial<User>[];
  friends?: Partial<User>[];
  friendOf?: Partial<User>[];
  enemyOf?: Partial<User>[];
};

export type UserCreateDto = {
  name: string;
  email: string;
  password: string;
  avatar: string;
};

export type UserUpdateDto = Partial<UserCreateDto>;
