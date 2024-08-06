import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Update History",
	description: "App's Update history",
};

const UserLikeLayout = ({ children }: { children: React.ReactNode }) => {
	return children;
};

export default UserLikeLayout;
