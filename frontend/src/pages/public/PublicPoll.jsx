import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../api/axios";

function PublicPoll() {
  const { pollId } = useParams();

  const [poll, setPoll] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchPoll = async () => {
    try {
      const response = await api.get(`/polls/${pollId}`);
      setPoll(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load poll");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();
  }, [pollId]);

  const handleSelect = (questionId, selectedOption) => {
    setAnswers({
      ...answers,
      [questionId]: selectedOption,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const question of poll.questions) {
      if (question.required && !answers[question._id]) {
        alert(`${question.question} is required`);
        return;
      }
    }

    try {
      setSubmitting(true);

      const formattedAnswers = Object.entries(answers).map(
        ([questionId, selectedOption]) => ({
          questionId,
          selectedOption,
        })
      );

      await api.post(`/responses/${pollId}`, {
        answers: formattedAnswers,
      });

      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit response");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="flex min-h-screen items-center justify-center text-red-500">{error}</div>;
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-2xl bg-white p-8 text-center shadow">
          <h1 className="mb-4 text-3xl font-bold text-green-600">Thank You!</h1>
          <p>Your response has been submitted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <div className="mb-8">
          <h1 className="mb-3 text-4xl font-bold">{poll.title}</h1>
          <p className="text-gray-600">{poll.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {poll.questions.map((question, index) => (
            <div key={question._id} className="rounded-xl border p-6">
              <h2 className="mb-4 text-xl font-semibold">
                {index + 1}. {question.question}
              </h2>

              {question.required && (
                <p className="mb-3 text-sm text-red-500">* Required</p>
              )}

              <div className="space-y-3">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name={question._id}
                      value={option}
                      checked={answers[question._id] === option}
                      onChange={() => handleSelect(question._id, option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-blue-600 py-4 text-lg text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Response"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PublicPoll;
