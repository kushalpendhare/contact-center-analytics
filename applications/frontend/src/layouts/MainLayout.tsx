import Sidebar from "../components/Sidebar";

type Props = {
  children: React.ReactNode;
};

function MainLayout({ children }: Props) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: "20px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default MainLayout;