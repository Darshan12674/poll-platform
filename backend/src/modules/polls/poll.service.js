import Poll from "./poll.model.js";

export const createPollService = async (data, userId) => {
    const poll = await Poll.create({
        ...data,
        createdBy: userId,
    })

    return poll
}

export const getPollService = async (pollId) => {
    const poll = await Poll.findById(pollId)

    if(!poll) {
        throw new Error("Poll not foun")
    }

    // Expiry Check
    if(new Date() > poll.expiresAt) {
        throw new Error("Poll expired")
    }

    return poll
}

export const publishPollResultsService = async (
    pollId,
    userId
) => {
    const poll = await Poll.findById(pollId)

    if(!poll) {
        throw new Error ("Poll not found")
    }

    // Ownership check
    if(poll.createdBy.toString() !== userId) {
        throw new Error("Unauthorized")
    }

    poll.isPublished = true

    await poll.save()

    return poll
}
