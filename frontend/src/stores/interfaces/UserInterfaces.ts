export interface Profile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  avatar: string | null;
  phone: string | null;
}

export interface LoginResponse {
  readonly userId: string;
  readonly accessToken: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
}
