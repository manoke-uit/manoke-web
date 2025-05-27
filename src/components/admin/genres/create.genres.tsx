import { useEffect, useState } from "react";
import { App, Divider, Form, Input, Modal, Select } from "antd";
import type { FormProps } from "antd";
import { createGenreAPI, getAllSongs } from "@/services/api";

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  name: string;
  songIds: string[];
};

const CreateGenres = (props: IProps) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);
    try {
      const res = await createGenreAPI(values);
      if (res && res.data) {
        message.success("Tạo thể loại thành công!");
        form.resetFields();
        setOpenModalCreate(false);
        refreshTable();
      } else {
        notification.error({
          message: "Tạo thất bại",
          description: res?.message || "Lỗi không xác định",
        });
      }
    } catch (error) {
      notification.error({
        message: "Tạo thất bại",
        description: "Lỗi trong quá trình gửi dữ liệu",
      });
    }
    setIsSubmit(false);
  };

  return (
    <>
      <Modal
        title="Thêm thể loại mới"
        open={openModalCreate}
        onOk={() => form.submit()}
        onCancel={() => {
          setOpenModalCreate(false);
          form.resetFields();
        }}
        okText="Tạo mới"
        cancelText="Hủy"
        confirmLoading={isSubmit}
      >
        <Divider />
        <Form
          form={form}
          name="create-genre"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item<FieldType>
            label="Tên thể loại"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateGenres;
