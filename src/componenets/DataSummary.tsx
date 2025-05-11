"use client";

import { useMemo } from "react";
import type { UserWithSubscription } from "../types";
import "../styles/DataSummary.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Bar,
  XAxis,
  YAxis,
  BarChart,
} from "recharts";

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00c49f"];
interface DataSummaryProps {
  users: UserWithSubscription[];
}

const DataSummary = ({ users }: DataSummaryProps) => {
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((user) => user.active === "1").length;
    const inactiveUsers = users.filter((user) => user.active !== "1").length;
    const usersWithSubscription = users.filter(
      (user) => user.subscription
    ).length;

    const packageCounts: Record<string, number> = {};
    users.forEach((user) => {
      if (user.subscription) {
        const pkg = user.subscription.package;
        packageCounts[pkg] = (packageCounts[pkg] || 0) + 1;
      }
    });

    const topPackages = Object.entries(packageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      totalUsers,
      inactiveUsers,
      activeUsers,
      usersWithSubscription,
      packageCounts,
      topPackages,
    };
  }, [users]);

  const data = stats.topPackages.map(([pkg, count]) => ({
    name: pkg,
    value: count,
  }));

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const activeCount = users.filter((user) => user.active === "1").length;
  const inactiveCount = users.filter((user) => user.active !== "1").length;

  const datas = [
    { name: "Active", count: activeCount },
    { name: "Inactive", count: inactiveCount },
  ] as any;

  return (
    <div className="data-summary">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Users</h3>
          <div className="summary-value">{stats.totalUsers}</div>
        </div>

        <div className="summary-card">
          <h3>Active Users</h3>
          <div className="summary-value">{stats.activeUsers}</div>
          <div className="summary-percentage">
            {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="summary-card">
          <h3>With Subscription</h3>
          <div className="summary-value">{stats.usersWithSubscription}</div>
          <div className="summary-percentage">
            {((stats.usersWithSubscription / stats.totalUsers) * 100).toFixed(
              1
            )}
            %
          </div>
        </div>
        <div className="summary-card">
          <h3>Inactive</h3>
          <div className="summary-value">{stats.inactiveUsers}</div>
          <div className="summary-percentage">
            {((stats.inactiveUsers / stats.totalUsers) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="package">
        <div className="package-distribution">
          <h1>Package Distribution</h1>

          <div className="package-chart">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="package-distribution">
          <h1>Active vs Inactive</h1>

          <div className="package-chart">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={datas}>
                <XAxis dataKey="name" />
                <YAxis dataKey="count" />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" barSize={40} fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSummary;
