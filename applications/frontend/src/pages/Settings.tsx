import MainLayout from "../layouts/MainLayout";
import { getStoredUser } from "../services/authService";

function Settings() {
  const user = getStoredUser();

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
        <h2>Workspace</h2>
        <p className="muted">
          {user?.tenant.name ?? "Local Workspace"} is the active tenant for this browser session.
          Projects are now scoped to this workspace.
        </p>
      </section>
    </MainLayout>
  );
}

export default Settings;
