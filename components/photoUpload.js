// components/photoUpload.js
import { Upload, Button, message, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import axios from "axios";

export default function PhotoUpload({ onUpload }) {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const isImage = (type) => {
    const imageTypes = ["image/jpeg", "image/png", "image/gif"]; // Add more if needed
    return imageTypes.includes(type);
  };

  const handleChange = async (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1); // Limit to one file
    setFileList(newFileList);

    const file = info.file;

    if (!isImage(file.type)) {
      message.error(`${file.name} is not an image file.`);
      setFileList([]);
      return;
    }

    try {
      setUploading(true); // Start the loading indicator

      const formData = new FormData();
      formData.append("photo", file);

      const response = await axios.post(
        "https://upload-photo-comments-server.vercel.app/upload", // Adjust URL to your backend endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onUpload(response.data.data); // Pass uploaded data to parent component
      message.success(`${file.name} uploaded successfully`);
    } catch (error) {
      console.error("Upload failed:", error);
      message.error(`${file.name} upload failed.`);
    } finally {
      setUploading(false); // End the loading indicator
      setFileList([]); // Clear fileList after upload completes or fails
    }
  };

  return (
    <>
      {uploading && (
        <div style={overlayStyle}>
          <Spin size="large" />
        </div>
      )}
      <Upload
        fileList={fileList}
        onChange={handleChange}
        beforeUpload={() => false}
      >
        <Button icon={<UploadOutlined />} disabled={uploading}>
          Select File
        </Button>
      </Upload>
    </>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};
