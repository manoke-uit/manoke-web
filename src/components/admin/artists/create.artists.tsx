import { useEffect, useState } from "react";
import {
  App,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Upload,
  UploadProps,
} from "antd";
import type { FormProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { createArtistAPI, getAllSongs } from "@/services/api";

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: React.Dispatch<React.SetStateAction<boolean>>;
  refreshTable: () => void;
}

type FieldType = {
  name: string;
  image: File;
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
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (!imageFile) {
      message.error("Vui lòng chọn hình ảnh!");
      return;
    }

    const payload = {
      name: values.name,
      image: imageFile,
      songIds: [],
    };

    setIsSubmit(true);
    try {
      const res = await createArtistAPI(payload);
      console.log(payload);
      if (res && res.data) {
        message.success("Tạo nghệ sĩ thành công!");
        form.resetFields();
        setImageFile(null);
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
      title="Thêm nghệ sĩ mới"
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

        <Form.Item label="Hình ảnh" required>
          <Upload {...uploadProps} listType="picture-card">
            {!imageFile && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateArtists;
