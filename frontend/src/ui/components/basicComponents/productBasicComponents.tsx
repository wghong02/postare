import { Box } from "@chakra-ui/react";
import React from "react";

export function DisplayPriceComponent(price: number): React.ReactElement {
  return (
    <Box mt="1" as="h4" lineHeight="tight" noOfLines={1} fontSize="lg">
      {Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2, // Ensures two decimal places in the output
        maximumFractionDigits: 2, // Ensures two decimal places even if the number is whole
      }).format(price / 100)}
    </Box>
  );
}
