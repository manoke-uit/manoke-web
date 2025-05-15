import { useEffect, useState } from "react";
import { App, Divider, Form, Input, Modal, Select } from "antd";
import type { FormProps } from "antd";
import { updateArtistAPI, getAllSongs } from "@/services/api";

interface IProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  refreshTable: () => void;
  setDataUpdate: (v: IArtists | null) => void;
  dataUpdate: IArtists | null;
}

type FieldType = {
  id: string;
  name: string;
  imageUrl: string;
  songIds: string[];
};

const UpdateArtists = (props: IProps) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    refreshTable,
    setDataUpdate,
    dataUpdate,
  } = props;

  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const [songOptions, setSongOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    const fetchSongsByArtist = async () => {
      if (dataUpdate) {
        try {
          const res = await getAllSongs(undefined, dataUpdate.id);
          const songs = res?.data || [];

          const songIds = songs.map((song: any) => song.id);
          const options = songs.map((song: any) => ({
            label: song.title,
            value: song.id,
          }));

          setSongOptions(options);

          form.setFieldsValue({
            id: dataUpdate.id,
            name: dataUpdate.name,
            imageUrl: dataUpdate.imageUrl,
            songIds: songIds,
          });
        } catch (error) {
          notification.error({
            message: "Không thể tải danh sách bài hát của nghệ sĩ",
          });
        }
      }
    };

    fetchSongsByArtist();
  }, [dataUpdate]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { id, name, imageUrl, songIds } = values;
    setIsSubmit(true);
    try {
      const res = await updateArtistAPI(id, name, imageUrl, songIds);
      console.log(res);
      if (res) {
        message.success("Cập nhật nghệ sĩ thành công");
        form.resetFields();
        setOpenModalUpdate(false);
        setDataUpdate(null);
        refreshTable();
      } else {
        throw new Error("Cập nhật thất bại");
      }
    } catch (error: any) {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: error.message,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title="Cập nhật nghệ sĩ"
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
        name="update-artist"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<FieldType> name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Tên nghệ sĩ"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên nghệ sĩ" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Hình ảnh"
          name="imageUrl"
          rules={[{ required: true, message: "Vui lòng nhập đường dẫn ảnh" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Danh sách bài hát"
          name="songIds"
          rules={[
            { required: true, message: "Vui lòng chọn ít nhất 1 bài hát" },
          ]}
        >
          <Select
            mode="multiple"
            options={songOptions}
            placeholder="Chọn bài hát của nghệ sĩ"
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateArtists;
