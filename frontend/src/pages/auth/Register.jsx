import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import api from "../../api/axios"


function Register() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    })

    const [loading, setLoading] = useState(false)

    const [error, setError] = useState("")

    // Handle input Change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            setError("")

            await api.post("/auth/register", formData)

            const loginResponse = await api.post("/auth/login", {
                email: formData.email,
                password: formData.password,
            })

            localStorage.setItem("token", loginResponse.data.data.token)
            localStorage.setItem(
                "user",
                JSON.stringify(loginResponse.data.data.user)
            )

            navigate("/dashboard")
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed"
            )
        } finally {
            setLoading(false)
        }
    }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/40 ring-1 ring-slate-700/60 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.32em] text-fuchsia-400/80">Create your account</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Register for PulseBoard</h1>
          <p className="mt-2 text-sm text-slate-400">Join now and start tracking polls with a modern dashboard.</p>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Name</label>
            <input
              className="w-full rounded-3xl border border-slate-700/80 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
            <input
              className="w-full rounded-3xl border border-slate-700/80 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
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
              className="w-full rounded-3xl border border-slate-700/80 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
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
            className="flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-300 transition hover:text-indigo-100">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register