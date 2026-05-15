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

  const fetchAnalytics = async () => {
    try {
      const response = await api.get(`/analytics/${pollId}`);
      setAnalytics(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    socket.on(`poll-${pollId}`, () => {
      fetchAnalytics();
    });

    return () => {
      socket.off(`poll-${pollId}`);
    };
  }, [pollId]);

  const handlePublish = async () => {
    try {
      setPublishing(true);
      await api.patch(`/polls/${pollId}/publish`);
      alert("Results published successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to publish results");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading analytics...
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        No analytics found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Poll Analytics</h1>
            <p className="mt-1 text-sm text-slate-400">Live response insights</p>
          </div>

          <button
            onClick={handlePublish}
            disabled={publishing}
            className="rounded-3xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {publishing ? "Publishing..." : "Publish Results"}
          </button>
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
