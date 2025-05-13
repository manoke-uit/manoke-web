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

import { getAllArtistsAPI, deleteArtistAPI } from "@/services/api";

import CreateArtists from "./create.artists";
import UpdateArtists from "./update.artists";

interface IArtist {
  id: string;
  name: string;
  imageUrl: string;
  songs: string[];
}

const TableArtists = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [isDeleteArtist, setIsDeleteArtist] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IArtists | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState(false);

  const handleDeleteArtist = async (id: string) => {
    setIsDeleteArtist(true);
    try {
      const res = await deleteArtistAPI(id);
      if (res) {
        message.success("Xóa nghệ sĩ thành công");
        refreshTable();
      }
    } catch {
      notification.error({ message: "Đã có lỗi xảy ra khi xóa nghệ sĩ" });
    } finally {
      setIsDeleteArtist(false);
    }
  };

  const columns: ProColumns<IArtists>[] = [
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
      title: "Tên nghệ sĩ",
      dataIndex: "name",
    },
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      render: (_, entity) => (
        <img src={entity.imageUrl} alt={entity.name} width={50} />
      ),
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
            title="Xác nhận xóa nghệ sĩ"
            description="Bạn có chắc chắn muốn xóa nghệ sĩ này?"
            onConfirm={() => handleDeleteArtist(entity.id)}
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{ loading: isDeleteArtist }}
          >
            <span style={{ cursor: "pointer", marginLeft: 20 }}>
              <DeleteTwoTone twoToneColor="#ff4d4f" />
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
      <ProTable<IArtists>
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
        headerTitle="Danh sách nghệ sĩ"
        toolBarRender={() => [
          <Button
            key="import"
            icon={<CloudUploadOutlined />}
            type="primary"
            onClick={() => console.log("Import artist data")}
          >
            Import
          </Button>,
          <Button
            key="add"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenModalCreate(true)}
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
