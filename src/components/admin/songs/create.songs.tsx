import { useState } from "react";
import { App, Divider, Form, Input, Modal, Upload, Button } from "antd";
import type { FormProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { createSongAPI } from "@/services/api";

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  title: string;
  lyrics: string;
  file: File;
  image: File;
};

const CreateSongs = (props: IProps) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (!file) {
      message.warning("Vui lòng chọn file bài hát");
      return;
    }
    if (!image) {
      message.warning("Vui lòng chọn ảnh bài hát");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("lyrics", values.lyrics);
    formData.append("audio", file);
    formData.append("image", image);

    setIsSubmit(true);
    try {
      const res = await createSongAPI(formData);

      if (res && res.data) {
        message.success("Tạo bài hát thành công!");
        form.resetFields();
        setFile(null);
        setImage(null);
        setOpenModalCreate(false);
        refreshTable();
      } else {
        notification.error({
          message: "Tạo thất bại",
          description: "Không nhận được songUrl",
        });
      }
    } catch (err) {
      notification.error({
        message: "Tạo thất bại",
        description: "Lỗi trong quá trình gửi dữ liệu",
      });
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title="Thêm mới bài hát"
      open={openModalCreate}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpenModalCreate(false);
        form.resetFields();
        setFile(null);
        setImage(null);
      }}
      okText="Tạo mới"
      cancelText="Hủy"
      confirmLoading={isSubmit}
    >
      <Divider />
      <Form
        form={form}
        name="create-song"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<FieldType>
          label="Tên bài hát"
          name="title"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Lời bài hát"
          name="lyrics"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="File bài hát" required>
          <Upload
            beforeUpload={(file) => {
              setFile(file);
              return false;
            }}
            maxCount={1}
            accept="audio/*"
          >
            <Button icon={<UploadOutlined />}>Chọn file nhạc</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Ảnh bài hát" required>
          <Upload
            beforeUpload={(file) => {
              setImage(file);
              return false;
            }}
            maxCount={1}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateSongs;
