import { useState, useEffect } from "react";

export const timeAgo = (dateString: string) => {
  // use js Date to transform it to date
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);
  const months = Math.round(days / 30);
  const years = Math.round(days / 365);

  // only keep the highest unit
  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
};

export const isPostedWithin = (dateString: string, timeframe: string) => {
  // check if the time is posted within given timeframe from now
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  switch (timeframe) {
    case "hour":
      return diff < 3600000; // 3600000 milliseconds in an hour
    case "day":
      return diff < 86400000; // 86400000 milliseconds in a day
    case "week":
      return diff < 604800000; // 604800000 milliseconds in a week
    case "month":
      return diff < 2592000000; // Approximately 30 days in milliseconds
    case "year":
      return diff < 31536000000; // Approximately 365 days in milliseconds
    default:
      return false;
  }
};
