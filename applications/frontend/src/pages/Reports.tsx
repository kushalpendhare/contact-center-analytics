import MainLayout from "../layouts/MainLayout";

function Reports() {
  return (
    <MainLayout>
      <section className="page-header">
        <div>
          <p className="eyebrow">Customer outputs</p>
          <h1>Reports</h1>
          <p className="page-subtitle">
            Reporting will use project data to create engineering summaries and deliverables.
          </p>
        </div>
      </section>

      <section className="panel empty-state">
        <h2>No reports generated</h2>
        <p>Reports will appear here after project analysis modules are added.</p>
      </section>
    </MainLayout>
  );
}

export default Reports;
