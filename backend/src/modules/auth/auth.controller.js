import { registerUser, loginUser } from "./auth.service.js";

export const register = async (req, res) =>{
    try {
        const user = await registerUser(req.body)

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}

export const login = async (req, res) => {
    try {
        const result = await loginUser(req.body)

        res.status(200).json({
            success: true,
            message: "Longin successful",
            data: result
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}