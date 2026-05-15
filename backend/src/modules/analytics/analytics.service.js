import Poll from "../polls/poll.model.js"
import Response from "../responses/response.model.js"

export const getPublishedResultsService = async (pollId) => {

    const poll = await Poll.findById(pollId)

    if(!poll) {
        throw new Error("Poll not found")
    }

    // Only publish results allowed
    if(!poll.isPublished) {
        throw new Error("Results are not published yet")
    }

    const responses = await Response.find({
        pollId,
    })

    const analytics = {
        title: poll.title,
        totalResponses: responses.length,
        questions: [],
    }

    for (const question of poll.questions) {
        const optionCounts = {}

        for (const option of question.options) {
            optionCounts[option] = 0
        }

        for (const response of responses) {
            const answer = response.answer.find(
                (a) => a.questionId.toString() === question._id.toString()
            )

            if(answer) {
                optionCounts[answer.selectedOption]++
            }
        }

        analytics.questions.push({
            question: question.question,
            options: Object.entries(optionCounts).map(
                ([option, count]) => ({
                    option,
                    count
                })
            ),
        })
    }

    return analytics
}

export const getPollAnalyticsService = async (pollId, user) => {
    const poll = await Poll.findById(pollId)
    if(!poll) {
        throw new Error("Poll not found")
    }

    if(!user || poll.createdBy.toString() !== user.id) {
        throw new Error("Unauthorized")
    }

    const responses = await Response.find({
        pollId,
    })

    const analytics = {
        title: poll.title,
        totalResponses: responses.length,
        questions: [],
    }

    for (const question of poll.questions) {
    const optionCounts = {};

    for (const option of question.options) {
      optionCounts[option] = 0;
    }

    for (const response of responses) {
      const answer = response.answer.find(
        (a) => a.questionId.toString() === question._id.toString()
      );

      if (answer) {
        optionCounts[answer.selectedOption] =
          (optionCounts[answer.selectedOption] ?? 0) + 1;
      }
    }

    analytics.questions.push({
      question: question.question,
      options: Object.entries(optionCounts).map(([option, count]) => ({
        option,
        count,
      })),
    });
  }

  return analytics;
};

