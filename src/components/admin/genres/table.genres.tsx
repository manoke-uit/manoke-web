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

import { getAllGenresAPI } from "@/services/api";
import CreateGenres from "./create.genres";
import UpdateGenres from "./update.genres";

interface IGenre {
  id: string;
  name: string;
  songs: string[];
}

type TSearch = {
  name?: string;
};

const TableGenres = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [isDeleteUser, setIsDeleteUser] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<IGenre | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

  const columns: ProColumns<IGenre>[] = [
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
      title: "Tên thể loại",
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
            title={"Xác nhận xóa thể loại"}
            description={"Bạn có chắc chắn muốn xóa thể loại này?"}
            // onConfirm={() => handleDeleteGenre(entity.id)}
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
      <ProTable<IGenre, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        request={async () => {
          const res = await getAllGenresAPI();
          return {
            data: res.data || [],
            success: true,
            total: res.data.length || 0,
          };
        }}
        headerTitle="Danh sách thể loại"
        toolBarRender={() => [
          <Button
            key="import"
            icon={<CloudUploadOutlined />}
            type="primary"
            onClick={() => {
              console.log("Import genre data");
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
      <CreateGenres
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />
      <UpdateGenres
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        refreshTable={refreshTable}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default TableGenres;
