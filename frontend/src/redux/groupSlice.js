import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  groups: [],
  currentGroup: null,
  messages: [],
  loading: false,
  error: null,
  professions: [
    'Construction',
    'Carpentry',
    'Plumbing',
    'Electrical',
    'Masonry',
    'Painting',
    'Roofing',
    'Landscaping',
    'HVAC',
    'Other'
  ]
};

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    setCurrentGroup: (state, action) => {
      state.currentGroup = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      // Prevent duplicate messages by checking message ID
      const messageExists = state.messages.some(msg => msg._id === action.payload._id);
      if (!messageExists) {
        state.messages.push(action.payload);
      }
    },
    addJobAlert: (state, action) => {
      if (!state.currentGroup.jobAlerts.some(job => job._id === action.payload._id)) {
        state.currentGroup.jobAlerts.push(action.payload);
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setLoading,
  setGroups,
  setCurrentGroup,
  setMessages,
  addMessage,
  addJobAlert,
  setError,
  clearError
} = groupSlice.actions;

export default groupSlice.reducer;
