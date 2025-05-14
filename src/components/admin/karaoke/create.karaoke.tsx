import { useEffect, useState } from "react";
import { App, Divider, Form, Input, Modal, Upload, Button, Select } from "antd";
import type { FormProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { createKaraokeAPI, getAllSongs } from "@/services/api";

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  description: string;
  songId: string;
  file: File;
};

const CreateKaraokes = (props: IProps) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [songOptions, setSongOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await getAllSongs();
        const options = res?.data?.map((song: any) => ({
          label: song.title,
          value: song.id,
        }));
        setSongOptions(options);
      } catch {
        notification.error({
          message: "Không thể tải danh sách bài hát",
        });
      }
    };
    fetchSongs();
  }, []);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (!file) {
      message.warning("Vui lòng chọn file karaoke");
      return;
    }

    const formData = new FormData();
    formData.append("description", values.description);
    formData.append("songId", values.songId);
    formData.append("file", file);

    setIsSubmit(true);
    try {
      const res = await createKaraokeAPI(formData);
      if (res && res.data) {
        message.success("Tạo karaoke thành công!");
        form.resetFields();
        setFile(null);
        setOpenModalCreate(false);
        refreshTable();
      } else {
        throw new Error("Không nhận được phản hồi hợp lệ");
      }
    } catch (err: any) {
      notification.error({
        message: "Tạo thất bại",
        description: err.message || "Lỗi trong quá trình gửi dữ liệu",
      });
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title="Thêm karaoke mới"
      open={openModalCreate}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpenModalCreate(false);
        form.resetFields();
        setFile(null);
      }}
      okText="Tạo mới"
      cancelText="Hủy"
      confirmLoading={isSubmit}
    >
      <Divider />
      <Form
        form={form}
        name="create-karaoke"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<FieldType>
          label="Mô tả"
          name="description"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Chọn bài hát"
          name="songId"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Chọn bài hát từ danh sách"
            options={songOptions}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>

        <Form.Item label="File karaoke" required>
          <Upload
            beforeUpload={(file) => {
              setFile(file);
              return false;
            }}
            maxCount={1}
            accept="video/*"
          >
            <Button icon={<UploadOutlined />}>Chọn file</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateKaraokes;
