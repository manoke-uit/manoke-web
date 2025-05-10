import { useEffect, useState } from "react";
import { App, Divider, Form, Input, Modal, Select, DatePicker } from "antd";
import type { FormProps } from "antd";
import { updateSongAPI } from "@/services/api";
import dayjs from "dayjs";

interface IProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  refreshTable: () => void;
  setDataUpdate: (v: ISong | null) => void;
  dataUpdate: ISong | null;
}

type FieldType = {
  _id: string;
  mainText: string;
  brand: string;
  price: number;
  category: string;
  releasedDate: any;
  youtubeUrl: string;
  spotifyUrl: string;
  audioUrl: string;
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
        _id: dataUpdate.id,
        mainText: dataUpdate.title,
        brand: dataUpdate.albumTitle,
        price: dataUpdate.duration,
        category: dataUpdate.category,
        releasedDate: dayjs(dataUpdate.releasedDate),
        youtubeUrl: dataUpdate.youtubeUrl,
        spotifyUrl: dataUpdate.spotifyUrl,
        audioUrl: dataUpdate.audioUrl,
        lyrics: dataUpdate.lyrics,
      });
    }
  }, [dataUpdate]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const {
      _id,
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
      albumTitle: brand,
      duration: price,
      category,
      releasedDate: releasedDate.format("YYYY-MM-DD"),
      youtubeUrl,
      spotifyUrl,
      audioUrl,
      lyrics,
    };
    setIsSubmit(true);
    const res = await updateSongAPI(_id, payload);
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
          <Form.Item<FieldType> hidden name="_id" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Tên bài hát"
            name="mainText"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Album"
            name="brand"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Thể loại"
            name="category"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Thời lượng (phút)"
            name="price"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item<FieldType>
            label="Ngày phát hành"
            name="releasedDate"
            rules={[{ required: true }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item<FieldType> label="YouTube URL" name="youtubeUrl">
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label="Spotify URL" name="spotifyUrl">
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label="Audio URL" name="audioUrl">
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label="Lyrics" name="lyrics">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateSongs;
