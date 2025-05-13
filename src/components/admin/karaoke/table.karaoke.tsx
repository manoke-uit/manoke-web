import {
  CloudUploadOutlined,
  DeleteTwoTone,
  EditTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, message, notification, Popconfirm } from "antd";
import { useRef, useState } from "react";

import { deleteKaraokeAPI, getAllKaraokesAPI } from "@/services/api";

import CreateKaraokes from "./create.karaoke";
import UpdateKaraokes from "./update.karaoke";

type TSearch = {
  description?: string;
};

const TableKaraokes = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IKaraoke | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [isDeleteKaraoke, setIsDeleteKaraoke] = useState(false);
  const handleDeleteKaraoke = async (id: string) => {
    setIsDeleteKaraoke(true);
    const res = await deleteKaraokeAPI(id);
    if (res) {
      message.success("Xóa user thành công");
      refreshTable();
    } else {
      notification.error({ message: "Đã có lỗi xảy ra" });
    }
    setIsDeleteKaraoke(false);
  };
  const columns: ProColumns<IKaraoke>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "ID",
      dataIndex: "id",
      hideInSearch: true,
    },
    {
      title: "Video URL",
      dataIndex: "videoUrl",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      valueType: "date",
    },
    {
      title: "Action",
      hideInSearch: true,
      render: (_, entity) => (
        <>
          <EditTwoTone
            twoToneColor="#f57800"
            style={{ cursor: "pointer", marginRight: 15 }}
            onClick={() => {
              setDataUpdate(entity);
              setOpenModalUpdate(true);
            }}
          />
          <Popconfirm
            placement="leftTop"
            title={"Xác nhận xóa user"}
            description={"Bạn có chắc chắn muốn xóa user này ?"}
            onConfirm={() => handleDeleteKaraoke(entity.id)}
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{ loading: isDeleteKaraoke }}
          >
            <span style={{ cursor: "pointer", marginLeft: 20 }}>
              <DeleteTwoTone
                twoToneColor="#ff4d4f"
                style={{ cursor: "pointer" }}
              />
            </span>
          </Popconfirm>
        </>
      ),
    },
  ];

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  return (
    <>
      <ProTable<IKaraoke, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        search={false}
        pagination={{ pageSize: 10 }}
        request={async () => {
          const res = await getAllKaraokesAPI();
          return {
            data: res.data || [],
            success: true,
          };
        }}
        headerTitle="Danh sách karaoke"
        toolBarRender={() => [
          <Button
            key="import"
            icon={<CloudUploadOutlined />}
            type="primary"
            onClick={() => {
              console.log("Import karaoke data");
            }}
          >
            Import
          </Button>,
          <Button
            key="add"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setOpenModalCreate(true);
            }}
          >
            Add new
          </Button>,
        ]}
      />
      <CreateKaraokes
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />
      <UpdateKaraokes
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        refreshTable={refreshTable}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default TableKaraokes;
