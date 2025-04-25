// src/pages/CreateAdminAccount.js

import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/CreateAdminAccount.css";

function CreateAdminAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!email.endsWith("@admin.com")) {
      setIsError(true);
      setMessage("Admin email must end with @admin.com");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "admin",
        createdAt: new Date(),
      });

      setIsError(false);
      setMessage("Admin account created successfully!");
      setTimeout(() => navigate("/login"), 2000); // redirect to login after success
    } catch (error) {
      console.error("Admin account creation error:", error.message);
      setIsError(true);
      setMessage("Failed to create admin account. " + error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Create Admin Account</h2>

      <input
        type="email"
        placeholder="Enter Admin Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="login-input"
      />
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="login-input"
      />

      <button onClick={handleSignUp} className="login-button">
        Create Account
      </button>

      {message && (
        <p className={isError ? "error-message" : "success-message"}>{message}</p>
      )}
    </div>
  );
}

export default CreateAdminAccount;
