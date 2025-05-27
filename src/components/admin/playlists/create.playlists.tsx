import { useEffect, useState } from "react";
import {
  App,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Upload,
  Switch,
  UploadProps,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
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
  description: string;
  isPublic: boolean;
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
  const [imageFile, setImageFile] = useState<File | null>(null);

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
    if (!imageFile) {
      message.error("Vui lòng chọn ảnh playlist");
      return;
    }

    setIsSubmit(true);
    try {
      const res = await createPlaylistAPI(
        values.title,
        imageFile,
        values.description,
        values.isPublic,
        userId!,
        values.songIds
      );
      console.log(res);

      if (res) {
        message.success("Tạo playlist thành công!");
        form.resetFields();
        setImageFile(null);
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

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      setImageFile(file);
      return false;
    },
    maxCount: 1,
    showUploadList: { showRemoveIcon: true },
    onRemove: () => setImageFile(null),
  };

  return (
    <Modal
      title="Tạo Playlist mới"
      open={openModalCreate}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpenModalCreate(false);
        form.resetFields();
        setImageFile(null);
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

        <Form.Item label="Ảnh" required>
          <Upload {...uploadProps} listType="picture-card">
            {!imageFile && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
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
