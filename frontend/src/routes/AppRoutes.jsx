import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "../pages/Landing/Landing";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ForgotPassword from "../pages/Auth/ForgotPassword";

import ProtectedRoute from "../components/common/ProtectedRoute";
import Home from "../pages/Home/Home";
import Health from "../pages/Health/Health";
import Reminders from "../pages/Reminders/Reminders";
import History from "../pages/History/History";
import Profile from "../pages/Profile/Profile";
import PrescriptionUpload from "../pages/PrescriptionUpload/PrescriptionUpload";

import Session from "../pages/Session/Session";

function AppRoutes() {
	return (
		<Routes>
			{/* Public */}
			<Route path="/" element={<Landing />} />
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />
			<Route path="/forgot-password" element={<ForgotPassword />} />

			{/* Application */}
			<Route element={<ProtectedRoute />}>
				<Route path="/app/home" element={<Home />} />
				<Route path="/app/health" element={<Health />} />
				<Route path="/app/reminders" element={<Reminders />} />
				<Route path="/app/history" element={<History />} />
				<Route path="/app/profile" element={<Profile />} />
				<Route path="/app/session" element={<Session />} />
				<Route
					path="/app/prescription-upload"
					element={<PrescriptionUpload />}
				/>
			</Route>

			{/* Fallback */}
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}

export default AppRoutes;
