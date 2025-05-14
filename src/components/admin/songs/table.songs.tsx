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
  message,
  notification,
  Popconfirm,
  Select,
  Input,
  Space,
} from "antd";
import { useRef, useState } from "react";

import {
  getAllSongs,
  deleteSongAPI,
  searchSongsByTitleAPI,
  searchSongsByArtistAPI,
} from "@/services/api";
import CreateSongs from "./create.songs";
import UpdateSongs from "./update.songs";

type TSearch = {
  title?: string;
};

const TableSongs = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [isDeleteUser, setIsDeleteUser] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<ISong | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState(false);

  const [searchType, setSearchType] = useState<"title" | "artist">("title");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

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
      title: "ID",
      dataIndex: "id",
      hideInSearch: true,
    },
    {
      title: "Tên bài hát",
      dataIndex: "title",
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
            title="Xác nhận xóa bài hát"
            description="Bạn có chắc chắn muốn xóa bài hát này?"
            onConfirm={() => handleDeleteSong(entity.id)}
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{ loading: isDeleteUser }}
          >
            <span style={{ cursor: "pointer" }}>
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
      <ProTable<ISong, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        rowKey="id"
        pagination={{ pageSize: 10 }}
        search={false}
        request={async () => {
          try {
            if (searchKeyword) {
              const api =
                searchType === "title"
                  ? searchSongsByTitleAPI
                  : searchSongsByArtistAPI;
              const res = await api(searchKeyword);
              return { data: res.data || [], success: true };
            } else {
              const res = await getAllSongs();
              return { data: res.data || [], success: true };
            }
          } catch {
            return { data: [], success: false };
          }
        }}
        headerTitle="Danh sách bài hát"
        toolBarRender={() => [
          <Space key="search" style={{ display: "flex", gap: 8 }}>
            <Select
              defaultValue="title"
              style={{ width: 120 }}
              onChange={(val) => setSearchType(val as "title" | "artist")}
              options={[
                { label: "Tiêu đề", value: "title" },
                { label: "Nghệ sĩ", value: "artist" },
              ]}
            />
            <Input.Search
              placeholder="Tìm kiếm..."
              onSearch={() => refreshTable()}
              allowClear
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </Space>,
          <Button
            key="import"
            icon={<CloudUploadOutlined />}
            type="primary"
            onClick={() => console.log("Import song data")}
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
            Thêm mới
          </Button>,
        ]}
      />
      <CreateSongs
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />
      <UpdateSongs
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        refreshTable={refreshTable}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default TableSongs;
