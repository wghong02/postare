"use client";
import { Box } from "@chakra-ui/react";
import React from "react";

const PostLayout = ({ children }: { children: React.ReactNode }) => {
	return <Box >{children}</Box>;
};

export default PostLayout;
