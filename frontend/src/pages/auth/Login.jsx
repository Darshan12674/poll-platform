import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../../api/axios"

function Login() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const [loading, setLoading] = useState(false)

    const [error, setError] = useState("")

    // Handle Input Change 
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    // handle submit
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            setError("")

            const response = await api.post("/auth/login", formData)

            // Save token
            localStorage.setItem("token", response.data.data.token)
            localStorage.setItem("user", JSON.stringify(response.data.data.user))

            // Redirect
            navigate("/dashboard")
        } catch (error) {
            setError(
                error.response?.data?.message || "Login failed"
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-900/90 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/40 ring-1 ring-slate-700/60 backdrop-blur-xl">
                <div className="mb-8 text-center">
                    <p className="text-sm font-medium uppercase tracking-[0.32em] text-indigo-400/80">Welcome back</p>
                    <h1 className="mt-3 text-3xl font-semibold text-white">Login to your account</h1>
                    <p className="mt-2 text-sm text-slate-400">Enter your credentials to access the dashboard.</p>
                </div>

                {error && (
                    <div className="mb-5 rounded-2xl border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
                        <input
                            className="w-full rounded-3xl border border-slate-700/80 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
                        <input
                            className="w-full rounded-3xl border border-slate-700/80 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:scale-[1.01] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-indigo-300 transition hover:text-indigo-100">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login