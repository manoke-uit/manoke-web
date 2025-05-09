import { deleteShoesAPI, getAllUsersAPI, getShoesAPI } from "@/services/api";
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
import CreateShoes from "./create.shoes";
import UpdateShoes from "./update.shoes";

type TSearch = {
  mainText?: string;
  brand?: string;
  createdAt?: string;
  createdAtRange?: string;
};

const TableShoes = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [shoesTable, setShoesTable] = useState<IShoesTable[]>([]);
  const [isDeleteUser, setIsDeleteUser] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<IShoesTable | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });
  const handleDeleteShoes = async (_id: string) => {
    setIsDeleteUser(true);
    const res = await deleteShoesAPI(_id);
    if (res && res.data) {
      message.success("Xóa user thành công");
      refreshTable();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
    setIsDeleteUser(false);
  };
  const columns: ProColumns<IShoesTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "Id",
      dataIndex: "_id",
      hideInSearch: true,
    },
    {
      title: "Shoes Name",
      dataIndex: "mainText",
      fieldProps: {
        placeholder: "",
      },
    },
    {
      title: "Brand",
      dataIndex: "brand",
      fieldProps: {
        placeholder: "",
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAtRange",
      valueType: "dateRange",
      hideInTable: true,
      fieldProps: {
        placeholder: ["Start date", "End date"],
      },
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
            title={"Xác nhận xóa user"}
            description={"Bạn có chắc chắn muốn xóa user này ?"}
            onConfirm={() => handleDeleteShoes(entity._id)}
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
      <ProTable<IShoesTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => (
            <div>
              {range[0]}-{range[1]} trên {total} rows
            </div>
          ),
        }}
        request={async (params, sort, filter) => {
          let query = "";
          if (params) {
            query += `page=${params.current}&limit=${params.pageSize}`;
            if (params.mainText) {
              query += `&mainText=/${params.mainText}/i`;
            }
            if (params.brand) {
              query += `&brand=/${params.brand}/i`;
            }
            const createDateRange = dateRangeValidate(params.createdAtRange);
            if (createDateRange) {
              query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
            }
          }
          if (sort && sort.createdAt) {
            query += `&sort=${
              sort.createdAt === "ascend" ? "createdAt" : "-createdAt"
            }`;
          } else query += `&sort=-createdAt`;
          const res = await getShoesAPI(query);
          if (res && res.data) {
            setShoesTable(res.data.result);
            setMeta(res.data.meta);
          }
          return {
            data: res.data?.result,
            page: 1,
            success: true,
            total: res.data?.meta.total,
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
      <CreateShoes
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />
      <UpdateShoes
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        refreshTable={refreshTable}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default TableShoes;
