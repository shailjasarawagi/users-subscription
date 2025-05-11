"use client";

import { useMemo } from "react";
import DataSummary from "../componenets/DataSummary";

interface DashboardPageProps {
  users: any[];
  subscriptions: any[];
}

const DashboardPage = ({ users, subscriptions }: DashboardPageProps) => {
  const usersWithSubscriptions = useMemo(() => {
    return users.map((user) => {
      const subscription = subscriptions.find(
        (sub) => sub.user_id === user.id.toString()
      );
      return { ...user, subscription };
    });
  }, [users, subscriptions]);
  return <DataSummary users={usersWithSubscriptions} />;
};

export default DashboardPage;
