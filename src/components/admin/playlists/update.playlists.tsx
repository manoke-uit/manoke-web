import { useEffect, useState } from "react";
import { App, Divider, Form, Input, Modal, Select, Switch } from "antd";
import type { FormProps } from "antd";
import {
  updatePlaylistAPI,
  getAllSongs,
  getSongsInPlaylistAPI,
} from "@/services/api";

interface IProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  refreshTable: () => void;
  setDataUpdate: (v: IPlaylist | null) => void;
  dataUpdate: IPlaylist | null;
}

type FieldType = {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  isPublic: boolean;
  songIds: string[];
};

const UpdatePlaylists = (props: IProps) => {
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
    const fetchAllSongs = async () => {
      try {
        const res = await getAllSongs();
        const songs = res?.data || [];
        const options = songs.map((song: any) => ({
          label: song.title,
          value: song.id,
        }));
        setSongOptions(options);
      } catch {
        notification.error({ message: "Không thể tải danh sách bài hát" });
      }
    };
    fetchAllSongs();
  }, []);

  useEffect(() => {
    const fetchSongIdsInPlaylist = async () => {
      if (dataUpdate) {
        try {
          const res = await getSongsInPlaylistAPI(dataUpdate.id);

          const songs = res || [];
          const songIds = songs.map((song: any) => song.id);

          form.setFieldsValue({
            id: dataUpdate.id,
            title: dataUpdate.title,
            imageUrl: dataUpdate.imageUrl,
            description: dataUpdate.description,
            isPublic: dataUpdate.isPublic,
            songIds: songIds,
          });
        } catch {
          notification.error({
            message: "Không thể tải bài hát trong playlist",
          });
        }
      }
    };

    fetchSongIdsInPlaylist();
  }, [dataUpdate]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { id, title, imageUrl, description, isPublic, songIds } = values;

    setIsSubmit(true);
    try {
      const res = await updatePlaylistAPI(
        id,
        title,
        imageUrl,
        description,
        isPublic,
        songIds
      );
      console.log(res);
      if (res) {
        message.success("Cập nhật playlist thành công");
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
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title="Cập nhật Playlist"
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
        name="update-playlist"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<FieldType> name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Tên Playlist"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Ảnh đại diện"
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
          label="Danh sách bài hát"
          name="songIds"
          rules={[{ required: true, message: "Vui lòng chọn bài hát" }]}
        >
          <Select
            mode="multiple"
            options={songOptions}
            placeholder="Chọn bài hát"
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdatePlaylists;
