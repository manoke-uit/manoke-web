import { useEffect, useState } from "react";
import { App, Divider, Form, Input, Modal, Select } from "antd";
import type { FormProps } from "antd";
import { createArtistAPI, getAllSongs } from "@/services/api";

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: React.Dispatch<React.SetStateAction<boolean>>;
  refreshTable: () => void;
}

type FieldType = {
  name: string;
  imageUrl: string;
  songIds: string[];
};

const CreateArtists = (props: IProps) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const [songOptions, setSongOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const res = await getAllSongs();
      if (res && res.data) {
        const options = res.data.map((song: ISong) => ({
          label: song.title,
          value: song.id,
        }));
        setSongOptions(options);
      }
    };
    if (openModalCreate) fetchSongs();
  }, [openModalCreate]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);
    try {
      const res = await createArtistAPI(values);
      if (res && res.data) {
        message.success("Tạo nghệ sĩ thành công!");
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
    <Modal
      title="Thêm nghệ sĩ mới"
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
        name="create-artist"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<FieldType>
          label="Tên nghệ sĩ"
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Hình ảnh"
          name="imageUrl"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Danh sách bài hát"
          name="songIds"
          rules={[{ required: true }]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn bài hát"
            options={songOptions}
            optionFilterProp="label"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateArtists;
