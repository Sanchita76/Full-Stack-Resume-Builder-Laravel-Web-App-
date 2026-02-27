// import React from "react";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import {BrowserRouter as Router ,Routes,Route} from "react-router-dom";
// import {Toaster} from "react-hot-toast";
// import LandingPage from "./pages/LandingPage";
// import Dashboard from "./pages/Home/Dashboard";
// import EditResume from "./pages/ResumeUpdate/EditResume";
// import UserProvider from "./context/userContext";
// import AdminDashboard from "./pages/Admin/AdminDashboard";
// import UserResumesDashboard from "./pages/Admin/UserResumesDashboard";

// const App = () => {
//   return (
//     <UserProvider>
//     <div>
//       <Router>
//         <Routes>

//           <Route path="/" element={<LandingPage />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/resume/:resumeId" element={<EditResume />} />
//           <Route path="/admin/dashboard" element={<AdminDashboard />} />
//           <Route path="/admin/users/:userId/resumes" element={<UserResumesDashboard />} />
//         </Routes>
//       </Router>
//     </div>
//     <Toaster
//        toastOptions={{
//         className:"",
//         style:{
//           fontSize:"13px"
//         },
//       }}
//       />
//     </UserProvider>
//   );
// };

// export default App;







import React, { useContext } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Home/Dashboard";
import EditResume from "./pages/ResumeUpdate/EditResume";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserResumesDashboard from "./pages/Admin/UserResumesDashboard";

import UserProvider, { UserContext } from "./context/userContext";


/* ---------------- Protected Admin Route ---------------- */

const AdminRoute = ({ children }) => {
  const { user, userloading } = useContext(UserContext);

  // Wait until user loads (important if async)
  if (userloading) {
    return null; // or a loading spinner
  }

  // If not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If not admin
  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};


/* ---------------- Routes Component ---------------- */

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/resume/:resumeId" element={<EditResume />} />

      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users/:userId/resumes"
        element={
          <AdminRoute>
            <UserResumesDashboard />
          </AdminRoute>
        }
      />
    </Routes>
  );
};


/* ---------------- Main App ---------------- */

const App = () => {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>

      <Toaster
        toastOptions={{
          style: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  );
};

export default App;
