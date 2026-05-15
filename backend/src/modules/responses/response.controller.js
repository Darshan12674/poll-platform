import { submitResponseService } from "./response.service.js";

export const submitResponse = async (req, res) => {
    try {
        const response = await submitResponseService(
            req.params.pollId,
            req.body.answers,
            req.user
        )

        res.status(201).json({
            success: true,
            message: "Response submitted successfully",
            data: response,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}