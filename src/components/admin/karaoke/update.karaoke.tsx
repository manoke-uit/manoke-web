import { useEffect, useState } from "react";
import { App, Divider, Form, Input, Modal, Select } from "antd";
import type { FormProps } from "antd";
import { updateKaraokeAPI } from "@/services/api";
import { getAllSongs } from "@/services/api";

interface IProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  refreshTable: () => void;
  setDataUpdate: (v: IKaraoke | null) => void;
  dataUpdate: IKaraoke | null;
}

type FieldType = {
  id: string;
  description: string;
  videoUrl: string;
  songId: string;
};

const UpdateKaraokes = (props: IProps) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    refreshTable,
    setDataUpdate,
    dataUpdate,
  } = props;
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
        const mapped = res.data.map((s: any) => ({
          label: s.title,
          value: s.id,
        }));
        setSongOptions(mapped);
      }
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        id: dataUpdate.id,
        description: dataUpdate.description,
        videoUrl: dataUpdate.videoUrl,
        songId: dataUpdate.song?.id,
      });
    }
  }, [dataUpdate, songOptions]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { id, description, videoUrl, songId } = values;
    setIsSubmit(true);
    try {
      const res = await updateKaraokeAPI(id, description, videoUrl, songId);
      console.log(res);
      if (res) {
        message.success("Cập nhật karaoke thành công!");
        form.resetFields();
        setOpenModalUpdate(false);
        setDataUpdate(null);
        refreshTable();
      } else {
        throw new Error("Không nhận được phản hồi hợp lệ");
      }
    } catch (err: any) {
      notification.error({
        message: "Cập nhật thất bại",
        description: err.message || "Lỗi trong quá trình gửi dữ liệu",
      });
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title="Cập nhật karaoke"
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
        name="update-karaoke"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<FieldType> name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Mô tả"
          name="description"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Link video"
          name="videoUrl"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Chọn bài hát"
          name="songId"
          rules={[{ required: true }]}
        >
          <Select options={songOptions} placeholder="Chọn bài hát" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateKaraokes;
