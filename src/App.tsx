"use client";

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./componenets/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";

import "./styles/global.css";
import LoadingSpinner from "./componenets/LoadingSpinner";
import ErrorMessage from "./componenets/ErrorMessage";

function App() {
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const usersResponse = await fetch("/users.json");
        const subscriptionsResponse = await fetch("/subscriptions.json");

        if (!usersResponse.ok || !subscriptionsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const usersData = await usersResponse.json();
        const subscriptionsData = await subscriptionsResponse.json();

        setUsers(usersData);
        setSubscriptions(subscriptionsData);
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route
              path="/dashboard"
              element={
                <DashboardPage users={users} subscriptions={subscriptions} />
              }
            />
            <Route
              path="/users"
              element={
                <UsersPage users={users} subscriptions={subscriptions} />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
