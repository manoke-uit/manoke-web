import { useEffect, useState } from "react";
import { App, Divider, Form, Input, Modal, Select, Button, Switch } from "antd";
import type { FormProps } from "antd";
import { createPlaylistAPI, getAllSongs } from "@/services/api";
import { useCurrentApp } from "@/components/context/app.context";

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  title: string;
  imageUrl: string;
  description: string;
  isPublic: boolean;
  userId: string;
  songIds: string[];
};

const CreatePlaylists = (props: IProps) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const [songOptions, setSongOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const { user } = useCurrentApp();
  const userId = user?.userId;

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
        notification.error({ message: "Không thể tải danh sách bài hát" });
      }
    };
    fetchSongs();
  }, []);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const payload = {
      ...values,
      userId,
    };

    setIsSubmit(true);
    try {
      const res = await createPlaylistAPI(
        payload.title,
        payload.imageUrl,
        payload.description,
        payload.isPublic,
        payload.userId!,
        payload.songIds
      );

      if (res) {
        message.success("Tạo playlist thành công!");
        form.resetFields();
        setOpenModalCreate(false);
        refreshTable();
      } else {
        notification.error({
          message: "Tạo thất bại",
          description: "Không nhận được phản hồi hợp lệ",
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
      title="Tạo Playlist mới"
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
        name="create-playlist"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<FieldType>
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Ảnh"
          name="imageUrl"
          rules={[{ required: true, message: "Vui lòng nhập URL ảnh" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item<FieldType>
          label="Công khai"
          name="isPublic"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item<FieldType>
          label="Chọn bài hát"
          name="songIds"
          rules={[
            { required: true, message: "Vui lòng chọn ít nhất 1 bài hát" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn bài hát"
            options={songOptions}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePlaylists;
