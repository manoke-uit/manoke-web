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
  mainText: string;
  brand: string;
  price: number;
  quantity: number;
  category: string;
  releasedDate: any;
  youtubeUrl: string;
  spotifyUrl: string;
  audioUrl: string;
  lyrics: string;
};

const CreateSongs = (props: IProps) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);

  const [listCategory, setListCategory] = useState<
    { label: string; value: string }[]
  >([]);
  const [listBrands, setListBrands] = useState<
    { label: string; value: string }[]
  >([]);

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
    const {
      mainText,
      brand,
      price,
      category,
      releasedDate,
      youtubeUrl,
      spotifyUrl,
      audioUrl,
      lyrics,
    } = values;

    const payload = {
      title: mainText,
      youtubeUrl,
      albumTitle: brand,
      imageUrl: "",
      releasedDate:
        releasedDate?.format("YYYY-MM-DD") ||
        new Date().toISOString().split("T")[0],
      duration: Number(price),
      spotifyUrl,
      lyrics,
      audioUrl,
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
            name="mainText"
            rules={[{ required: true }]}
          >
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item<FieldType>
            label="Album"
            name="brand"
            rules={[{ required: true }]}
          >
            {" "}
            <Select options={listBrands} />{" "}
          </Form.Item>
          <Form.Item<FieldType>
            label="Thể loại"
            name="category"
            rules={[{ required: true }]}
          >
            {" "}
            <Select options={listCategory} />{" "}
          </Form.Item>
          <Form.Item<FieldType>
            label="Thời lượng (phút)"
            name="price"
            rules={[{ required: true }]}
          >
            {" "}
            <Input type="number" />{" "}
          </Form.Item>
          <Form.Item<FieldType>
            label="Ngày phát hành"
            name="releasedDate"
            rules={[{ required: true }]}
          >
            {" "}
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />{" "}
          </Form.Item>
          <Form.Item<FieldType> label="YouTube URL" name="youtubeUrl">
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item<FieldType> label="Spotify URL" name="spotifyUrl">
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item<FieldType> label="Audio URL" name="audioUrl">
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item<FieldType> label="Lyrics" name="lyrics">
            {" "}
            <Input.TextArea rows={4} />{" "}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateSongs;
