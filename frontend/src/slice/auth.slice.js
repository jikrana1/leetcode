import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosClient } from "../axios/axiosClient.js"


export const registerUser = createAsyncThunk(
  'auth/user/register',
  async (userData, { rejectedWithValue }) => {
    try {
      const response = await axiosClient.post("/auth/user/register", userData);
      alert(response.data.message);
      return response.data.user;
    } catch (error) {
      console.log("ERROR : ",error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/user/login', credentials);
      alert(response.data.message);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const checkAuth = createAsyncThunk(
  'auth/user/check',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get('/auth/user/check');
      alert(data.message);
      return data.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
)


export const logoutUser = createAsyncThunk(
  'auth/user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/user/logout');
      alert(response.data.message);
      return null;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true,
          state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false,
          state.isAuthenticated = !!action.payload;
        state.error = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
        state.isAuthenticated = false,
          state.user = null;
      })

      // Login User Cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      })

      // Check Auth Cases
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      })

      // Logout User Cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      });

  }
})

// export default  authSlice.reducer;