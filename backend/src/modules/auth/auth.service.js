import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

import User from "./auth.models.js";

export const registerUser = async (data) => {
    const {name, email, password} = data

    //Check existing User
    const existingUser = await User.findOne({ email })

    if(existingUser) {
        throw new Error("User already exists")
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    })

    return user
}


export const loginUser = async (data) => {
    const { email, password } = data

    // Find user
    const user = await User.findOne({ email })

    if(!user) {
        throw new Error("Invalid creadentials")
    }

    //Compare password
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error("Invalid creadentials")
    }

    // Generate jwt
    const token = jwt.sign(
        {
            id: user._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    )

    return {
        user,
        token,
    }
}