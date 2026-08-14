import Navbar from "./Navbar";

const TaskLayout = ({ children }) => {
  return (
    <div className="min-vh-100 dashboard-bg">
      <Navbar />
      <main className="container py-4 py-md-5">{children}</main>
    </div>
  );
};

export default TaskLayout;
