import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const lastPollId = localStorage.getItem("lastPollId");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleAnalytics = () => {
    if (lastPollId) {
      navigate(`/analytics/${lastPollId}`);
    } else {
      alert("Create a poll first to view analytics.");
    }
  };

  const navClass = (path) =>
    `rounded-3xl px-4 py-2 text-sm font-medium transition ${
      location.pathname === path
        ? "bg-white/10 text-white"
        : "text-slate-300 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/95 px-6 py-4 shadow-lg backdrop-blur-xl">
      <div className="flex items-center gap-8">
        <h1
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer text-2xl font-semibold text-white"
        >
          Poll Dashboard
        </h1>

        <nav className="flex items-center gap-1">
          <button onClick={() => navigate("/dashboard")} className={navClass("/dashboard")}>
            Dashboard
          </button>
          <button onClick={() => navigate("/create-poll")} className={navClass("/create-poll")}>
            Create Poll
          </button>
          <button
            onClick={handleAnalytics}
            className={
              location.pathname.startsWith("/analytics")
                ? "rounded-3xl bg-white/10 px-4 py-2 text-sm font-medium text-white"
                : "rounded-3xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            }
          >
            Poll Analytics
          </button>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-slate-300">Welcome, {user?.name}</span>

        <button
          onClick={handleLogout}
          className="rounded-3xl bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:scale-[1.01] hover:brightness-110"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
