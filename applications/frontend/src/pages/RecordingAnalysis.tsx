import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getRecordingDetail, analyzeRecording } from "../services/recordingService";
import type { RecordingDetail } from "../services/recordingService";

function RecordingDetailPage() {
  const { projectId, recordingId } = useParams();
  const [detail, setDetail] = useState<RecordingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const projectIdNum = projectId ? parseInt(projectId, 10) : 0;
  const recordingIdNum = recordingId ? parseInt(recordingId, 10) : 0;

  useEffect(() => {
    if (!projectIdNum || !recordingIdNum) return;

    const loadDetail = async () => {
      setLoading(true);
      try {
        const data = await getRecordingDetail(projectIdNum, recordingIdNum);
        setDetail(data);
        setError("");
      } catch {
        setError("Unable to load recording details.");
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [projectIdNum, recordingIdNum]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError("");
    try {
      const analysis = await analyzeRecording(projectIdNum, recordingIdNum);
      setDetail({
        ...detail!,
        analysis,
      });
    } catch {
      setError("Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <p>Loading recording...</p>
      </MainLayout>
    );
  }

  if (!detail) {
    return (
      <MainLayout>
        <div className="alert">Recording not found</div>
      </MainLayout>
    );
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "#15803d";
      case "neutral":
        return "#0f172a";
      case "negative":
        return "#dc2626";
      default:
        return "#2563eb";
    }
  };

  return (
    <MainLayout>
      <section className="page-header">
        <div>
          <p className="eyebrow">Call Recording</p>
          <h1>{detail.recording.name}</h1>
          <p className="page-subtitle">
            Review and analyze this call recording.
          </p>
        </div>
        <Link className="button secondary" to={`/projects/${projectId}/recordings`}>
          Back to Recordings
        </Link>
      </section>

      {error && <div className="alert">{error}</div>}

      <section className="content-grid">
        <div className="panel">
          <h2>Recording Details</h2>
          <div className="details-grid">
            <div>
              <strong>Status</strong>
              <p
                style={{
                  color: detail.recording.status === "completed" ? "#15803d" : "#ea580c",
                  textTransform: "capitalize",
                  fontWeight: "bold",
                }}
              >
                {detail.recording.status}
              </p>
            </div>
            <div>
              <strong>Duration</strong>
              <p>{detail.recording.duration_seconds ? `${detail.recording.duration_seconds.toFixed(1)}s` : "N/A"}</p>
            </div>
            <div>
              <strong>Uploaded</strong>
              <p>{new Date(detail.recording.created_at).toLocaleString()}</p>
            </div>
            <div>
              <strong>Recording ID</strong>
              <p>{detail.recording.id}</p>
            </div>
          </div>
        </div>

        {detail.analysis ? (
          <div className="panel">
            <h2>AI Analysis</h2>
            <div className="analysis-grid">
              <div className="analysis-card">
                <strong>Sentiment</strong>
                <p
                  style={{
                    color: getSentimentColor(detail.analysis.sentiment),
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    fontSize: "18px",
                  }}
                >
                  {detail.analysis.sentiment}
                </p>
              </div>
              <div className="analysis-card">
                <strong>Agent Score</strong>
                <p
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: detail.analysis.agent_score >= 80 ? "#15803d" : "#ea580c",
                  }}
                >
                  {detail.analysis.agent_score.toFixed(0)}/100
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="panel">
            <h2>Run Analysis</h2>
            <p className="muted">This recording hasn't been analyzed yet.</p>
            <button
              className="button primary"
              onClick={handleAnalyze}
              disabled={analyzing}
              style={{ marginTop: "10px" }}
            >
              {analyzing ? "Analyzing..." : "Run AI Analysis"}
            </button>
          </div>
        )}
      </section>

      {detail.analysis && (
        <>
          <section className="panel">
            <h2>Summary</h2>
            <p>{detail.analysis.summary}</p>
          </section>

          <section className="content-grid">
            <div className="panel">
              <h2>Keywords</h2>
              <div className="keyword-list">
                {detail.analysis.keywords.length > 0 ? (
                  detail.analysis.keywords.map((keyword) => (
                    <span key={keyword} className="keyword-tag">
                      {keyword}
                    </span>
                  ))
                ) : (
                  <p className="muted">No keywords identified</p>
                )}
              </div>
            </div>

            <div className="panel">
              <h2>Compliance</h2>
              <div>
                <p>
                  <strong>PII Detected:</strong>{" "}
                  <span style={{ color: detail.analysis.compliance_flags.pii_detected ? "#dc2626" : "#15803d" }}>
                    {detail.analysis.compliance_flags.pii_detected ? "Yes" : "No"}
                  </span>
                </p>
                {detail.analysis.compliance_flags.regulatory_issues.length > 0 && (
                  <div>
                    <strong>Issues:</strong>
                    <ul>
                      {detail.analysis.compliance_flags.regulatory_issues.map((issue) => (
                        <li key={issue}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>Transcript</h2>
            {detail.transcript ? (
              <div className="transcript-text">{detail.transcript.text}</div>
            ) : (
              <p className="muted">Transcript not available</p>
            )}
          </section>
        </>
      )}
    </MainLayout>
  );
}

export default RecordingDetailPage;
