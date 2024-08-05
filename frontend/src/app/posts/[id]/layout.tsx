import { Box } from "@chakra-ui/react";
import React from "react";
import type { Metadata } from "next";
import { getPost } from "@/utils/postUtils";

export async function generateMetadata({
	params,
}: {
	params: { id: string };
}): Promise<Metadata> {
	// read route params
	const postId = params.id;

	// fetch data
	const post = await getPost(postId);

	return {
		title: post.title,
	};
}

const PostLayout = ({ children }: { children: React.ReactNode }) => {
	return <Box >{children}</Box>;
};

export default PostLayout;
