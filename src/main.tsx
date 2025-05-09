import { createBrowserRouter, RouterProvider } from "react-router";
import "./styles/global.css";
import ReactDOM from "react-dom/client";
import { App, ConfigProvider } from "antd";
import AdminLayout from "./components/layout/layout.admin";
import Dashboard from "./pages/admin/dashboard";
import Users from "./pages/admin/users";
import Shoes from "./pages/admin/shoes";
import Orders from "./pages/admin/orders";
import enUS from "antd/es/locale/en_US";
import { AppProvider } from "./components/context/app.context";

const router = createBrowserRouter([
  {
    path: "/",
    Component: AdminLayout,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "shoes",
        element: <Shoes />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
    ],
  },
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <App>
    <AppProvider>
      <ConfigProvider locale={enUS}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </AppProvider>
  </App>
);
