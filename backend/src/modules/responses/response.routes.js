import { Router } from "express";

import { submitResponse } from "./response.controller.js";

import { protect } from "../../common/middleware/auth.middleware.js"

const router = Router()

// Public response submit
router.post("/:pollId", submitResponse)

// Optional authenticated response 
router.post(
    "/auth/:pollId",
    protect,
    submitResponse
)

export default router