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
          <Header />
          <Box as="main">{children}</Box>
        </Providers>
      </body>
    </html>
  );
}
