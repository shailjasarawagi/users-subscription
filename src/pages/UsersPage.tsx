"use client";

import Dashboard from "../componenets/Users";

interface UsersPageProps {
  users: any[];
  subscriptions: any[];
}

const UsersPage = ({ users, subscriptions }: UsersPageProps) => {
  return <Dashboard users={users} subscriptions={subscriptions} />;
};

export default UsersPage;
