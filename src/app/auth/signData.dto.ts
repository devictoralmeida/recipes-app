export interface SignUpDataDTO {
  email: string;
  password: string;
  returnSecureToken?: boolean;
}

export interface SignInDataDTO {
  email: string;
  password: string;
  returnSecureToken?: boolean;
}
