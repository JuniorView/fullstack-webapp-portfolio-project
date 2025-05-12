import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {Provider} from "react-redux";
import { store } from "./redux/store.jsx";
import Error from "./components/Error/Error";
import About from "./pages/About/About";
import SearchPatient from "./pages/SearchPatient/SearchPatient";
import Profile from "./components/Profile/Profile";
import Signin from "./pages/Signin/Signin";
import RegisterPatient from "./pages/RegisterPatient/RegisterPatient";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RegisterDoctor from "./pages/RegisterDoctor/RegisterDoctor";
import SearchDoctor from "./pages/SearchDoctor/SearchDoctor";
import Layout from "./Layout";
import "./index.css";
import AdminPanel from "./pages/AdminPanel/AdminPanel.jsx";

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/searchpatient",
        element: <SearchPatient />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/registerpatient",
        element: <RegisterPatient />,
      },
      {
        path: "/registerdoctor",
        element: <RegisterDoctor />,
      },
      {
        path: "/searchdoctor",
        element: <SearchDoctor />,
      },
      {
        path: "/adminpanel",
        element: <AdminPanel />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>

  // </React.StrictMode>,
);
