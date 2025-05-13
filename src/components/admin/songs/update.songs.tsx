import { useEffect, useState } from "react";
import { App, Divider, Form, Input, Modal, Select, DatePicker } from "antd";
import type { FormProps } from "antd";
import { updateSongAPI } from "@/services/api";

interface IProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  refreshTable: () => void;
  setDataUpdate: (v: ISong | null) => void;
  dataUpdate: ISong | null;
}

type FieldType = {
  id: string;
  title: string;
  songUrl: string;
  lyrics: string;
};

const UpdateSongs = (props: IProps) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    refreshTable,
    setDataUpdate,
    dataUpdate,
  } = props;
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        id: dataUpdate.id,
        title: dataUpdate.title,
        songUrl: dataUpdate.songUrl,
        lyrics: dataUpdate.lyrics ?? "",
      });
    }
  }, [dataUpdate]);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { id, title, lyrics, songUrl } = values;

    setIsSubmit(true);
    const res = await updateSongAPI(id, title, lyrics, songUrl);
    if (res) {
      message.success("Cập nhật bài hát thành công");
      form.resetFields();
      setOpenModalUpdate(false);
      setDataUpdate(null);
      refreshTable();
    } else {
      notification.error({ message: "Đã có lỗi xảy ra" });
    }
    setIsSubmit(false);
  };

  return (
    <>
      <Modal
        title="Cập nhật bài hát"
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
          name="update-song"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item<FieldType> name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Tên bài hát"
            name="title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Link bài hát"
            name="songUrl"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Lyrics"
            name="lyrics"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateSongs;
