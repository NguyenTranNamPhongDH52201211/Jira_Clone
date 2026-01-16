import {UserModel} from '../models/userModel';
import { AuthUtils } from '../utils/authUtils';
import { RegisterRequest, LoginResquest, UserResponse,  User} from '../types';

export class AuthServices{
    static async register(data: RegisterRequest): Promise<{user: UserResponse; token:string}> {
        const {email, password, name}= data;

        const existingUser= await UserModel.findByEmail(email);
        if(existingUser){
            throw new Error('Email already registered');
        }

        const hashPassword=await AuthUtils.hashPassword(password);

        const user= await UserModel.create(email,hashPassword,name);

        const token =AuthUtils.generateToken({
            userId:user.user_id,
            email:user.user_email
        });

        const userResponse= this.sanitizeUser(user);
        return {user: userResponse, token};
    }

    static async login(data: LoginResquest): Promise<{user: UserResponse; token: string}>{
         
        const {email, password}= data;

        const user =await UserModel.findByEmail(email);

        if(!user){
            throw new Error ('Invalid cendentials');
        }

        const isValidPassword= await AuthUtils.comparePassword(password,user.user_password_hash);
        if(!isValidPassword){
            throw new Error('Invalid cendentials');
        }

        const token =AuthUtils.generateToken({
            userId:user.user_id,
            email:user.user_email
        })

        const userResponse= this.sanitizeUser(user);

        return {user:userResponse, token};
    }

    static async getUserById(userId: number): Promise<UserResponse>{
        const user =await UserModel.findById(userId);

        if(!user){
            throw new Error('User not found');
        }

        return this.sanitizeUser(user);
    }

    private static sanitizeUser(user: User): UserResponse {
    return {
      user_id: user.user_id,
      user_email: user.user_email,
      user_name: user.user_name,
      user_avatar_url: user.user_avatar_url,
      user_created_at: user.user_created_at
    };
  }
}