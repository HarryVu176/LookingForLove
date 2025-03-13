# Looking For Love

A modern dating application with a React Native frontend and Node.js backend.

## Project Structure

This project is organized into two main directories:

- `frontend/`: React Native Expo application
- `backend/`: Node.js Express API server

## Frontend

### Technologies Used

- React Native with Expo
- TypeScript
- Redux Toolkit for state management
- React Navigation for routing
- Formik & Yup for form validation
- Axios for API requests

### Setup Instructions

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Use the Expo Go app on your mobile device or an emulator to run the application.

### Key Concepts

#### Redux Store

The Redux store is configured in `frontend/app/store/index.ts`. It uses Redux Toolkit and Redux Persist to manage application state.

The "store" in Redux is a central container that holds the entire application state. Think of it as a client-side database that maintains all the data your application needs to function. In our application, the store:

- **Holds the global state**: All data that needs to be accessed by multiple components (user authentication, profile data, matches, statistics)
- **Provides a single source of truth**: Any component can access the same data without prop drilling
- **Enables predictable state updates**: All state changes follow the same pattern through actions and reducers
- **Persists critical data**: Uses Redux Persist to save authentication state between app sessions

Our store is organized into domain-specific slices:
- `auth`: Manages user authentication state (login, registration, tokens)
- `profile`: Handles user profile information
- `matches`: Manages dating matches and interactions
- `statistics`: Tracks user activity and app usage statistics

```typescript
// Simplified example of store configuration
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
```

To access store data in components:
```typescript
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// In a component
const user = useSelector((state: RootState) => state.auth.user);
```

To update store data:
```typescript
import { useDispatch } from 'react-redux';
import { login } from '../store/auth/authSlice';

// In a component
const dispatch = useDispatch();
dispatch(login(credentials));
```

#### Redux Slices

Slices are a way to organize Redux logic and reducers. Each slice contains:

1. **State Interface**: Defines the shape of the state managed by the slice
2. **Initial State**: Default values for the state
3. **Reducers**: Functions that handle state changes
4. **Async Thunks**: Functions for handling asynchronous operations

Example from `authSlice.ts`:
```typescript
// State interface
interface AuthState {
  user: IUserProfile | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: ILoginRequest, { rejectWithValue }) => {
    const response = await authService.login(credentials);
    
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    
    return response;
  }
);

// Slice definition
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous reducers
  },
  extraReducers: (builder) => {
    // Handling async thunk states
  }
});
```

#### Navigation

The app uses React Navigation for routing between screens. Navigation is configured in the `frontend/app/navigation` directory.

## Backend

### Technologies Used

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Joi for validation

### Setup Instructions

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/lookingforlove
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Key Concepts

#### API Structure

The backend follows a modular architecture:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Models**: Define database schemas
- **Routes**: Define API endpoints
- **Middlewares**: Handle concerns like authentication
- **Validators**: Validate request data

#### Authentication Flow

The backend uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in
2. Server validates credentials
3. Server generates a JWT token
4. Client stores the token
5. Client includes the token in subsequent requests
6. Server validates the token for protected routes

#### Database Models

Mongoose models define the structure of the data stored in MongoDB. For example:

```typescript
// User model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    // Other profile fields
  }
});
```

## Scripts

### Frontend Scripts

- `npm start`: Start the Expo development server
- `npm run android`: Start the app on Android
- `npm run ios`: Start the app on iOS
- `npm run web`: Start the app in a web browser
- `npm run lint`: Run ESLint

### Backend Scripts

- `npm start`: Start the server
- `npm run dev`: Start the server with hot reloading
- `npm test`: Run tests
- `npm run promote-manager`: Run script to promote a user to product manager
- `npm run update-stats`: Run script to update statistics

## Development Workflow

1. Start the backend server
2. Start the frontend Expo server
3. Make changes to the code
4. Test your changes in the Expo Go app or emulator

## Troubleshooting

- If you encounter connection issues, ensure both frontend and backend are running on the same network
- Check that the API URL in the frontend is correctly pointing to your backend server
- For MongoDB connection issues, verify your connection string in the `.env` file
- Probably you don't even need .env as I hardcoded the connection string in the backend and frontend, unless you run different ports for Mongo.
