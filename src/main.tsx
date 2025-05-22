import { createBrowserRouter, RouterProvider } from "react-router";
import "./styles/global.css";
import ReactDOM from "react-dom/client";
import { App, ConfigProvider } from "antd";
import AdminLayout from "./components/layout/layout.admin";
import Dashboard from "./pages/admin/dashboard";
import Users from "./pages/admin/users";
import "@ant-design/v5-patch-for-react-19";
import enUS from "antd/es/locale/en_US";
import { AppProvider } from "./components/context/app.context";
import LoginPage from "./pages/admin/login";
import Songs from "./pages/admin/songs";
import Artists from "./pages/admin/artists";
import Genres from "./pages/admin/genres";
import Karaoke from "./pages/admin/karaoke";
import Playlists from "./pages/admin/playlists";
import Notifications from "./pages/admin/notifications";

const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
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
        path: "songs",
        element: <Songs />,
      },
      {
        path: "artists",
        element: <Artists />,
      },
      {
        path: "genres",
        element: <Genres />,
      },
      {
        path: "karaokes",
        element: <Karaoke />,
      },
      {
        path: "playlists",
        element: <Playlists />,
      },
      {
        path: "notifications",
        element: <Notifications />,
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
