import { combineReducers } from 'redux';
import userReducer from './slices/userSlice';
import missionReducer from './slices/missionSlice';
import missionApprovalReducer from './slices/missionForApprovalSlice';
import notificationReducer from './slices/notificationSlice';
import employeesReducer from './slices/employeeSlice';
import missionComputationReducer from './slices/missionForComputationSlice';
import missionComputationForPaymentBatchReducer from './slices/missionComputationForPaymentBatchReducer';
import missionReports from './slices/missionReports';


const appReducer = combineReducers({
  user: userReducer,
  myMissions: missionReducer,
  approvalMissions: missionApprovalReducer,
  computationMissions: missionComputationReducer,
  notification: notificationReducer,
  employees: employeesReducer,
  paymentBatchDetails: missionComputationForPaymentBatchReducer,
  missionReports: missionReports,
});

const rootReducer = (state, action) => {
  if (action.type === 'user/logout') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
