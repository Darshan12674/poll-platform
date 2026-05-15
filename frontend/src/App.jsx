import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import HomeRedirect from "./components/HomeRedirect";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/dashboard/Dashboard";

import CreatePoll from "./pages/polls/CreatePoll";
import PollAnalytics from "./pages/polls/PollAnalytics";

import PublicPoll from "./pages/public/PublicPoll";
import PublishedResults from "./pages/public/PublishedResults";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Polls */}
        <Route
          path="/create-poll"
          element={
            <ProtectedRoute>
              <CreatePoll />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/:pollId"
          element={
            <ProtectedRoute>
              <PollAnalytics />
            </ProtectedRoute>
          }
        />

        {/* Public */}
        <Route path="/poll/:pollId" element={<PublicPoll />} />
        <Route path="/results/:pollId" element={<PublishedResults />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
