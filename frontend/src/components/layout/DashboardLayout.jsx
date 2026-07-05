import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        <TopNavbar />
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;