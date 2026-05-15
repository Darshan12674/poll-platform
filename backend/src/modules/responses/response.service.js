import Response from "./response.model.js";
import Poll from "../polls/poll.model.js"
import { getIo } from "../../sockets/analytics.socket.js"

export const submitResponseService = async (
    pollId,
    answers,
    user
) => {
    // Find poll
    const poll = await Poll.findById(pollId)

    if (!poll) {
        throw new Error("Poll not found")
    }

    // Expiry check
    if (new Date() > poll.expiresAt) {
        throw new Error("Poll expired"
        )
    }

    // Check if answers are provided when there are questions
    if (poll.questions.length > 0 && (!answers || answers.length === 0)) {
        throw new Error("Answers are required for this poll")
    }

    // Required question validation
    for (const question of poll.questions) {
        if (question.required) {
            const answered = answers.find(
                (a) =>
                    a.questionId.toString() ===
                    question._id.toString()
            )

            if (!answered) {
                throw new Error(
                    `${question.question} is required`
                )
            }
        }
    }
    // Anonmous loic 
    let userId = null

    if (!poll.isAnonymous && user) {
        userId = user.id
    }

    // Save response 
    const response = await Response.create({
        pollId,
        userId,
        answer: answers,
    })

    // Emit live update
    const io = getIo()

    io.emit(`poll-${pollId}`, {
        message: "New response submitted"
    })

    return response

}

