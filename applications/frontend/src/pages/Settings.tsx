import MainLayout from "../layouts/MainLayout";

function Settings() {
  return (
    <MainLayout>
      <section className="page-header">
        <div>
          <p className="eyebrow">Workspace controls</p>
          <h1>Settings</h1>
          <p className="page-subtitle">
            Local application settings will live here before production identity is introduced.
          </p>
        </div>
      </section>

      <section className="panel">
        <h2>Local MVP Mode</h2>
        <p className="muted">
          Authentication and tenant isolation are intentionally not enabled yet. The current build
          is focused on one local workspace with working API, database, and cache integration.
        </p>
      </section>
    </MainLayout>
  );
}

export default Settings;
