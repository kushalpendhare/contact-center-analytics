import { useEffect, useState } from "react";
import { api } from "../services/api";
import TranscriptDrawer from "../components/TranscriptDrawer";

type Transcript = {
  id: number;
  filename: string;
  transcript: string;
  sentiment: string;
  summary: string;
};

function Analytics() {
  const [transcripts, setTranscripts] =
    useState<Transcript[]>([]);

  const [selected, setSelected] =
    useState<Transcript | null>(
      null
    );

  const [search, setSearch] =
    useState("");

  const [sentiment, setSentiment] =
    useState("ALL");

  useEffect(() => {
    loadTranscripts();

    const interval = setInterval(
      loadTranscripts,
      15000
    );

    return () =>
      clearInterval(interval);
  }, []);

  const loadTranscripts =
    async () => {
      try {
        const response =
          await api.get(
            "/transcripts"
          );

        setTranscripts(
          response.data
        );
      } catch (err) {
        console.error(err);
      }
    };

  const filteredTranscripts =
    transcripts
      .filter((item) =>
        item.filename
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
      )
      .filter((item) =>
        sentiment === "ALL"
          ? true
          : item.sentiment ===
            sentiment
      );

  return (
    <>
      <h1>Analytics</h1>

      <div className="card">
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <input
            placeholder="Search filename..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            style={{
              flex: 1,
              padding: "10px",
            }}
          />

          <select
            value={sentiment}
            onChange={(e) =>
              setSentiment(
                e.target.value
              )
            }
            style={{
              padding: "10px",
            }}
          >
            <option value="ALL">
              All
            </option>

            <option value="POSITIVE">
              Positive
            </option>

            <option value="NEGATIVE">
              Negative
            </option>

            <option value="NEUTRAL">
              Neutral
            </option>
          </select>
        </div>

        {filteredTranscripts.length ===
        0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
            }}
          >
            No transcripts found
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    width: "25%",
                  }}
                >
                  File
                </th>

                <th
                  style={{
                    width: "15%",
                  }}
                >
                  Sentiment
                </th>

                <th
                  style={{
                    width: "60%",
                  }}
                >
                  Summary
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredTranscripts.map(
                (item) => (
                  <tr
                    key={item.id}
                    style={{
                      cursor:
                        "pointer",
                    }}
                    onClick={() =>
                      setSelected(
                        item
                      )
                    }
                  >
                    <td>
                      {
                        item.filename
                      }
                    </td>

                    <td>
                      {
                        item.sentiment
                      }
                    </td>

                    <td>
                      {item.summary
                        ?.length > 100
                        ? item.summary.substring(
                            0,
                            100
                          ) + "..."
                        : item.summary}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>

      <TranscriptDrawer
        transcript={selected}
      />
    </>
  );
}

export default Analytics;