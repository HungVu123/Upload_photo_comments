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
    try {
      const response = await axios.get(
        "https://upload-photo-comments-server.vercel.app"
      );
      setPhotos(response.data);
    } catch (error) {
      console.error("Failed to fetch photos:", error);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleUpload = async () => {
    await fetchPhotos();
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Content style={{ padding: "2em", marginTop: "64px" }}>
        <Title level={2}>Photo Upload and Comment</Title>
        <PhotoUpload onUpload={handleUpload} />
        <PhotoList photos={photos} />
      </Content>
      <Footer />
    </Layout>
  );
}
