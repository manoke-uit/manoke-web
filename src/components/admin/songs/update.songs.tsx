import { useEffect, useState } from "react";
import { App, Divider, Form, Input, Modal, Select } from "antd";
import type { FormProps } from "antd";
import { updateSongAPI, getAllArtistsAPI } from "@/services/api";

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
  imageUrl: string;
  artistIds: string[];
};

const UpdateSongs = (props: IProps) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    refreshTable,
    setDataUpdate,
    dataUpdate,
  } = props;

  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();
  const [artistOptions, setArtistOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await getAllArtistsAPI(1);
        const options = res?.items?.map((artist: any) => ({
          label: artist.name,
          value: artist.id,
        }));
        setArtistOptions(options);
      } catch {
        notification.error({ message: "Không thể tải danh sách nghệ sĩ" });
      }
    };

    fetchArtists();
  }, []);

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        id: dataUpdate.id,
        title: dataUpdate.title,
        songUrl: dataUpdate.songUrl,
        lyrics: dataUpdate.lyrics ?? "",
        imageUrl: dataUpdate.imageUrl ?? "",
        artistIds: dataUpdate.artists?.map((a) => a.id) ?? [],
      });
    }
  }, [dataUpdate]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { id, title, lyrics, songUrl, imageUrl, artistIds } = values;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("lyrics", lyrics);
    formData.append("songUrl", songUrl);
    formData.append("imageUrl", imageUrl);
    artistIds.forEach((id) => formData.append("artistIds[]", id));
    setIsSubmit(true);
    const res = await updateSongAPI(id, formData);

    if (res && res.data) {
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
          label="Link ảnh bài hát"
          name="imageUrl"
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

        <Form.Item<FieldType>
          label="Nghệ sĩ"
          name="artistIds"
          rules={[
            { required: true, message: "Vui lòng chọn ít nhất 1 nghệ sĩ" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn nghệ sĩ"
            options={artistOptions}
            optionFilterProp="label"
            showSearch
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateSongs;
