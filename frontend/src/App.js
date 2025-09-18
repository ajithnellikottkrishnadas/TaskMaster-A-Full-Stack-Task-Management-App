import GetTasks from "./task/GetTasks.jsx";
import AddTask from "./task/AddTask.jsx";
import UpdateTask from "./task/updateTask.jsx";
import Login from "./home/Login.jsx";
import Register from "./home/Register.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header.jsx";



function App() {
  const route = createBrowserRouter([
     { path: "/", element: <Login /> },
     { path: "/register", element: <Register /> },
    { path: "/tasks", element: <GetTasks /> },
    { path: "/addTask", element: <AddTask /> },
   { path: "/updateTask/:id", element: <UpdateTask /> },
  ]);
  return (
    <div>
      <Header />
      <RouterProvider router={route} />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
