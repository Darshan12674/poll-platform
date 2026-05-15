import {
    createPollService,
    getPollService,
    publishPollResultsService
} from "./poll.service.js"


export const createPoll = async (req, res) => {
    try {
        const poll = await createPollService(
            req.body,
            req.user.id
        )
        res.status(201).json({
            success: true,
            message: "Poll created successfully",
            data: poll
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}

export const getPoll = async (req, res) => {
    try {
        const poll = await getPollService(req.params.id)

        res.status(200).json({
            success: true,
            data: poll,
        })
    }catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        })
    }
}

export const publishPollResults = async (req,  res) => {
    try {
        const poll = await publishPollResultsService(
            req.params.id,
            req.user.id
        )

        res.status(200).json({
            success: true,
            message: "Results published successfully",
            data: poll,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}