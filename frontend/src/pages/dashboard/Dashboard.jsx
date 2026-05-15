import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";

function Dashboard() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
            <Navbar />

            <div className="mx-auto max-w-4xl px-6 py-10">
                <div className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/40 ring-1 ring-slate-700/60 backdrop-blur-xl">
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-semibold text-white">
                            Welcome to Dashboard
                        </h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Create and manage your polls.
                        </p>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => navigate("/create-poll")}
                            className="rounded-3xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:scale-[1.01] hover:brightness-110"
                        >
                            Create Poll
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
