import { useEffect, useState } from "react";
import {
  Tabs,
  Card,
  Form,
  Input,
  Button,
  Typography,
  message,
  Modal,
  Select,
} from "antd";
import {
  sendNotificationToAllUserAPI,
  sendNotificationToUserAPI,
  getAllUsersAPI,
} from "@/services/api";

const { Title } = Typography;
const { Option } = Select;

const Notifications = () => {
  const [formAll] = Form.useForm();
  const [formOne] = Form.useForm();
  const [loadingAll, setLoadingAll] = useState(false);
  const [loadingOne, setLoadingOne] = useState(false);
  const [users, setUsers] = useState<{ id: string; displayName: string }[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsersAPI({ page: 1, limit: 100 });
        setUsers(res.items || res);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  const handleSendAll = async (values: {
    title: string;
    description: string;
  }) => {
    setLoadingAll(true);
    try {
      const res = await sendNotificationToAllUserAPI(values);
      console.log(res);
      if (res) {
        message.success("Notification sent to all users.");
        formAll.resetFields();
      } else {
        message.error("Server responded but sending failed.");
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to send notification.");
    } finally {
      setLoadingAll(false);
    }
  };

  const handleSendOne = async (values: {
    title: string;
    description: string;
    userId: string;
  }) => {
    setLoadingOne(true);
    try {
      await sendNotificationToUserAPI(values);
      message.success("Notification sent to user.");
      formOne.resetFields();
    } catch (err) {
      console.error(err);
      message.error("Failed to send notification.");
    } finally {
      setLoadingOne(false);
    }
  };

  return (
    <Card style={{ maxWidth: 700, margin: "40px auto" }}>
      <Title level={3}>Push Notification Tool</Title>
      <Tabs defaultActiveKey="all">
        <Tabs.TabPane tab="Send to All Users" key="all">
          <Form layout="vertical" form={formAll} onFinish={handleSendAll}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please input title" }]}
            >
              <Input placeholder="Enter notification title" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please input description" }]}
            >
              <Input.TextArea
                rows={4}
                showCount
                maxLength={200}
                placeholder="Enter notification content"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                loading={loadingAll}
                block
                onClick={() =>
                  Modal.confirm({
                    title: "Confirm Send",
                    content:
                      "Are you sure you want to send this notification to all users?",
                    onOk: () => formAll.submit(),
                  })
                }
              >
                Send to All
              </Button>
            </Form.Item>
          </Form>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Send to One User" key="one">
          <Form layout="vertical" form={formOne} onFinish={handleSendOne}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please input title" }]}
            >
              <Input placeholder="Enter notification title" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please input description" }]}
            >
              <Input.TextArea
                rows={4}
                showCount
                maxLength={200}
                placeholder="Enter notification content"
              />
            </Form.Item>

            <Form.Item
              label="Select User"
              name="userId"
              rules={[{ required: true, message: "Please select a user" }]}
            >
              <Select placeholder="Choose a user">
                {users.map((user) => (
                  <Option key={user.id} value={user.id}>
                    {user.displayName || user.id}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loadingOne}
                block
              >
                Send to User
              </Button>
            </Form.Item>
          </Form>
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default Notifications;
