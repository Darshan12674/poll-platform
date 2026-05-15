import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js"
import pollRoutes from "../modules/polls/poll.routes.js"
import responseRoutes from "../modules/responses/response.routes.js"
import analyticsRoutes from "../modules/analytics/analytics.routes.js"

import { protect } from "../common/middleware/auth.middleware.js";

const router = Router()

router.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Server healthy"
    })
})

router.get("/profile", protect, (req, res) => {
    res.json({ 
        success: true,
        message: "Protected route accessed",
        user: req.user,
    })
})

router.use("/auth", authRoutes)
router.use("/polls", pollRoutes)
router.use("/responses", responseRoutes)
router.use("/analytics", analyticsRoutes)

export default router