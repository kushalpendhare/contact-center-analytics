import MainLayout from "../layouts/MainLayout";

function Uploads() {
  return (
    <MainLayout>
      <section className="page-header">
        <div>
          <p className="eyebrow">Project inputs</p>
          <h1>Uploads</h1>
          <p className="page-subtitle">
            Upload workflows will be connected to project-specific files in the next phase.
          </p>
        </div>
      </section>

      <section className="panel empty-state">
        <h2>No upload pipeline yet</h2>
        <p>Recordings, SIP traces, and transcripts will attach to individual projects.</p>
      </section>
    </MainLayout>
  );
}

export default Uploads;
