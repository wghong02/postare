import React from "react";
import { Spinner } from "@chakra-ui/react";

interface LoadingWrapperProps {
  // defining the props needed for loading wrapper
  loading: boolean;
  hasFetched: boolean;
  children: React.ReactNode;
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  loading,
  hasFetched,
  children,
}) => {
  // wraps around a child react component to handle loading screen
  if (loading) {
    return <Spinner size="xl" />;
  }

  if (hasFetched && !React.Children.count(children)) {
    return <>No products found.</>; // !!! handle when no product (maybe separate page)
  }

  return <>{children}</>;
};

export default LoadingWrapper;
