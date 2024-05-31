import { fonts } from "../ui/fonts";
import { Providers } from "./providers";
import React from "react";

export default function RootLayout({
  // default root layout using chakraUI
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fonts.rubik.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
