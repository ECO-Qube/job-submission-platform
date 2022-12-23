import {PropsWithChildren} from "react";
import {Box, Spinner} from "@chakra-ui/react";
import * as React from "react";

type RequestHelperProps = PropsWithChildren<{ isLoading: boolean, error: unknown, children: React.ReactNode }>;

// Simply shows a spinner while the request is loading, or shows the error if there is one, else shows the children
export const RequestHelper = ({ isLoading, error, children }: RequestHelperProps) => {
  if (isLoading) {
    return <Box display="flex" justifyContent="center" alignContent="center"><Spinner size='xl'/></Box>;
  }

  if (error) {
    // @ts-ignore
    return <Box>Error: {error.message} 😱</Box>;
  }

  return <>{children}</>;
}