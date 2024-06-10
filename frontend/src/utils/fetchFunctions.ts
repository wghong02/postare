import { User, Product } from "@/lib/model";

export const fetchUser = async (
  parameter: any,
  setUser: (user: User | null) => void,
  userUtilFunction: (parameter: any) => Promise<User>
): Promise<void> => {
  // function to handle any request to fetch the user
  try {
    const response = await userUtilFunction(parameter);
    setUser(response);
  } catch (error) {
    console.error("Failed to fetch the user:", error);
  }
};

export const fetchSingleProduct = async (
  parameter: any,
  setProduct: (product: Product | null) => void,
  productUtilFunction: (parameter: any) => Promise<Product>
): Promise<Product | null> => {
  // function to handle any request to fetch the product
  try {
    const response = await productUtilFunction(parameter);
    setProduct(response);
    return response; // return here for the special occasion that fetch both product and user
  } catch (error) {
    console.error("Failed to fetch the product:", error);
    return null;
  }
};

export const fetchProducts = async (
  parameter: any,
  setProducts: (products: Product[]) => void,
  productUtilFunction: (parameter: any) => Promise<Product[]>
): Promise<void> => {
  // function to handle any request to fetch the product
  try {
    const response = await productUtilFunction(parameter);
    setProducts(response);
  } catch (error) {
    console.error("Failed to fetch the product:", error);
  }
};
