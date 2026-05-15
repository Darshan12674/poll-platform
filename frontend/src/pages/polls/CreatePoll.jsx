import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import Navbar from "../../components/Navbar";

function CreatePoll() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    expiresAt: "",
    isAnonymous: true,
    questions: [
      {
        question: "",
        required: false,
        options: ["", ""],
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][field] = value;

    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].options[oIndex] = value;

    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          question: "",
          required: false,
          options: ["", ""],
        },
      ],
    });
  };

  const removeQuestion = (index) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index),
    });
  };

  const addOption = (qIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].options.push("");

    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };

  const removeOption = (qIndex, oIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter(
      (_, i) => i !== oIndex
    );

    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/polls", formData);

      alert("Poll created successfully");

      const pollId = response.data.data._id;
      localStorage.setItem("lastPollId", pollId);
      navigate(`/analytics/${pollId}`);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create poll");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <Navbar />
      <div className="mx-auto max-w-3xl p-6">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-2xl ring-1 ring-slate-700/60">
        <h1 className="mb-8 text-3xl font-semibold text-white">Create Poll</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Poll Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-3xl border border-slate-700/80 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-3xl border border-slate-700/80 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Expiry Date
            </label>
            <input
              type="datetime-local"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
              required
              className="w-full rounded-3xl border border-slate-700/80 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
            />
            <label className="text-sm text-slate-200">
              Allow Anonymous Responses
            </label>
          </div>

          <div className="space-y-6">
            {formData.questions.map((question, qIndex) => (
              <div
                key={qIndex}
                className="rounded-2xl border border-slate-700/80 p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">
                    Question {qIndex + 1}
                  </h2>

                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-sm text-rose-400 hover:text-rose-300"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Enter question"
                  value={question.question}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "question", e.target.value)
                  }
                  required
                  className="mb-4 w-full rounded-3xl border border-slate-700/80 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                />

                <div className="mb-4 flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={question.required}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "required", e.target.checked)
                    }
                  />
                  <label className="text-sm text-slate-200">
                    Required Question
                  </label>
                </div>

                <div className="space-y-3">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`Option ${oIndex + 1}`}
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(qIndex, oIndex, e.target.value)
                        }
                        required
                        className="flex-1 rounded-3xl border border-slate-700/80 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                      />
                      {question.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(qIndex, oIndex)}
                          className="rounded-3xl px-3 text-rose-400 hover:bg-rose-500/10"
                        >
                          X
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addOption(qIndex)}
                  className="mt-3 text-sm text-indigo-300 hover:text-indigo-100"
                >
                  Add Option
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addQuestion}
            className="text-sm font-medium text-indigo-300 hover:text-indigo-100"
          >
            Add Question
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Poll"}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}

export default CreatePoll;
