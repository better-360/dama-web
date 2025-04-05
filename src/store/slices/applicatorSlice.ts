import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import { IApplicator,IApplicatorResponse,Tokens } from '../../types/applicator';

interface ApplicatorState {
  isLoggedIn: boolean;
  applicatorData: IApplicator;
  tokens:Tokens
}

const initialState:ApplicatorState= {
  isLoggedIn: false,
  applicatorData: {
    id: '',
    telephone: '',
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    address: '',
    status: '',
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
    application: {
      id: '',
      applicatorId: '',
      status: '',
      applicationNumber: '',
      preApplicationData: {},
      applicationData: null,
      createdAt: '',
      updatedAt: '',
      deletedAt: '',
    },
    appointments: [],
  },
  tokens: {
    accessToken: '',
    refreshToken: '',
  },
  
};

export const applicatorSlice = createSlice({
  name: 'applicator',
  initialState,
  reducers: {
    loginApplicator: (state, action: PayloadAction<IApplicatorResponse>) => {
      state.applicatorData = action.payload.applicator;
      state.tokens = action.payload.tokens;
      state.isLoggedIn = true;
    },
    logOutApplicator: state => {
      state.applicatorData = initialState.applicatorData;
      state.isLoggedIn = false;
    },
    setApplicatorData: (state, action: PayloadAction<IApplicator>) => {
      state.applicatorData = action.payload;
    },
   
  },
});
export const {loginApplicator, logOutApplicator,setApplicatorData} = applicatorSlice.actions;
export const userActions = applicatorSlice.actions;
export default applicatorSlice.reducer;