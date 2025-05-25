import React, { useEffect } from "react";
import {
  DashboardOutlined,
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Dropdown, Layout, Menu, Space, message } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { CiMusicNote1, CiMicrophoneOn } from "react-icons/ci";
import { FaUserEdit } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { PiPlaylistThin } from "react-icons/pi";
import { IoIosNotifications } from "react-icons/io";
import { useCurrentApp } from "../context/app.context";

const AdminLayout: React.FC = () => {
  const { Header, Sider, Content } = Layout;
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, setIsAuthenticated } = useCurrentApp();
  useEffect(() => {
    console.log(isAuthenticated);
  }, []);
  const handleLogout = async () => {
    setIsAuthenticated(false);
    localStorage.removeItem("access_token");
    message.success("Đã đăng xuất thành công!");
    navigate("/login");
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      message.warning("Vui lòng đăng nhập để tiếp tục!");
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  const userMenu = {
    items: [
      {
        key: "logout",
        label: (
          <div onClick={handleLogout} className="flex items-center gap-2">
            <LogoutOutlined />
            Đăng xuất
          </div>
        ),
      },
    ],
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div className="text-white text-2xl font-bold text-center my-6">
          Admin Panel
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <DashboardOutlined />,
              label: <Link to="/">Dashboard</Link>,
            },
            {
              key: "2",
              icon: <UserOutlined />,
              label: <Link to="/users">Users</Link>,
            },
            {
              key: "3",
              icon: <CiMusicNote1 />,
              label: <Link to="/songs">Songs</Link>,
            },
            {
              key: "4",
              icon: <FaUserEdit />,
              label: <Link to="/artists">Artists</Link>,
            },
            {
              key: "5",
              icon: <BiCategory />,
              label: <Link to="/genres">Genres</Link>,
            },
            {
              key: "6",
              icon: <CiMicrophoneOn />,
              label: <Link to="/karaokes">Karaokes</Link>,
            },
            {
              key: "7",
              icon: <PiPlaylistThin />,
              label: <Link to="/playlists">Playlists</Link>,
            },
            {
              key: "8",
              icon: <IoIosNotifications />,
              label: <Link to="/notifications">Notifications</Link>,
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "64px",
            boxShadow: "0 2px 8px #f0f1f2",
          }}
        >
          <div className="text-xl font-semibold text-gray-800">
            Trang Quản Lý
          </div>

          {isLoading ? null : isAuthenticated ? (
            <Dropdown menu={userMenu}>
              <Space className="cursor-pointer">
                <FaUserCircle size={24} />
                <span className="text-gray-700 font-medium">Admin</span>
                <DownOutlined />
              </Space>
            </Dropdown>
          ) : (
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Đăng nhập
            </Link>
          )}
        </Header>

        <Content style={{ margin: "16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "#fff",
              borderRadius: 8,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
