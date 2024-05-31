const users = [
  {
    UserID: 101,
    Username: "antique_seller",
    UserEmail: "antique@example.com",
    UserPhone: "+1234567890",
    Password: "encrypted_password",
    Address: "123 Vintage St, Oldtown",
    ProfilePicture: "profile_pic_url.jpg",
    RegisterDate: "2023-01-01",
    UserRating: 4.5,
    TotalItemsSold: 1,
  },
  {
    UserID: 102,
    UserUsername: "qwerty",
    UserEmail: "antique2@example.com",
    UserPhone: "+134562897",
    Password: "encrypted_password2",
    Address: "1234 Vintage St, Oldtown",
    ProfilePicture: "profile_pic_url2.jpg",
    RegisterDate: "2023-01-02",
    UserRating: 4.5,
    TotalItemsSold: 0,
  },
];

const comments = [
  {
    CommentID: 1,
    BuyerID: 101,
    Comment: "not bad",
    ProductID: 201,
    SellerID: 102,
  },
  {
    CommentID: 2,
    BuyerID: 101,
    Comment: "not bad",
    ProductID: 201,
    SellerID: 102,
  },
];

const products = [
  {
    ProductID: 201,
    Title: "Vintage Vase",
    Description: "A beautiful antique vase from the 19th century.",
    Price: 15000,
    CategoryID: 10,
    SellerID: 101,
    Condition: "Good",
    PutOutDate: "2024-04-01",
    ProductLocation: "Oldtown Warehouse",
    ProductDetails: "Minor scratches are present.",
    Status: "sold",
    ImageUrl: "https://bit.ly/2Z4KKcF",
  },
];

const orders = [
  {
    OrderID: 401,
    SellerID: 101,
    BuyerID: 102,
    Date: "2024-05-10",
    PriceTotal: 15000,
  },
];

const orderDetails = [
  {
    DetailID: 1,
    OrderID: 401,
    ProductID: 201,
  },
];

const categories = [
  {
    CategoryID: 10,
    CategoryName: "decorations",
  },
  {
    CategoryID: 18,
    CategoryName: "clothes",
  },
  {
    CategoryID: 3,
    CategoryName: "machines",
  },
];

module.exports = {
  users,
  products,
  orders,
  comments,
  categories,
  orderDetails,
};
