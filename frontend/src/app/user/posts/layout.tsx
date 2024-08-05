import { Box } from "@chakra-ui/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "My Posts",
	description: "User's Post Page",
	icons: {
		icon: "/favicon.ico",
	},
};

const UserPostLayout = ({ children }: { children: React.ReactNode }) => {
	return children;
};

export default UserPostLayout;
