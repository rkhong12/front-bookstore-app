import { createBrowserRouter } from "react-router";
import Login from "../pages/login/Login";
import Layout from "../components/layout/Layout";
import BookList from "../pages/book/BookList";
import BookDetail from "../pages/book/BookDetail";
import BookCreate from "../pages/book/BookCreate";
import UserList from "../pages/users/UserList";
import MyPage from "../pages/mypage/MyPage";
import CartPage from "../pages/cart/CartPage";
import OrderResult from "../pages/order/OrderResult";
import BookSearch from "../pages/book/BookSearch";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        // index: true,
        // Component: MainPage, // 필요시 홈화면
      },
      {
        path: "book",
        children: [
          {
            index: true, // /book
            Component: BookList,
          },
          {
            path: ":bookId", // /book/:bookId
            Component: BookDetail,
          },
          {
            path: "new", // /book/new
            Component: BookCreate,
          },
          {
            path: "search", //  /book/search
            Component: BookSearch,
          },
        ],
      },
      {
        path: "users",
        children: [{ index: true, Component: UserList }],
      },
      {
        path: "mypage",
        children: [{ index: true, Component: MyPage }],
      },
      {
        path: "cart",
        children: [{ index: true, Component: CartPage }],
      },
      {
        path: "order",
        children: [
          {
            path: "result",
            Component: OrderResult,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
]);
