import {z} from 'zod'

export const MessageSchema = z.object({
  content : z
  .string()
  .min(2, {message : 'Content must be of atleast 10 characters'})
  .max(300,{message : 'Content must be of atmost 300 characters'} )
})