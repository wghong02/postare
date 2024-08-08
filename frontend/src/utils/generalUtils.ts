import Filter from "bad-words";

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

export function formatCounts(
	totalPosts: number,
	totalLikes: number,
	totalViews: number
) {
	// helper function with formatting the number of counts shown
	const formatCount = (count: number, label: string) =>
		`${count} ${label}${count !== 1 ? "s" : ""}`;

	const formattedPosts = formatCount(totalPosts, "post");
	const formattedLikes = formatCount(totalLikes, "like");
	const formattedViews = formatCount(totalViews, "view");

	return `${formattedPosts}, ${formattedLikes}, ${formattedViews}`;
}

const filter = new Filter();

export const isValidUsername = (username: string): boolean => {
	// Normalize the username by converting to lowercase and replacing special characters
	const isValid = /^[a-zA-Z0-9_-]+$/.test(username);

	if (!isValid) {
		return false;
	}

	// Normalize the username by converting to lowercase
	const normalizedUsername = username.toLowerCase();

	// Check for profanity in the normalized username
	return !filter.isProfane(normalizedUsername);
};

export const isCleanComment = (comment: string): boolean => {
	// Normalize the comment by converting to lowercase
	if (!comment) return true;
	const normalizedComment = comment.toLowerCase();

	// Check for profanity in the normalized comment
	return !filter.isProfane(normalizedComment);
};

export const isValidEmail = (email: string): boolean => {
	// Define the regex pattern for validating email addresses
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
	// Regex to check for at least one letter and one number
	//const hasLetterAndNumber = /^(?=.*[A-Za-z])(?=.*\d)/;

	// Check if the password is at least 8 characters long
	return password.length >= 8; //&& hasLetterAndNumber.test(password);
};

export const isValidNickname = (username: string): boolean => {
	// Allow letters, numbers, underscores, hyphens, and spaces
	const isValid = /^[a-zA-Z0-9 _-]+$/.test(username);

	if (!isValid) {
		return false;
	}

	// Normalize the username by converting to lowercase
	const normalizedUsername = username.toLowerCase();

	// Check for profanity in the normalized username
	return !filter.isProfane(normalizedUsername);
};
