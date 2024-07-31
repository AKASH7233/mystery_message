import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User"
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request : Request){
    await dbConnect()

    try {
        const {username,email,password} = await request.json()

        const exitstingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(exitstingUserVerifiedByUsername){
            return Response.json(
                {
                success: false,
                message : 'Username already exists'
            },{
                status: 400
            }
            )
        }

        const existingUserByEmail = await UserModel.findOne({email})

        const verifyCode = Math.floor(10000 + Math.random() * 90000).toString()

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                    success: false,
                    message : 'Email already exists'
                },{
                    status: 400
                }
                )
            }else{
                const hashedPassword = await bcrypt.hash(password,10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }else{
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setDate(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password : hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage : true,
                messages : []
            })
            await newUser.save()
        }

        //Send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(emailResponse.success){
            return Response.json(
                {
                success: true,
                message : emailResponse.message
            },{
                status: 201
            }
            )
        }

        return Response.json(
            {
            success: true,
            message : 'User Registered SuccessFully.Please Verify your email'
        },{
            status: 500
        }
        )

    } catch (error) {
        console.log('Error registering user: ',error);
        return Response.json(
            {
            success: false,
            message : 'Error registering user'
        },{
            status: 500
        }
    )
    }
}