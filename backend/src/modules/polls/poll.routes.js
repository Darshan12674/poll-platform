import { Router } from "express";

import {
    createPoll,
    getPoll,
    publishPollResults
} from "./poll.controller.js"

import { protect } from "../../common/middleware/auth.middleware.js"

const router = Router()

// Protected
router.post("/", protect, createPoll)

// Public
router.get("/:id", getPoll)

router.patch("/:id/publish", protect, publishPollResults)

export default router