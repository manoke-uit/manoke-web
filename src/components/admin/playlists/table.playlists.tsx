import {
  CloudUploadOutlined,
  DeleteTwoTone,
  EditTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import {
  Button,
  Image,
  Input,
  message,
  notification,
  Popconfirm,
  Tag,
} from "antd";
import { useRef, useState } from "react";

import {
  getAllPlaylistsAPI,
  deletePlaylistAPI,
  searchPlaylistsByTitleAPI,
} from "@/services/api";
import CreatePlaylists from "./create.playlists";
import UpdatePlaylists from "./update.playlists";

const TablePlaylists = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [isDelete, setIsDelete] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IPlaylist | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  const handleDelete = async (id: string) => {
    setIsDelete(true);
    const res = await deletePlaylistAPI(id);
    if (res) {
      message.success("Xóa playlist thành công");
      refreshTable();
    } else {
      notification.error({ message: "Xóa playlist thất bại" });
    }
    setIsDelete(false);
  };

  const columns: ProColumns<IPlaylist>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "Ảnh",
      dataIndex: "imageUrl",
      hideInSearch: true,
      render: (_, record) =>
        record.imageUrl ? (
          <Image src={record.imageUrl} width={60} height={40} />
        ) : (
          <Tag color="gray">Không có ảnh</Tag>
        ),
    },
    {
      title: "Tên Playlist",
      dataIndex: "title",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      hideInSearch: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "isPublic",
      hideInSearch: true,
      render: (_, record) =>
        record.isPublic ? (
          <Tag color="green">Công khai</Tag>
        ) : (
          <Tag color="red">Riêng tư</Tag>
        ),
    },
    {
      title: "Thao tác",
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
            title="Xác nhận xóa playlist"
            description="Bạn có chắc chắn muốn xóa playlist này?"
            onConfirm={() => handleDelete(entity.id)}
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{ loading: isDelete }}
          >
            <span style={{ cursor: "pointer" }}>
              <DeleteTwoTone twoToneColor="#ff4d4f" />
            </span>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <ProTable<IPlaylist>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        rowKey="id"
        pagination={{ pageSize: 10 }}
        search={false}
        request={async () => {
          try {
            if (searchKeyword.trim()) {
              const res = await searchPlaylistsByTitleAPI(searchKeyword);
              return {
                data: res || [],
                success: true,
                total: res.length || 0,
              };
            } else {
              const res = await getAllPlaylistsAPI();
              return {
                data: res || [],
                success: true,
                total: res.length || 0,
              };
            }
          } catch {
            return { data: [], success: false };
          }
        }}
        headerTitle="Danh sách Playlist"
        toolBarRender={() => [
          <Input.Search
            key="search"
            placeholder="Tìm theo tiêu đề..."
            allowClear
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onSearch={refreshTable}
            style={{ width: 250 }}
          />,
          <Button
            key="import"
            icon={<CloudUploadOutlined />}
            type="primary"
            onClick={() => {
              console.log("Import playlists");
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
      <CreatePlaylists
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />
      <UpdatePlaylists
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        refreshTable={refreshTable}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default TablePlaylists;
