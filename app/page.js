"use client";

import { useState, useEffect } from "react";
import PhotoUpload from "../components/photoUpload";
import PhotoList from "../components/photoList";
import Header from "../components/header";
import Footer from "../components/footer";
import axios from "axios";
import { Layout, Typography } from "antd";

const { Content } = Layout;
const { Title } = Typography;

export default function Home() {
  const [photos, setPhotos] = useState([]);

  const fetchPhotos = async () => {
    const response = await axios.get("/photos");
    setPhotos(response.data);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleUpload = () => {
    fetchPhotos();
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Content style={{ padding: "2em" }}>
        <Title level={2}>Photo Upload and Comment</Title>
        <PhotoUpload onUpload={handleUpload} />
        <PhotoList photos={photos} />
      </Content>
      <Footer />
    </Layout>
  );
}
