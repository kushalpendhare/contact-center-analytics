import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [calls, setCalls] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const loadCalls = () => {
    axios
      .get("http://localhost:8000/calls")
      .then((res) => setCalls(res.data));
  };

  useEffect(() => {
    loadCalls();

    const interval = setInterval(loadCalls, 5000);

    return () => clearInterval(interval);
  }, []);

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await axios.post(
      "http://localhost:8000/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setFile(null);
    loadCalls();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Contact Center Analytics</h1>

      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />

      <button
        onClick={uploadFile}
        style={{ marginLeft: "10px" }}
      >
        Upload Recording
      </button>

      <hr />

      <h2>Calls</h2>

      {calls.map((call) => (
        <div key={call.id}>
          <strong>{call.filename}</strong>
          {" - "}
          {call.status}
        </div>
      ))}
    </div>
  );
}

export default App;