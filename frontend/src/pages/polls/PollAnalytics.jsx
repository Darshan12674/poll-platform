import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { io } from "socket.io-client";

import api from "../../api/axios";
import Navbar from "../../components/Navbar";

const socket = io("http://localhost:4000");

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#f97316",
];

function PollAnalytics() {
  const { pollId } = useParams();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState("");

  const pollShareUrl = `${window.location.origin}/poll/${pollId}`;
  const resultsShareUrl = `${window.location.origin}/results/${pollId}`;

  const fetchAnalytics = async () => {
    try {
      const response = await api.get(`/analytics/${pollId}`);
      setAnalytics(response.data.data);
      setIsPublished(Boolean(response.data.data?.isPublished));
    } catch (error) {
      console.error(error);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pollId) {
      localStorage.setItem("lastPollId", pollId);
    }

    fetchAnalytics();

    socket.on(`poll-${pollId}`, () => {
      fetchAnalytics();
    });

    return () => {
      socket.off(`poll-${pollId}`);
    };
  }, [pollId]);

  const copyToClipboard = async (url, label) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyFeedback(`${label} copied!`);
      setTimeout(() => setCopyFeedback(""), 2000);
    } catch {
      setCopyFeedback("Could not copy link");
      setTimeout(() => setCopyFeedback(""), 2000);
    }
  };

  const handlePublish = async () => {
    try {
      setPublishing(true);
      const response = await api.patch(`/polls/${pollId}/publish`);
      setIsPublished(Boolean(response.data.data?.isPublished));
      setCopyFeedback("Results published! Share the results link below.");
      setTimeout(() => setCopyFeedback(""), 3000);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to publish results");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <Navbar />
        <div className="flex items-center justify-center py-32 text-white">
          Loading analytics...
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <Navbar />
        <div className="flex items-center justify-center py-32 text-white">
          No analytics found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <Navbar />
      <div className="mx-auto max-w-4xl space-y-8 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white">Poll Analytics</h1>
            <p className="mt-1 text-sm text-slate-400">Live response insights</p>
          </div>

          <button
            onClick={handlePublish}
            disabled={publishing || isPublished}
            className="rounded-3xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPublished
              ? "Results Published"
              : publishing
                ? "Publishing..."
                : "Publish Results"}
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/95 p-6">
          <h2 className="text-lg font-medium text-white">Share this poll</h2>
          <p className="mt-1 text-sm text-slate-400">
            Anyone with this link can vote (no login required).
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              readOnly
              value={pollShareUrl}
              className="flex-1 rounded-2xl border border-slate-700/80 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 outline-none"
            />
            <button
              type="button"
              onClick={() => copyToClipboard(pollShareUrl, "Poll link")}
              className="rounded-3xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Copy poll link
            </button>
          </div>

          {isPublished && (
            <div className="mt-6 border-t border-white/10 pt-6">
              <h3 className="text-sm font-medium text-white">Published results link</h3>
              <p className="mt-1 text-sm text-slate-400">
                Share this link so others can view the published results.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="text"
                  readOnly
                  value={resultsShareUrl}
                  className="flex-1 rounded-2xl border border-slate-700/80 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(resultsShareUrl, "Results link")}
                  className="rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Copy results link
                </button>
              </div>
            </div>
          )}

          {copyFeedback && (
            <p className="mt-3 text-sm text-indigo-300">{copyFeedback}</p>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/95 p-6">
          <h2 className="text-lg font-medium text-slate-300">Total Responses</h2>
          <p className="mt-2 text-4xl font-bold text-white">
            {analytics.totalResponses}
          </p>
        </div>

        <div className="space-y-8">
          {analytics.questions.map((question, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-slate-950/95 p-6"
            >
              <h2 className="mb-4 text-xl font-semibold text-white">
                {question.question}
              </h2>

              <div className="mb-6 space-y-2">
                {question.options.map((option, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-sm text-slate-300"
                  >
                    <span>{option.option}</span>
                    <span className="font-semibold text-indigo-300">
                      {option.count}
                    </span>
                  </div>
                ))}
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={question.options}
                      dataKey="count"
                      nameKey="option"
                      outerRadius={100}
                      label
                    >
                      {question.options.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PollAnalytics;
