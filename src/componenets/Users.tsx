"use client";

import { useState, useMemo, useCallback } from "react";
import type {
  User,
  Subscription,
  SortField,
  SortDirection,
  FilterOptions,
} from "../types";
import UserList from "./UserList";
import UserDetails from "./UserDetails";
import FilterBar from "./FilterBar";
import "../styles/Dashboard.css";
import { Delete } from "lucide-react";

interface DashboardProps {
  users: User[];
  subscriptions: Subscription[];
}

const Dashboard = ({ users, subscriptions }: DashboardProps) => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);

  const usersWithSubscriptions = useMemo(() => {
    return users.map((user) => {
      const subscription = subscriptions.find(
        (sub) => sub.user_id === user.id.toString()
      );
      return { ...user, subscription };
    });
  }, [users, subscriptions]);

  const filteredUsers = useMemo(() => {
    return usersWithSubscriptions.filter((user) => {
      if (filters.status && user.active !== filters.status) {
        return false;
      }

      if (
        filters.package &&
        (!user.subscription || user.subscription.package !== filters.package)
      ) {
        return false;
      }

      if (filters.country && user.country !== filters.country) {
        return false;
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        return (
          fullName.includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        );
      }

      return true;
    });
  }, [usersWithSubscriptions, filters]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      let valueA, valueB;

      switch (sortField) {
        case "name":
          valueA = `${a.first_name} ${a.last_name}`;
          valueB = `${b.first_name} ${b.last_name}`;
          break;
        case "join_date":
          valueA = Number.parseInt(a.join_date);
          valueB = Number.parseInt(b.join_date);
          break;
        case "active":
          valueA = a.active;
          valueB = b.active;
          break;
        case "package":
          valueA = a.subscription?.package || "";
          valueB = b.subscription?.package || "";
          break;
        case "expires_on":
          valueA = a.subscription?.expires_on || "";
          valueB = b.subscription?.expires_on || "";
          break;
        default:
          valueA = `${a.first_name} ${a.last_name}`;
          valueB = `${b.first_name} ${b.last_name}`;
      }

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }, [filteredUsers, sortField, sortDirection]);

  const selectedUser = useMemo(() => {
    return usersWithSubscriptions.find((user) => user.id === selectedUserId);
  }, [usersWithSubscriptions, selectedUserId]);

  const handleSort = useCallback(
    (field: SortField) => {
      if (field === sortField) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField, sortDirection]
  );

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  const handleUserSelect = useCallback((userId: number) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>User Subscription </h1>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-main">
          <FilterBar
            users={usersWithSubscriptions}
            onFilterChange={handleFilterChange}
          />

          <UserList
            users={sortedUsers}
            onUserSelect={handleUserSelect}
            selectedUserId={selectedUserId}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
          />
        </div>

        <div className="dashboard-sidebar">
          {isModalOpen && selectedUser && (
            <div className="modal-overlay" onClick={closeModal}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <Delete
                  size={38}
                  className="close-button"
                  onClick={closeModal}
                />
                <UserDetails user={selectedUser} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
