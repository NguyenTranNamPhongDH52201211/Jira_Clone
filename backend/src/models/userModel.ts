import pool from '../config/database';
import {User} from '../types/index';

export class UserModel{

    static async findByEmail(email:string): Promise<User | null> {
        const result= await pool.query(`SELECT * FROM users WHERE user_email= $1`, [email]);
        return  result.rows[0] || null;
    }

    static async findById(id:number): Promise<User | null>{
        const result=await pool.query(`SELECT * FROM users WHERE user_id= $1`,[id]);
        return result.rows[0] || null;
    }

    static async create(email:string , password:string, name:string): Promise<User>{
        const result= await pool.query(`INSERT INTO users (user_email, user_password_hash, user_name) VALUES($1, $2, $3) RETURNING *`,[email,password,name]);
        return result.rows[0];
    }

    static async update(id:number, data: Partial<User>): Promise<User |null>{
        
        return null;
    }

}