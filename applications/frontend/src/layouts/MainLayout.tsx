import Sidebar from "../components/Sidebar";

type Props = {
  children: React.ReactNode;
};

function MainLayout({ children }: Props) {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
