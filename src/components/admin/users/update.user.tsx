import { useEffect, useState } from "react";
import { App, Divider, Form, Input, Modal } from "antd";
import type { FormProps } from "antd";
import { updateUserAPI } from "@/services/api";

interface IProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  refreshTable: () => void;
  setDataUpdate: (v: IUserTable | null) => void;
  dataUpdate: IUserTable | null;
}

type FieldType = {
  id: string;
  email: string;
  displayName: string;
};

const UpdateUser = ({
  openModalUpdate,
  setOpenModalUpdate,
  refreshTable,
  setDataUpdate,
  dataUpdate,
}: IProps) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        id: dataUpdate.id,
        email: dataUpdate.email,
        displayName: dataUpdate.displayName,
      });
    }
  }, [dataUpdate]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { id, displayName, email } = values;
    setIsSubmit(true);
    try {
      const res = await updateUserAPI(id, email, displayName);
      if (res) {
        message.success("Cập nhật người dùng thành công");
        form.resetFields();
        setOpenModalUpdate(false);
        setDataUpdate(null);
        refreshTable();
      } else {
        throw new Error("Cập nhật thất bại");
      }
    } catch (error: any) {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: error.message,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title="Cập nhật người dùng"
      open={openModalUpdate}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpenModalUpdate(false);
        setDataUpdate(null);
        form.resetFields();
      }}
      okText="Cập nhật"
      cancelText="Hủy"
      confirmLoading={isSubmit}
    >
      <Divider />
      <Form
        form={form}
        name="form-update"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<FieldType> name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không đúng định dạng!" },
          ]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item<FieldType>
          label="Tên hiển thị"
          name="displayName"
          rules={[{ required: true, message: "Vui lòng nhập tên hiển thị!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUser;
