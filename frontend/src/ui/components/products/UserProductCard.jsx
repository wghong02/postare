import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { timeAgo } from "@/utils/generalUtils";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import { deleteProduct } from "@/utils/productUtils";

function UserProductCard({ product }) {
  const registerTime = timeAgo(product.putOutDate);
  const productID = product.productId;

  // to delete the product
  const deleteOnClick = async (productID) => {
    try {
      await deleteProduct(productID);
      window.location.href = `/user/products`; // Inform parent component about the deletion
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <Box>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        width="1000px"
      >
        <Image
          objectFit="cover"
          maxW={{ base: "100%", sm: "200px" }}
          src={product.imageUrl}
          alt="Product Image"
        />

        <Stack>
          <CardBody>
            <Heading size="md">{product.title}</Heading>

            <Text py="2">{product.description}</Text>
            <Text py="3">Product posted {registerTime}</Text>
          </CardBody>

          <CardFooter>
            <Link as={NextLink} href={`/products/${productID}`} passHref>
              <Button variant="solid" colorScheme="blue" mr="6">
                View
              </Button>
            </Link>
            <Button
              variant="solid"
              colorScheme="red"
              onClick={() => deleteOnClick(productID)}
            >
              Delete
            </Button>
          </CardFooter>
        </Stack>
      </Card>
    </Box>
  );
}

export default UserProductCard;
