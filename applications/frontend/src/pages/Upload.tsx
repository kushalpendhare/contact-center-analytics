import { useState } from "react";
import { api } from "../services/api";

function Upload() {
  const [file, setFile] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [progress, setProgress] =
    useState(0);

  const uploadFile = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setProgress(0);

      const formData = new FormData();

      formData.append("file", file);

      await api.post(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },

          onUploadProgress: (
            progressEvent
          ) => {
            const percent =
              Math.round(
                (progressEvent.loaded *
                  100) /
                  (progressEvent.total ||
                    1)
              );

            setProgress(percent);
          },
        }
      );

      setMessage(
        "✅ Recording uploaded successfully"
      );

      setFile(null);
      setProgress(100);
    } catch (err) {
      console.error(err);

      setMessage(
        "❌ Upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();

    if (
      e.dataTransfer.files &&
      e.dataTransfer.files.length > 0
    ) {
      setFile(
        e.dataTransfer.files[0]
      );
    }
  };

  return (
    <>
      <h1>Upload Recording</h1>

      <div className="card">
        {message && (
          <div
            style={{
              background:
                message.startsWith(
                  "✅"
                )
                  ? "#dcfce7"
                  : "#fee2e2",
              color:
                message.startsWith(
                  "✅"
                )
                  ? "#166534"
                  : "#991b1b",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontWeight: 600,
            }}
          >
            {message}
          </div>
        )}

        <div
          onDragOver={(e) =>
            e.preventDefault()
          }
          onDrop={handleDrop}
          style={{
            border:
              "2px dashed #d4a017",
            borderRadius: "12px",
            padding: "40px",
            textAlign: "center",
            marginBottom: "20px",
            background:
              "#fffdf7",
          }}
        >
          <p>
            Drag & Drop Recording
            Here
          </p>

          <p>or</p>

          <input
            type="file"
            onChange={(e) =>
              setFile(
                e.target.files?.[0] ||
                  null
              )
            }
          />
        </div>

        {file && (
          <div
            style={{
              padding: "12px",
              background:
                "#f8fafc",
              borderRadius: "8px",
              marginBottom: "15px",
            }}
          >
            <strong>
              Selected:
            </strong>{" "}
            {file.name}
          </div>
        )}

        {uploading && (
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                height: "12px",
                background:
                  "#e5e7eb",
                borderRadius: "999px",
                overflow:
                  "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background:
                    "#d4a017",
                  transition:
                    "0.3s",
                }}
              />
            </div>

            <div
              style={{
                marginTop: "8px",
              }}
            >
              {progress}%
            </div>
          </div>
        )}

        <button
          onClick={uploadFile}
          disabled={
            uploading || !file
          }
        >
          {uploading
            ? "Uploading..."
            : "Upload Recording"}
        </button>
      </div>
    </>
  );
}

export default Upload;