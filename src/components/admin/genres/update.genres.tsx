import { useEffect, useState } from "react";
import { App, Divider, Form, Input, Modal, Select } from "antd";
import type { FormProps } from "antd";
import { updateGenreAPI, getAllSongs } from "@/services/api";

interface IProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  refreshTable: () => void;
  setDataUpdate: (v: IGenre | null) => void;
  dataUpdate: IGenre | null;
}

type FieldType = {
  id: string;
  name: string;
  songIds: string[];
};

const UpdateGenres = (props: IProps) => {
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
    const fetchSongsByGenre = async () => {
      if (dataUpdate) {
        try {
          const res = await getAllSongs(dataUpdate.id, undefined);
          console.log(res);

          const songs = res?.data || [];

          const songIds = songs.map((song: any) => song.id);

          form.setFieldsValue({
            id: dataUpdate.id,
            name: dataUpdate.name,
            songIds: songIds,
          });
        } catch (error) {
          notification.error({
            message: "Không thể tải danh sách bài hát của thể loại",
          });
        }
      }
    };

    fetchSongsByGenre();
  }, [dataUpdate]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { id, name, songIds } = values;
    setIsSubmit(true);
    try {
      const res = await updateGenreAPI(id, name, songIds);
      if (res) {
        message.success("Cập nhật thể loại thành công");
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
      title="Cập nhật thể loại"
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
        name="update-genre"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<FieldType> name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Tên thể loại"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên thể loại" }]}
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
            placeholder="Chọn bài hát thuộc thể loại"
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateGenres;
