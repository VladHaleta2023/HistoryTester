import React from "react";
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { UsersPage } from "./pages/UsersPage.jsx";
import { AddTestPage } from "./pages/AddTestPage.jsx";
import { UpdateTestPage } from "./pages/UpdateTestPage.jsx";
import { AddDataPage } from "./pages/AddDataPage.jsx";
import { TablePage } from "./pages/TablePage.jsx";
import { UpdateDataPage } from "./pages/UpdateDataPage.jsx";
import { TesterPage } from "./pages/TesterPage.jsx";
import { ResultPage } from "./pages/ResultPage.jsx";
import { TesterSettingsPage } from "./pages/TesterSettingsPage.jsx";
import { AdminTestsPage } from "./pages/AdminTestsPage.jsx";
import { UserPage } from "./pages/UserPage.jsx";

function App() {
  return (
    <div className="wrapper">
      <Router>
        <Routes>
          <Route path="/:testId/table/:dataId" element={<UpdateDataPage />} />
          <Route path="/:testId/table/new" element={<AddDataPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/:userId" element={<UserPage />} />
          <Route path="/test/:testId" element={<UpdateTestPage />} />
          <Route path="/:testId/tester" element={<TesterPage />} />
          <Route path="/:testId/result" element={<ResultPage />} />
          <Route path="/:testId/settings" element={<TesterSettingsPage />} />
          <Route path="/:testId/table" element={<TablePage />} />
          <Route path="/new" element={<AddTestPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/admin/tests" element={<AdminTestsPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
