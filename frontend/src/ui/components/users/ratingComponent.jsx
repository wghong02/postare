import React from "react";
import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

const RatingDisplay = ({ rating, reviews, outOf = 5 }) => {
  // Function to generate
  const filledStars = Math.floor(rating);
  const hasPartialStar = rating % 1 !== 0;
  const emptyStars = Math.floor(outOf - rating);
  const partialStar = rating - filledStars;

  const size = "24px";

  return (
    <Flex align="center">
      <Text mr={2}>
        {" "}
        Seller Rating: {rating}/{outOf}
      </Text>
      <Box>
        {Array.from({ length: filledStars }).map((_, index) => (
          <Icon
            as={StarIcon}
            key={`full-${index}`}
            color="teal.400"
            boxSize={size}
          />
        ))}
        {hasPartialStar && (
          <Box as="span" position="relative" display="inline-block">
            <Icon as={StarIcon} color="gray.300" boxSize={size} />
            <Box
              as="span"
              position="absolute"
              top="0"
              left="0"
              overflow="hidden"
              width={`${
                // to fill the stars more gradually
                (2 * partialStar ** 3 -
                  3 * partialStar ** 2 +
                  2 * partialStar) *
                100
              }%`}
            >
              <Icon as={StarIcon} color="teal.400" boxSize={size} />
            </Box>
          </Box>
        )}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <Icon
            as={StarIcon}
            key={`empty-${index}`}
            color="gray.300"
            boxSize={size}
          />
        ))}
      </Box>
      <Box as="span" ml="2" color="gray.600" fontSize="sm">
        {reviews} reviews
      </Box>
    </Flex>
  );
};

export default RatingDisplay;
