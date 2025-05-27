import React, { useState } from "react";
import type { FormProps } from "antd";
import { App, Button, Checkbox, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchAccountAPI, loginAPI } from "@/services/api";
import { useCurrentApp } from "@/components/context/app.context";
type FieldType = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();
  const { setIsAuthenticated, setUser } = useCurrentApp();

const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
  const { username, password } = values;
  setIsSubmit(true);
  const res = await loginAPI(username, password);
  setIsSubmit(false);

  if (res && res.accessToken) {
    // Lưu token tạm
    localStorage.setItem("access_token", res.accessToken);

    try {
      const account = await fetchAccountAPI(); 

      if (!account.adminSecret) {
        message.error("Tài khoản không có quyền quản trị!");
        localStorage.removeItem("access_token"); 
        return;
      }

      setIsAuthenticated(true);
      setUser(account);
      localStorage.setItem("user", JSON.stringify(account));
      message.success("Đăng nhập thành công với quyền quản trị!");
      navigate("/");
    } catch (err) {
      message.error("Không thể kiểm tra thông tin tài khoản!");
      localStorage.removeItem("access_token");
    }
  } else {
    message.error("Sai tài khoản hoặc mật khẩu!");
  }
};


  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center flex-1 h-[100vh] w-[100vw]">
      <div className="bg-gray-200 rounded-2xl p-12 w-[30vw]">
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
          labelCol={{ span: 24 }}
        >
          <Form.Item<FieldType>
            labelCol={{
              span: 24,
            }}
            wrapperCol={{ span: 24 }}
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            labelCol={{
              span: 24,
            }}
            wrapperCol={{ span: 24 }}
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label={null}
            wrapperCol={{ span: 24 }}
            labelCol={{
              span: 24,
            }}
          >
            <Button type="primary" htmlType="submit" loading={isSubmit}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
