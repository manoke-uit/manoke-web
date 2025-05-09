import {
  CloudUploadOutlined,
  DeleteTwoTone,
  EditTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { App, Button, Popconfirm } from "antd";
import { useRef, useState } from "react";

type TSearch = {
  fullName: string;
  email: string;
  createdAt: string;
  createdAtRange: string;
};

const TableOrders = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);

  const [isDeleteUser, setIsDeleteUser] = useState(false);

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });

  const columns: ProColumns<IUserTable>[] = [
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
      title: "Full Name",
      dataIndex: "fullName",
      fieldProps: {
        placeholder: "",
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      copyable: true,
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
          />
          <DeleteTwoTone twoToneColor="#ff4d4f" style={{ cursor: "pointer" }} />
        </>
      ),
    },
  ];

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  return (
    <>
      <ProTable<IUserTable, TSearch>
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
          return <div>he</div>;
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
              console.log("Add new user");
            }}
          >
            Add new
          </Button>,
        ]}
      />
    </>
  );
};

export default TableOrders;
