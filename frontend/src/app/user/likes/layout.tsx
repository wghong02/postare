import { Box } from "@chakra-ui/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "My Likes",
	description: "User's Liked Posts",
	icons: {
		icon: "/favicon.ico",
	},
};

const UserLikeLayout = ({ children }: { children: React.ReactNode }) => {
	return <Box>{children}</Box>;
};

export default UserLikeLayout;
