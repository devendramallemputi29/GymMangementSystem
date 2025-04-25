// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  // Array of motivational fitness quotes
  const fitnessQuotes = [
    "The only bad workout is the one that didn't happen.",
    "Strength does not come from the body. It comes from the will.",
    "Your body can stand almost anything. It's your mind that you have to convince.",
    "Fitness is not about being better than someone else. It's about being better than you used to be.",
    "The hard part isn't getting your body in shape. The hard part is getting your mind in shape."
  ];
  
  // Get random quote for display
  const randomQuote = fitnessQuotes[Math.floor(Math.random() * fitnessQuotes.length)];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential.user.email;

      if (role === "admin" && userEmail.endsWith("@admin.com")) {
        navigate("/admin");
      } else if (role === "member" && !userEmail.endsWith("@admin.com")) {
        navigate("/dashboard");
      } else {
        setError("Access denied. Role mismatch.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="gym-logo">
          <h1>POWER<span>FIT</span></h1>
          <p className="tagline">Unleash Your Potential</p>
        </div>
        
        <h2 className="login-header">{role === "admin" ? "Admin Login" : "Member Login"}</h2>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="role-selector-container">
            <label>Login as:</label>
            <select 
              className="role-selector"
              value={role} 
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="form-input"
              type="email"
              placeholder={role === "admin" ? "example@admin.com" : "youremail@gmail.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="form-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button className="login-button" type="submit">
            {role === "admin" ? "Login as Admin" : "Login to Your Account"}
          </button>
          
          <div className="login-options">
            {role === "member" && (
              <p>Password is member phone number</p>
            )}
            {role === "admin" && (
              <a href="/create-admin" className="create-account">Request Admin Access</a>
            )}
          </div>
        </form>
        
        <div className="motivation-quote">
          <p>"{randomQuote}"</p>
        </div>
        
        <div className="gym-features">
          <h3>PowerFit Membership Benefits</h3>
          <ul>
            <li>24/7 Facility Access</li>
            <li>State-of-the-art Equipment</li>
            <li>Personalized Workout Plans</li>
            <li>Nutrition Guidance</li>
            <li>Group Fitness Classes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;