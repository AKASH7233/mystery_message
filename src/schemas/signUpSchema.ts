import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(3, "Username must be of atleast 2 characters")
    .max(12, "Username must've atmost 12 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")

export const signUpSchema = z.object({
   username : usernameValidation,
   email : z.string().email({message : 'Invalid email address'}),
   password : z.string().min(8,{message: 'password must contain atleast 8 character'})
})