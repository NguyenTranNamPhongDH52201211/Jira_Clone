export interface User{
    user_id:number;
    user_email: string;
    user_password_hash: string;
    user_name:string;
    user_avatar_url:string | null;
    user_created_at: Date;
}

export interface UserResponse{
    user_id:number;
    user_email:string;
    user_name :string;
    user_avatar_url:string | null;
    user_created_at:Date;
}

export interface RegisterRequest{
    email:string;
    password:string;
    name:string;
}

export interface LoginResquest{
    email:string;
    password:string;
}

export interface JWTPayload{
   userId: number;
   email:string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}