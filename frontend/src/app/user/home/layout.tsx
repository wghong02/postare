import { Box } from "@chakra-ui/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "My Home",
	description: "User's homepage",
	icons: {
		icon: "/favicon.ico",
	},
};

const UserHomeLayout = ({ children }: { children: React.ReactNode }) => {
	return <Box >{children}</Box>;
};

export default UserHomeLayout;