import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCallById,
  getTranscriptByCallId,
} from "../services/api";

type Call = {
  id: number;
  filename: string;
  status: string;
  created_at: string;
};

type Transcript = {
  id: number;
  call_id: number;
  transcript: string;
  sentiment: string;
  summary: string;
  created_at?: string;
};

function CallDetails() {
  const { id } = useParams();

  const [call, setCall] =
    useState<Call | null>(null);

  const [transcript, setTranscript] =
    useState<Transcript | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);

      const callResponse =
        await getCallById(id!);

      setCall(callResponse.data);

      const transcriptResponse =
        await getTranscriptByCallId(
          id!
        );

      setTranscript(
        transcriptResponse.data
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!call) {
    return <h2>Call Not Found</h2>;
  }

  return (
    <>
      <h1>Call Details</h1>

      <div className="card">
        <p>
          <strong>ID:</strong>{" "}
          {call.id}
        </p>

        <p>
          <strong>
            Filename:
          </strong>{" "}
          {call.filename}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {call.status}
        </p>

        <p>
          <strong>
            Uploaded:
          </strong>{" "}
          {new Date(
            call.created_at
          ).toLocaleString()}
        </p>
      </div>

      {transcript && (
        <>
          <div
            className="card"
            style={{
              marginTop: "20px",
            }}
          >
            <h3>Sentiment</h3>

            <p>
              {transcript.sentiment}
            </p>
          </div>

          <div
            className="card"
            style={{
              marginTop: "20px",
            }}
          >
            <h3>Summary</h3>

            <p>
              {transcript.summary}
            </p>
          </div>

          <div
            className="card"
            style={{
              marginTop: "20px",
            }}
          >
            <h3>Transcript</h3>

            <div
              style={{
                whiteSpace:
                  "pre-wrap",
                lineHeight: "1.7",
                maxHeight: "500px",
                overflowY: "auto",
              }}
            >
              {
                transcript.transcript
              }
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default CallDetails;