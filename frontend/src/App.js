import React from 'react';
import '@fontsource-variable/nunito-sans';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./app.css";
import ProtectedRoute from "./routes/ProtectedRoute";
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Login from "./pages/Auth/login";
import ForgotPassword from "./pages/Auth/Forgot";
import ResetCode from "./pages/Auth/SendCode";
import MyMission from './pages/missions/myMissions';
import MissionToApprove from './pages/missions/missionToApprove';
import MissionPaymentList from './pages/missions/missionPaymentList';
import MissionReports from './pages/missions/missionReports';
import MissionPaymentBatch from './pages/missions/missionPaymentBatch';
import UploadMissionReport from './pages/missions/submitReport';
import MissionPaymentBatchDetails from './pages/missions/missionPaymentBatchDetails';
import MissionFeeComputationDetails from './pages/missions/missionFeeComputationDetails';
import MissionRecordHistory from './pages/missions/missionRecordHistory';
import MissionForm from './pages/missions/missionForm';
import MissionReviewForm from './pages/missions/missionReview';
import NotFoundPage from './components/errorPage';
import MissionClaimRefund from './pages/missions/missionClaimPage';
import ReviewMissionReportPage from './pages/missions/ReviewMissionReportPage';
import ReviewMissionReportApproverPage from './pages/missions/ReviewMissionReportPageApprover';
import MissionReviewPersonalPage from './pages/missions/missionReviewPersonal';
import { DrawerProvider } from './context/DrawerContext';
import WelcomePage from './pages/missions/welcomePage';
import MissionAllowanceComputation from './pages/missions/missionAllowanceComputationTable';
import RestrictedAccess from './components/restrictedAccess';
import TravelClearancePage from './pages/missions/TravelClearance';
import ProtectedRouteApproval from './routes/ProtectedRouteApproval';
import ProtectedRouteReports from './routes/ProtectedRouteReports';
import ProtectedRouteCompute from './routes/ProtectedRouteCompute';
import ProtectedRoutePayment from './routes/ProtectedRoutePayment';
import NomLogin from './pages/Auth/nomlogin';

function App() {

  return (
    <Provider store={store}>
      <DrawerProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/frmnom" element={<NomLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetCode />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <WelcomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-missions"
              element={
                <ProtectedRoute>
                  <MyMission />
                </ProtectedRoute>
              }
            />
            <Route
              path="/missions-for-approval"
              element={
                <ProtectedRouteApproval>
                  <MissionToApprove />
                </ProtectedRouteApproval>
              }
            />
            <Route
              path="/missions-allowance-computation"
              element={
                <ProtectedRouteCompute>
                  <MissionAllowanceComputation />
                </ProtectedRouteCompute>
              }
            />
            <Route
              path="/mission-payments"
              element={
                <ProtectedRoutePayment>
                  <MissionPaymentList />
                </ProtectedRoutePayment>
              }
            />
            <Route
              path="/generate-mission-reports"
              element={
                <ProtectedRouteReports>
                  <MissionReports />
                </ProtectedRouteReports>
              }
            />
            <Route
              path="/mission-batch"
              element={
                <ProtectedRoutePayment>
                  <MissionPaymentBatch />
                </ProtectedRoutePayment>
              }
            />
            <Route
              path="/upload-report"
              element={
                <ProtectedRoute>
                  <UploadMissionReport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mission-payment-batch-details"
              element={
                <ProtectedRoutePayment>
                  <MissionPaymentBatchDetails />
                </ProtectedRoutePayment>
              }
            />
            <Route
              path="/mission-fee-computation-details"
              element={
                <ProtectedRouteCompute>
                  <MissionFeeComputationDetails />
                </ProtectedRouteCompute>
              }
            />
            <Route
              path="/mission-record-history"
              element={
                <ProtectedRoute>
                  <MissionRecordHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mission-form"
              element={
                <ProtectedRoute>
                  <MissionForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mission-review"
              element={
                <ProtectedRouteApproval>
                  <MissionReviewForm />
                </ProtectedRouteApproval>
              }
            />
            <Route
              path="/my-mission-review"
              element={
                <ProtectedRoute>
                  <MissionReviewPersonalPage/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/claim-refund"
              element={
                <ProtectedRoute>
                  <MissionClaimRefund />
                </ProtectedRoute>
              }
            />
            <Route
              path="/review-mission-report"
              element={
                <ProtectedRoute>
                  <ReviewMissionReportPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/approver-review-mission-report"
              element={
                <ProtectedRouteApproval>
                  <ReviewMissionReportApproverPage />
                </ProtectedRouteApproval>
              }
            />

            <Route
              path="/travel-clearance"
              element={
                <ProtectedRoute>
                  <TravelClearancePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/restrictedAccess"
              element={
                <ProtectedRoute>
                  <RestrictedAccess />
                </ProtectedRoute>
              }
            />

            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </DrawerProvider>
    </Provider>
  );
}

export default App;
