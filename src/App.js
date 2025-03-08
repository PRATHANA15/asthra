import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [isActive, setIsActive] = useState(false);
  const [user, setUser] = useState(null);
  
  // Form state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // Form validation state
  const [errors, setErrors] = useState({
    signIn: {},
    signUp: {}
  });

  // Handle successful Google sign-in
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Decoded Google User:', decoded);
      setUser(decoded);
      
      localStorage.setItem('userInfo', JSON.stringify({
        name: decoded.name,
        email: decoded.email
      }));
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Sign-In Failed');
  };

  const validateSignInForm = () => {
    const newErrors = {};
    if (!signInEmail) newErrors.email = 'Email is required';
    if (!signInPassword) newErrors.password = 'Password is required';
    return newErrors;
  };

  const validateSignUpForm = () => {
    const newErrors = {};
    if (!signUpName) newErrors.name = 'Name is required';
    if (!signUpEmail) newErrors.email = 'Email is required';
    if (!signUpPassword) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const validationErrors = validateSignInForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(prev => ({ ...prev, signIn: validationErrors }));
      return;
    }

    setErrors(prev => ({ ...prev, signIn: {} }));
    localStorage.setItem('userInfo', JSON.stringify({
      email: signInEmail
    }));
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    const validationErrors = validateSignUpForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(prev => ({ ...prev, signUp: validationErrors }));
      return;
    }

    setErrors(prev => ({ ...prev, signUp: {} }));
    localStorage.setItem('userInfo', JSON.stringify({
      name: signUpName,
      email: signUpEmail
    }));
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] flex items-center justify-center">
        <div className={`container bg-white rounded-[30px] shadow-[0_5px_15px_rgba(0,0,0,0.35)] relative overflow-hidden w-[768px] max-w-full min-h-[480px] ${isActive ? 'active' : ''}`}>
          
          {/* Sign In Form */}
          <div className="form-container sign-in absolute top-0 left-0 w-1/2 h-full flex items-center justify-center transition-all duration-700 z-20">
            <form onSubmit={handleSignIn} className="bg-white flex flex-col items-center justify-center px-10 h-full">
              <h1 className="text-2xl font-bold mb-2">Sign In</h1>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                type="standard"
                text="continue_with"
                shape="pill"
                width="250"
              />
              <span className="text-sm mt-4">or use your account</span>
              <div className="w-full">
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  className={`bg-[#eee] border-2 border-transparent my-2 px-4 py-2.5 text-sm rounded-lg w-full outline-none transition-all duration-300 focus:border-[#512da8] ${errors.signIn.email ? 'border-red-500' : ''}`}
                />
                {errors.signIn.email && <p className="text-red-500 text-xs mt-1">{errors.signIn.email}</p>}
              </div>
              <div className="w-full">
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className={`bg-[#eee] border-2 border-transparent my-2 px-4 py-2.5 text-sm rounded-lg w-full outline-none transition-all duration-300 focus:border-[#512da8] ${errors.signIn.password ? 'border-red-500' : ''}`}
                />
                {errors.signIn.password && <p className="text-red-500 text-xs mt-1">{errors.signIn.password}</p>}
              </div>
              <a href="#" className="text-[13px] text-gray-800 no-underline mt-4 mb-2.5 hover:text-[#512da8] transition-colors duration-300">Forgot your password?</a>
              <button 
                type="submit" 
                className="bg-[#512da8] text-white text-xs py-2.5 px-11 border border-transparent rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer transition-all duration-300 hover:bg-[#4527a0] active:scale-95 active:bg-[#311b92] focus:outline-none focus:ring-2 focus:ring-[#512da8] focus:ring-offset-2"
              >
                Sign In
              </button>
            </form>
          </div>

          {/* Sign Up Form */}
          <div className="form-container sign-up absolute top-0 left-0 w-1/2 h-full flex items-center justify-center transition-all duration-700 opacity-0 z-10">
            <form onSubmit={handleSignUp} className="bg-white flex flex-col items-center justify-center px-10 h-full">
              <h1 className="text-2xl font-bold mb-2">Create Account</h1>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                type="standard"
                text="continue_with"
                shape="pill"
                width="250"
              />
              <span className="text-sm mt-4">or use your email for registration</span>
              <div className="w-full">
                <input 
                  type="text" 
                  placeholder="Name" 
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  className={`bg-[#eee] border-2 border-transparent my-2 px-4 py-2.5 text-sm rounded-lg w-full outline-none transition-all duration-300 focus:border-[#512da8] ${errors.signUp.name ? 'border-red-500' : ''}`}
                />
                {errors.signUp.name && <p className="text-red-500 text-xs mt-1">{errors.signUp.name}</p>}
              </div>
              <div className="w-full">
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  className={`bg-[#eee] border-2 border-transparent my-2 px-4 py-2.5 text-sm rounded-lg w-full outline-none transition-all duration-300 focus:border-[#512da8] ${errors.signUp.email ? 'border-red-500' : ''}`}
                />
                {errors.signUp.email && <p className="text-red-500 text-xs mt-1">{errors.signUp.email}</p>}
              </div>
              <div className="w-full">
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  className={`bg-[#eee] border-2 border-transparent my-2 px-4 py-2.5 text-sm rounded-lg w-full outline-none transition-all duration-300 focus:border-[#512da8] ${errors.signUp.password ? 'border-red-500' : ''}`}
                />
                {errors.signUp.password && <p className="text-red-500 text-xs mt-1">{errors.signUp.password}</p>}
              </div>
              <button 
                type="submit" 
                className="bg-[#512da8] text-white text-xs py-2.5 px-11 border border-transparent rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer transition-all duration-300 hover:bg-[#4527a0] active:scale-95 active:bg-[#311b92] focus:outline-none focus:ring-2 focus:ring-[#512da8] focus:ring-offset-2"
              >
                Sign Up
              </button>
            </form>
          </div>

          {/* Toggle Container */}
          <div className="toggle-container absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-700 z-30"
               style={isActive ? { borderRadius: "0 150px 100px 0", transform: "translateX(-100%)" } : { borderRadius: "150px 0 0 100px" }}>
            <div className={`toggle absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-[#5c6bc0] to-[#512da8] text-white transition-all duration-700 ${isActive ? 'translate-x-1/2' : 'translate-x-0'}`}>
              <div className={`toggle-panel toggle-left absolute top-0 w-1/2 h-full flex flex-col items-center justify-center px-8 text-center transition-all duration-700 ${isActive ? 'translate-x-0' : '-translate-x-[200%]'}`}>
                <h1 className="text-2xl font-bold mb-2">Welcome Back!</h1>
                <p className="text-sm leading-5 tracking-wide my-5">Enter your personal details to use all site features</p>
                <button 
                  type="button" 
                  className="bg-transparent border-2 border-white text-white text-xs py-2.5 px-11 rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer transition-all duration-300 hover:bg-white hover:text-[#512da8] active:scale-95 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#512da8]" 
                  onClick={() => setIsActive(false)}
                >
                  Sign In
                </button>
              </div>
              <div className={`toggle-panel toggle-right absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-8 text-center transition-all duration-700 ${isActive ? 'translate-x-[200%]' : 'translate-x-0'}`}>
                <h1 className="text-2xl font-bold mb-2">Hello, Friend!</h1>
                <p className="text-sm leading-5 tracking-wide my-5">Register with your personal details to use all site features</p>
                <button 
                  type="button" 
                  className="bg-transparent border-2 border-white text-white text-xs py-2.5 px-11 rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer transition-all duration-300 hover:bg-white hover:text-[#512da8] active:scale-95 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#512da8]" 
                  onClick={() => setIsActive(true)}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;