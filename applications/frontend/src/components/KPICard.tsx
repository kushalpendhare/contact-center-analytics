type Props = {
  title: string;
  value: number;
};

function KPICard({
  title,
  value,
}: Props) {
  return (
    <div className="card">
      <div
        style={{
          color: "#92400e",
          fontWeight: 600,
          marginBottom: "10px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "32px",
          fontWeight: "bold",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default KPICard;