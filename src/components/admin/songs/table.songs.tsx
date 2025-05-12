import { dateRangeValidate } from "@/services/helper";
import {
  CloudUploadOutlined,
  DeleteTwoTone,
  EditTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { App, Button, message, notification, Popconfirm } from "antd";
import { useEffect, useRef, useState } from "react";
import CreateSongs from "./create.songs";
import UpdateSongs from "./update.songs";
import { getAllSongs } from "@/services/api";

type TSearch = {
  title?: string;
  category?: string;
};

const TableSongs = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [shoesTable, setShoesTable] = useState<ISong[]>([]);
  const [isDeleteUser, setIsDeleteUser] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<ISong | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [meta, setMeta] = useState<IPaginationMeta>({
    totalItems: 0,
    itemCount: 0,
    itemsPerPage: 5,
    totalPages: 0,
    currentPage: 1,
  });
  // const handleDeleteShoes = async (_id: string) => {
  //   setIsDeleteUser(true);
  //   const res = await d(_id);
  //   if (res && res.data) {
  //     message.success("Xóa user thành công");
  //     refreshTable();
  //   } else {
  //     notification.error({
  //       message: "Đã có lỗi xảy ra",
  //       description: res.message,
  //     });
  //   }
  //   setIsDeleteUser(false);
  // };
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
      title: "Song Name",
      dataIndex: "title",
      fieldProps: {
        placeholder: "",
      },
    },
    {
      title: "Release Date",
      dataIndex: "releasedDate",
      valueType: "date",
      fieldProps: {
        placeholder: "",
      },
    },
    {
      title: "Category",
      dataIndex: "category",
    },

    {
      title: "Action",
      hideInSearch: true,
      render: (dom, entity) => (
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
            // onConfirm={() => handleDeleteShoes(entity.id)}
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
        // pagination={{
        //   current: meta.currentPage,
        //   pageSize: meta.itemsPerPage,
        //   showSizeChanger: true,
        //   total: meta.totalPages,
        //   showTotal: (total, range) => (
        //     <div>
        //       {range[0]}-{range[1]} trên {total} rows
        //     </div>
        //   ),
        // }}
        request={async (params, sort, filter) => {
          let query = "";
          if (params) {
            query += `page=${params.current}&limit=${params.pageSize}`;
            if (params.title) {
              query += `&mainText=/${params.title}/i`;
            }
            if (params.category) {
              query += `&brand=/${params.category}/i`;
            }
          }
          if (sort && sort.createdAt) {
            query += `&sort=${
              sort.createdAt === "ascend" ? "createdAt" : "-createdAt"
            }`;
          } else query += `&sort=-createdAt`;
          const res = await getAllSongs(query);
          if (res) {
            setShoesTable(res.items);
            setMeta(res.meta);
          }
          return {
            data: res.items,
            page: 1,
            success: true,
            total: res.meta.totalPages,
          };
        }}
        headerTitle="Table user"
        toolBarRender={() => [
          <Button
            key="import"
            icon={<CloudUploadOutlined />}
            type="primary"
            onClick={() => {
              console.log("Import user data");
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
