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

import { getAllArtistsAPI, deleteSongAPI } from "@/services/api";
import CreateArtists from "./create.artists";
import UpdateArtists from "../songs/update.songs";

type TSearch = {
  title?: string;
  category?: string;
};

const TableArtists = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [isDeleteUser, setIsDeleteUser] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<ISong | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

  const handleDeleteSong = async (id: string) => {
    setIsDeleteUser(true);
    const res = await deleteSongAPI(id);
    if (res) {
      message.success("Xóa bài hát thành công");
      refreshTable();
    } else {
      notification.error({ message: "Đã có lỗi xảy ra" });
    }
    setIsDeleteUser(false);
  };

  const columns: ProColumns<ISong>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "Id",
      dataIndex: "id",
      hideInSearch: true,
    },
    {
      title: "Name",
      dataIndex: "name",
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
            title={"Xác nhận xóa bài hát"}
            description={"Bạn có chắc chắn muốn xóa bài hát này ?"}
            onConfirm={() => handleDeleteSong(entity.id)}
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{ loading: isDeleteUser }}
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
      <ProTable<ISong, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        search={false}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
        request={async (params) => {
          const currentPage = params.current || 1;
          const res = await getAllArtistsAPI(currentPage);
          return {
            data: res.items || [],
            success: true,
            total: res.meta?.totalItems || 0,
          };
        }}
        headerTitle="Danh sách bài hát theo nghệ sĩ"
        toolBarRender={() => [
          <Button
            key="import"
            icon={<CloudUploadOutlined />}
            type="primary"
            onClick={() => {
              console.log("Import artist data");
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
      <CreateArtists
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />
      <UpdateArtists
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        refreshTable={refreshTable}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default TableArtists;
