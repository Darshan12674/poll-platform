import { getPublishedResultsService, getPollAnalyticsService } from "./analytics.service.js";

export const getPublishedResults = async (req, res) => {
    try {
        const results = await getPublishedResultsService(req.params.pollId)

        res.status(200).json({
            success: true,
            data: results,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    } 
}

export const getPollAnalytics = async (req, res) => {
    try {
        const analytics = await getPollAnalyticsService(req.params.pollId, req.user)

        res.status(200).json({
            success: true,
            data: analytics,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}