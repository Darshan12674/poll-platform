import { Router } from "express";

import { protect } from "../../common/middleware/auth.middleware.js";

import { getPublishedResults, getPollAnalytics } from "./analytics.controller.js";

const router = Router()

router.get("/:pollId", protect, getPollAnalytics)

router.get("/public/:pollId", getPublishedResults)


export default router

