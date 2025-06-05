import { useEffect, useState } from "react";
import {
  getAllUsersAPI,
  getAllSongs,
  getAllArtistsAPI,
  getAllKaraokesAPI,
  getAllGenresAPI,
  getAllPlaylistsAPI,
} from "@/services/api";
import { Card, Col, Row } from "antd";
import CountUp from "react-countup";
import { Column } from "@ant-design/charts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    songs: 0,
    artists: 0,
    karaokes: 0,
    genres: 0,
    playlists: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, songRes, artistRes, karaokeRes, genreRes, playlistRes] =
          await Promise.all([
            getAllUsersAPI({}),
            getAllSongs(),
            getAllArtistsAPI(1),
            getAllKaraokesAPI(),
            getAllGenresAPI(),
            getAllPlaylistsAPI(),
          ]);

        setStats({
          users: userRes?.items?.length || 0,
          songs: songRes?.data?.length || 0,
          artists: artistRes?.items?.length || 0,
          karaokes: karaokeRes?.data?.length || 0,
          genres: genreRes?.data?.length || 0,
          playlists: playlistRes?.length || 0,
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const renderCard = (title: string, value: number) => (
    <Card title={title} bordered={false}>
      <p style={{ fontSize: 32, fontWeight: "bold", margin: 0 }}>
        <CountUp end={value} duration={1.2} separator="," />
      </p>
    </Card>
  );

  const chartData = [
    { type: "Users", value: stats.users },
    { type: "Songs", value: stats.songs },
    { type: "Artists", value: stats.artists },
    { type: "Karaokes", value: stats.karaokes },
    { type: "Genres", value: stats.genres },
    { type: "Playlists", value: stats.playlists },
  ];

  const config = {
    data: chartData,
    xField: "type",
    yField: "value",
    columnWidthRatio: 0.6,
    label: {
      position: "top",
      style: {
        fill: "#000",
        fontSize: 14,
      },
    },
    height: 300,
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        {Object.entries(stats).map(([key, value]) => (
          <Col key={key} xs={24} sm={12} md={12} lg={6}>
            {renderCard(`Tổng ${key}`, value)}
          </Col>
        ))}
      </Row>

      <Card style={{ marginTop: 32 }} title="Biểu đồ thống kê tổng quan">
        <Column {...config} />
      </Card>
    </div>
  );
};

export default AdminDashboard;
