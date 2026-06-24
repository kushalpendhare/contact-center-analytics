import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import KPICard from "../components/KPICard";
import Header from "../components/Header";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type Metrics = {
  total: number;
  uploaded: number;
  processing: number;
  completed: number;
  failed: number;
};

type Transcript = {
  id: number;
  call_id?: number;
  filename?: string;
  sentiment: string;
};

function Dashboard() {
  const navigate = useNavigate();

  const [metrics, setMetrics] =
    useState<Metrics>({
      total: 0,
      uploaded: 0,
      processing: 0,
      completed: 0,
      failed: 0,
    });

  const [transcripts, setTranscripts] =
    useState<Transcript[]>([]);

  useEffect(() => {
    loadData();

    const interval = setInterval(
      loadData,
      5000
    );

    return () =>
      clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const metricsResponse =
        await api.get("/metrics");

      const transcriptResponse =
        await api.get("/transcripts");

      setMetrics(
        metricsResponse.data
      );

      setTranscripts(
        transcriptResponse.data
      );
    } catch (err) {
      console.error(err);
    }
  };

  const positive =
    transcripts.filter(
      (t) =>
        t.sentiment ===
        "POSITIVE"
    ).length;

  const negative =
    transcripts.filter(
      (t) =>
        t.sentiment ===
        "NEGATIVE"
    ).length;

  const neutral =
    transcripts.filter(
      (t) =>
        t.sentiment ===
        "NEUTRAL"
    ).length;

  const cards = [
    ["Total Calls", metrics.total],
    ["Completed", metrics.completed],
    ["Processing", metrics.processing],
    ["Failed", metrics.failed],
    ["Positive", positive],
    ["Negative", negative],
    ["Neutral", neutral],
  ];

  const sentimentData = [
    {
      name: "Positive",
      value: positive,
    },
    {
      name: "Negative",
      value: negative,
    },
    {
      name: "Neutral",
      value: neutral,
    },
  ];

  const statusData = [
    {
      name: "Uploaded",
      value: metrics.uploaded,
    },
    {
      name: "Processing",
      value: metrics.processing,
    },
    {
      name: "Completed",
      value: metrics.completed,
    },
    {
      name: "Failed",
      value: metrics.failed,
    },
  ];

  const recentAnalytics =
    [...transcripts]
      .slice(-10)
      .reverse();

  return (
    <>
      <Header />

      <h1>Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {cards.map(
          ([title, value]) => (
            <KPICard
              key={String(title)}
              title={String(title)}
              value={Number(value)}
            />
          )
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "20px",
        }}
      >
        <div className="card">
          <h3>
            Sentiment Distribution
          </h3>

          <div
            style={{
              height: "320px",
            }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={sentimentData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#ef4444" />
                  <Cell fill="#f59e0b" />
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3>Call Status</h3>

          <div
            style={{
              height: "320px",
            }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={statusData}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{
          marginTop: "20px",
        }}
      >
        <h3>
          Recent Analytics
        </h3>

        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Call ID</th>
              <th>Sentiment</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {recentAnalytics.map(
              (item) => (
                <tr
                  key={item.id}
                >
                  <td>
                    {item.call_id ??
                      item.id}
                  </td>

                  <td>
                    {item.sentiment}
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        navigate(
                          `/calls/${
                            item.call_id ??
                            item.id
                          }`
                        )
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Dashboard;