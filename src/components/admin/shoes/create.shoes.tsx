import { useEffect, useState } from "react";
import {
  App,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Upload,
  UploadFile,
} from "antd";
import type { FormProps, GetProp, UploadProps } from "antd";
import {
  createShoesAPI,
  getBrands,
  getCategories,
  uploadFileAPI,
} from "@/services/api";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import { UploadChangeParam } from "antd/es/upload";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  mainText: string;
  brand: string;
  price: number;
  quantity: number;
  thumbnail: any;
  slider: any;
  category: string;
};

const CreateShoes = (props: IProps) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const { message, notification } = App.useApp();
  type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

  type UserUploadType = "thumbnail" | "slider";
  // https://ant.design/components/form#components-form-demo-control-hooks
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
  const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);
  const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
  const [loadingSlider, setLoadingSlider] = useState<boolean>(false);
  const [listCategory, setListCategory] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [listBrands, setListBrands] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getCategories();
      if (res && res.data) {
        const d = res.data.map((item) => {
          return {
            label: item,
            value: item,
          };
        });
        setListCategory(d);
      }
    };
    const fetchBrand = async () => {
      const res = await getBrands();
      if (res && res.data) {
        const d = res.data.map((item) => {
          return {
            label: item,
            value: item,
          };
        });
        setListBrands(d);
      }
    };
    fetchCategory();
    fetchBrand();
  }, []);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { mainText, brand, price, quantity, category } = values;
    const thumbnail = fileListThumbnail?.[0]?.name ?? "";
    const slider = fileListSlider?.map((item) => item.name) ?? [];
    setIsSubmit(true);
    const res = await createShoesAPI(
      mainText,
      brand,
      price,
      quantity,
      category,
      thumbnail,
      slider
    );
    if (res && res.data) {
      message.success("Tạo mới shoes thành công");
      setFileListSlider([]);
      setFileListThumbnail([]);
      form.resetFields();
      setOpenModalCreate(false);
      refreshTable();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleUploadFile = async (
    options: RcCustomRequestOptions,
    type: UserUploadType
  ) => {
    const { onSuccess } = options;
    const file = options.file as UploadFile;
    const res = await uploadFileAPI(file, "shoes");
    if (res && res.data) {
      const uploadedFile: any = {
        uid: `${new Date().getTime()}-${Math.random()}`,
        name: res.data.fileName,
        status: "done",
        url: `${import.meta.env.VITE_BACKEND_URL}/images/shoes/${
          res.data.fileName
        }`,
      };
      if (type === "thumbnail") {
        setFileListThumbnail([{ ...uploadedFile }]);
      } else {
        setFileListSlider((prevState) => [...prevState, { ...uploadedFile }]);
      }

      if (onSuccess) onSuccess("ok");
    } else {
      message.error(res.message);
    }
  };
  const handleChange = (info: UploadChangeParam, type: UserUploadType) => {
    if (info.file.status === "uploading") {
      type === "slider" ? setLoadingSlider(true) : setLoadingThumbnail(true);
      return;
    }

    if (info.file.status === "done") {
      type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
    }
  };

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  const handleRemove = (file: UploadFile, type: UserUploadType) => {
    if (type === "thumbnail") {
      setFileListThumbnail([]);
    } else {
      const slider = fileListSlider.filter((item) => item.uid !== file.uid);
      setFileListSlider(slider);
    }
  };
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  return (
    <>
      <Modal
        title="Thêm mới người dùng"
        open={openModalCreate}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setOpenModalCreate(false);
          setFileListSlider([]);
          setFileListThumbnail([]);
          form.resetFields();
        }}
        okText={"Tạo mới"}
        cancelText={"Hủy"}
        confirmLoading={isSubmit}
      >
        <Divider />

        <Form
          form={form}
          name="basic"
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            labelCol={{ span: 24 }}
            label="MainText"
            name="mainText"
            rules={[{ required: true, message: "Vui lòng nhập tên hiển thị!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            labelCol={{ span: 24 }}
            label="Brand"
            name="brand"
            rules={[{ required: true, message: "Vui lòng chọn hang giay!" }]}
          >
            <Select showSearch allowClear options={listBrands} />
          </Form.Item>
          <Form.Item<FieldType>
            labelCol={{ span: 24 }}
            label="Price"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập gia!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            labelCol={{ span: 24 }}
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Vui lòng nhập số luong!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            labelCol={{ span: 24 }}
            label="Category"
            name="category"
            rules={[{ required: true, message: "Vui lòng chọn thể loại!" }]}
          >
            <Select showSearch allowClear options={listCategory} />
          </Form.Item>
          <Form.Item<FieldType>
            label="Thumbnail"
            name="thumbnail"
            rules={[{ required: true, message: "Vui lòng upload thumbnail!" }]}
          >
            <Upload
              listType="picture-card"
              className="thumbnail-uploader"
              maxCount={1}
              multiple={false}
              onPreview={handlePreview}
              beforeUpload={beforeUpload}
              customRequest={(options) =>
                handleUploadFile(options, "thumbnail")
              }
              fileList={fileListThumbnail}
              onChange={(info) => handleChange(info, "thumbnail")}
              onRemove={(file) => handleRemove(file, "thumbnail")}
            >
              <div>
                {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item<FieldType>
            label="Slider"
            name="slider"
            rules={[{ required: true, message: "Vui lòng upload slider!" }]}
            getValueFromEvent={normFile}
          >
            <Upload
              listType="picture-card"
              className="slider-uploader"
              multiple={true}
              onPreview={handlePreview}
              beforeUpload={beforeUpload}
              customRequest={(options) => handleUploadFile(options, "slider")}
              fileList={fileListSlider}
              onChange={(info) => handleChange(info, "slider")}
              onRemove={(file) => handleRemove(file, "slider")}
            >
              <div>
                {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default CreateShoes;
