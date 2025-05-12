import { useEffect, useState } from "react";
import { App, Divider, Form, Input, Modal, Select, DatePicker } from "antd";
import type { FormProps } from "antd";
import { createSongAPI, getCategories } from "@/services/api";
import dayjs from "dayjs";

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  title: string;
  songUrl: string;
  lyrics: string;
};

const CreateArtists = (props: IProps) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getCategories();
      if (res) {
        const d = res.items.map((item) => ({ label: item, value: item }));
        // setListCategory(d);
      }
    };
    fetchCategory();
  }, []);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { title, songUrl, lyrics } = values;

    const payload = {
      title,
      songUrl,
      lyrics,
    };

    setIsSubmit(true);
    const res = await createSongAPI(payload);
    if (res && res.data) {
      message.success("Tạo bài hát thành công!");
      form.resetFields();
      setOpenModalCreate(false);
      refreshTable();
    } else {
      notification.error({
        message: "Tạo thất bại",
        description: res?.message || "Lỗi không xác định",
      });
    }
    setIsSubmit(false);
  };

  return (
    <>
      <Modal
        title="Thêm mới bài hát"
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
            {" "}
            <Input />{" "}
          </Form.Item>

          <Form.Item<FieldType>
            label="Link bài hát"
            name="songUrl"
            rules={[{ required: true }]}
          >
            {" "}
            <Input />{" "}
          </Form.Item>

          <Form.Item<FieldType>
            label="Lyrics"
            name="lyrics"
            rules={[{ required: true }]}
          >
            {" "}
            <Input.TextArea rows={4} />{" "}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateArtists;
