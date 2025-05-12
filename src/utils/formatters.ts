export const formatDate = (dateString: string | number): string => {
  try {
    let date;
    if (typeof dateString === "number") {
      date = new Date(dateString * 1000);
    } else {
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) {
      return `Invalid date: ${dateString}`;
    }
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

export const formatTimestamp = (timestamp: string): string => {
  try {
    const timestampNum = Number(timestamp);
    if (isNaN(timestampNum)) {
      return "Invalid date";
    }

    const date = new Date(timestampNum * 1000);

    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch (error) {
    console.error(
      "Error formatting timestamp:",
      error,
      "Timestamp:",
      timestamp
    );
    return "Invalid date";
  }
};
