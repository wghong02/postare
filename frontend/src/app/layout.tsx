import { fonts } from "../ui/fonts";
import { Providers } from "./providers";
import React from "react";
import Header from "@/ui/components/web/Header";
import { Box } from "@chakra-ui/react";
import "./globals.css";

export default function RootLayout({
	// default root layout using chakraUI
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={fonts.rubik.variable}>
			<body>
				<Providers>
					<Box position="fixed" width="100%">
						<Header />
					</Box>

					<Box as="main" mt="56px">
						{children}
					</Box>
				</Providers>
			</body>
		</html>
	);
}
