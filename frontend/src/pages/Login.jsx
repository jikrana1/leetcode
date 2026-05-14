
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import React, { useState } from 'react';
import { NavLink } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { loginUser } from '../slice/auth.slice.js';
import LoadingPage from './LoadingPage.jsx';


function Login() {


  const [showPassword,setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
const {loading} = useSelector((state) => state.auth);
  // Renamed to loginSchema
  const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'), // Changed to min(1) for login
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    // API call here
    dispatch(loginUser(data));
  };

if(loading){
  return <LoadingPage/>
}  

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-8">
          {/* Fixed title for login */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-400 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"  // Fixed: camelCase, and value "email" for suggestions
                placeholder="you@example.com"
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'
                  } rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className='relative'>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password" 
                placeholder="••••••••"
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'
                  } rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                {...register('password')}
              />
              <button
                type="button"
                className="absolute top-11 right-3 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Fixed button text */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Log In
            </button>

            {/* Fixed bottom link text */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <NavLink
                  to='/signup'
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Sign up
                </NavLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
