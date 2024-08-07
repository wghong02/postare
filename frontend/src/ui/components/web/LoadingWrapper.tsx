import React from "react";
import { Spinner } from "@chakra-ui/react";
import NotFound from "@/app/not-found";

interface LoadingWrapperProps {
	// defining the props needed for loading wrapper
	loading: boolean;
	hasFetched: boolean;
	children: React.ReactNode;
	hasData?: boolean;
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
	loading,
	hasFetched,
	children,
	hasData = true,
}) => {
	// wraps around a child react component to handle loading screen
	if (loading) {
		return (
			<Spinner
				mt="30"
				thickness="4px"
				speed="0.65s"
				emptyColor="gray.200"
				color="teal.500"
				size="xl"
			/>
		);
	}

	if (hasFetched && !hasData) {
		return NotFound();
	}

	return <>{children}</>;
};

export default LoadingWrapper;
