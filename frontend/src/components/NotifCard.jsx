import React from "react";

const NotifCard = ({ notification }) => {
  const { message, created_at, status } = notification;

  const formattedDate = new Date(created_at).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div
      className={`p-3 mb-3 rounded shadow-sm ${
        status === "unread" ? "bg-light border-start border-4 border-danger" : "bg-white"
      }`}
      style={{ borderLeftWidth: "5px" }}
    >
      <div className="fw-semibold" style={{ fontSize: "1rem" }}>
        {message}
      </div>
      <div className="text-muted" style={{ fontSize: "0.85rem" }}>
        {formattedDate}
      </div>
    </div>
  );
};

export default NotifCard;