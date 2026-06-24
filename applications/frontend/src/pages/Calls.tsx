import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

type Call = {
  id: number;
  filename: string;
  status: string;
  created_at: string;
};

function Calls() {
  const navigate = useNavigate();

  const [calls, setCalls] = useState<Call[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  useEffect(() => {
    loadCalls();

    const interval = setInterval(
      loadCalls,
      5000
    );

    return () =>
      clearInterval(interval);
  }, []);

  const loadCalls = async () => {
    try {
      const response =
        await api.get("/calls");

      setCalls(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCalls = [...calls]
    .sort((a, b) => b.id - a.id)
    .filter((call) =>
      call.filename
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((call) =>
      status === "ALL"
        ? true
        : call.status === status
    );

  const getStatusColor = (
    status: string
  ) => {
    switch (status) {
      case "COMPLETED":
        return "#22c55e";

      case "FAILED":
        return "#ef4444";

      case "PROCESSING":
        return "#f59e0b";

      default:
        return "#3b82f6";
    }
  };

  return (
    <>
      <h1>Calls</h1>

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
            value={status}
            onChange={(e) =>
              setStatus(
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

            <option value="UPLOADED">
              Uploaded
            </option>

            <option value="PROCESSING">
              Processing
            </option>

            <option value="COMPLETED">
              Completed
            </option>

            <option value="FAILED">
              Failed
            </option>
          </select>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
          }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Filename</th>
              <th>Status</th>
              <th>Uploaded</th>
            </tr>
          </thead>

          <tbody>
            {filteredCalls.map(
              (call) => (
                <tr
                  key={call.id}
                  onClick={() =>
                    navigate(
                      `/calls/${call.id}`
                    )
                  }
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <td>
                    {call.id}
                  </td>

                  <td>
                    {call.filename}
                  </td>

                  <td>
                    <span
                      style={{
                        background:
                          getStatusColor(
                            call.status
                          ),
                        color:
                          "white",
                        padding:
                          "6px 12px",
                        borderRadius:
                          "20px",
                        fontWeight:
                          "bold",
                      }}
                    >
                      {call.status}
                    </span>
                  </td>

                  <td>
                    {new Date(
                      call.created_at
                    ).toLocaleString()}
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

export default Calls;