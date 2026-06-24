type Props = {
  transcript: any;
};

function TranscriptDrawer({
  transcript,
}: Props) {
  if (!transcript) return null;

  return (
    <div
      className="card"
      style={{
        marginTop: "20px",
      }}
    >
      <h2>
        {transcript.filename}
      </h2>

      <p>
        <b>Sentiment:</b>{" "}
        {transcript.sentiment}
      </p>

      <p>
        <b>Summary:</b>{" "}
        {transcript.summary}
      </p>

      <div
        style={{
          background: "#fffaf0",
          padding: "15px",
          borderRadius: "10px",
          maxHeight: "300px",
          overflowY: "auto",
        }}
      >
        {transcript.transcript}
      </div>
    </div>
  );
}

export default TranscriptDrawer;