export class RegisterDto {
  fullName: string;
  email: string;
  password: string;
}
export class RegisterResponseDto {
    id: string;
    fullName: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    token: string;
    refreshToken: string;
    expiresIn: number;
}