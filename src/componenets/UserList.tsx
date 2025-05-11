"use client";

import type React from "react";

import { useRef, useCallback, useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import type { UserWithSubscription, SortField, SortDirection } from "../types";
import { formatDate, formatTimestamp } from "../utils/formatters";
import "../styles/UserList.css";

interface UserListProps {
  users: UserWithSubscription[];
  onUserSelect: (userId: number) => void;
  selectedUserId: number | null;
  onSort: (field: SortField) => void;
  sortField: SortField;
  sortDirection: SortDirection;
}

const UserList = ({
  users,
  onUserSelect,
  selectedUserId,
  onSort,
  sortField,
  sortDirection,
}: UserListProps) => {
  const listRef = useRef<List>(null);
  const [listHeight, setListHeight] = useState(500);
  const [listWidth, setListWidth] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setListWidth(containerRef.current.offsetWidth);
        const availableHeight = window.innerHeight - 300; // Adjust based on your layout
        setListHeight(Math.max(300, Math.min(600, availableHeight)));
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (selectedUserId && listRef.current) {
      const index = users.findIndex((user) => user.id === selectedUserId);
      if (index !== -1) {
        listRef.current.scrollToItem(index, "smart");
      }
    }
  }, [selectedUserId, users]);

  const getSortIndicator = (field: SortField) => {
    if (field !== sortField) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const formatUserJoinDate = useCallback((timestamp: string) => {
    try {
      return formatTimestamp(timestamp);
    } catch (error) {
      console.error("Error formatting join date:", error);
      return "Invalid date";
    }
  }, []);

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const user = users[index];
      return (
        <div
          style={style}
          className={`user-row ${selectedUserId === user.id ? "selected" : ""}`}
          onClick={() => onUserSelect(user.id)}
        >
          <div className="user-cell user-info">
            <div className="user-avatar">
              <div className="avatar-placeholder">
                {user.first_name.charAt(0)}
              </div>
            </div>
            <div className="user-name-email">
              <div className="user-name">
                {user.first_name} {user.last_name}
              </div>
              {/* <div className="user-email">{user.email}</div> */}
            </div>
          </div>
          <div className="user-cell">{formatTimestamp(user.join_date)}</div>
          <div className="user-cell">
            <span
              className={`status-badge ${
                user.active === "1" ? "active" : "inactive"
              }`}
            >
              {user.active === "1" ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="user-cell">
            {user.subscription ? (
              <span
                className="plan-badge"
                style={{
                  backgroundColor:
                    user.subscription.package === "Plan 1"
                      ? "green"
                      : user.subscription.package === "Plan 2"
                      ? "silver"
                      : user.subscription.package === "Plan3"
                      ? "blue"
                      : "gold",
                  color: "#fff",
                }}
              >
                {user.subscription.package}
              </span>
            ) : (
              <span className="no-plan">No plan</span>
            )}
          </div>
          <div className="user-cell">
            {user.subscription ? formatDate(user.subscription.expires_on) : "-"}
          </div>
        </div>
      );
    },
    [users, selectedUserId, onUserSelect, formatUserJoinDate]
  );

  return (
    <div className="user-list" ref={containerRef}>
      <h2>Subscribers ({users.length})</h2>

      <div className="user-table">
        <div className="user-table-header">
          <div
            className={`header-cell ${
              sortField === "name" ? "active-sort" : ""
            }`}
            onClick={() => onSort("name")}
          >
            Name {getSortIndicator("name")}
          </div>
          <div
            className={`header-cell ${
              sortField === "join_date" ? "active-sort" : ""
            }`}
            onClick={() => onSort("join_date")}
          >
            Joined {getSortIndicator("join_date")}
          </div>
          <div
            className={`header-cell ${
              sortField === "active" ? "active-sort" : ""
            }`}
            onClick={() => onSort("active")}
          >
            Status {getSortIndicator("active")}
          </div>
          <div
            className={`header-cell ${
              sortField === "package" ? "active-sort" : ""
            }`}
            onClick={() => onSort("package")}
          >
            Plan {getSortIndicator("package")}
          </div>
          <div
            className={`header-cell ${
              sortField === "expires_on" ? "active-sort" : ""
            }`}
            onClick={() => onSort("expires_on")}
          >
            Expires On {getSortIndicator("expires_on")}
          </div>
        </div>

        <div className="user-table-body">
          {users.length > 0 ? (
            <List
              ref={listRef}
              height={listHeight}
              width={listWidth}
              itemCount={users.length}
              itemSize={60}
              overscanCount={5}
            >
              {Row}
            </List>
          ) : (
            <div className="no-results">No users match the current filters</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
