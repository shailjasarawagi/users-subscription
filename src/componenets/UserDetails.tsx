import type { UserWithSubscription } from "../types";
import { formatDate, formatTimestamp } from "../utils/formatters";
import "../styles/UserDetails.css";

interface UserDetailsProps {
  user: UserWithSubscription;
}

const formatUserJoinDate = (timestamp: string) => {
  try {
    return formatTimestamp(timestamp);
  } catch (error) {
    console.error("Error formatting join date:", error);
    return "Invalid date";
  }
};

const UserDetails = ({ user }: UserDetailsProps) => {
  return (
    <div className="user-details">
      <div className="user-details-header">
        <div className="user-details-avatar">
          <div className="avatar-placeholder large">
            {user.first_name.charAt(0)}
          </div>
        </div>
        <div className="user-details-title">
          <h2>
            {user.first_name} {user.last_name}
          </h2>
          <p className="user-email">{user.email}</p>
        </div>
      </div>

      <div className="user-details-section">
        <h3>User Information</h3>
        <div className="details-grid">
          <div className="details-item">
            <span className="details-label">Username</span>
            <span>{user.username}</span>
          </div>
          <div className="details-item">
            <span className="details-label">Status</span>
            <span
              className={`status-badge ${
                user.active === "1" ? "active" : "inactive"
              }`}
            >
              {user.active === "1" ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="details-item">
            <span className="details-label">Country</span>
            <span>{user.country}</span>
          </div>
          <div className="details-item">
            <span className="details-label">Joined</span>
            <span>{formatUserJoinDate(user.join_date)}</span>
          </div>
          <div className="details-item">
            <span className="details-label">Address</span>
            <span>{user.address}</span>
          </div>
        </div>
      </div>

      {user.subscription ? (
        <div className="user-details-section">
          <h3>Subscription Details</h3>
          <div className="details-grid">
            <div className="details-item">
              <span className="details-label">Plan</span>
              <span className="plan-badge">{user.subscription.package}</span>
            </div>
            <div className="details-item">
              <span className="details-label">Expires On</span>
              <span>{formatDate(user.subscription.expires_on)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="user-details-section">
          <h3>Subscription</h3>
          <p className="no-subscription">No active subscription</p>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
