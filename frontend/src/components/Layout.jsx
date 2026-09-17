import Sidebar from "./Sidebar.jsx";

export default function Layout({ title, children }) {
  return (
    <div className="shell">
      <Sidebar />
      <main className="main">
        <h1 className="page-title">{title}</h1>
        {children}
      </main>
    </div>
  );
}
