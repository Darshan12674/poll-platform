import jwt from "jsonwebtoken"

export const protect = async (req, res, next) => {
    try {
        let token 

        // Get token from headers
        const authHeaders = req.headers.authorization

        if(authHeaders && authHeaders.startsWith("Bearer ")){
            token = authHeaders.split(" ")[1]
        }

        // No token
        if(!token){
        return res.status(401).json({
            success: false,
            message: "Not authorized, no token",
        })
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Save user data in request
    req.user = decoded

    next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        })
    }
}