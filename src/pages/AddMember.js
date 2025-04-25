// src/pages/AddMember.js
import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
// import emailjs from "emailjs-com"; // Uncomment if email sending needed

function AddMember() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !plan) {
      alert("Please fill in all fields.");
      return;
    }

    const password = phone;

    try {
      // 1. Create account in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Save user details in Firestore
      await addDoc(collection(db, "members"), {
        name,
        email,
        phone,
        plan,
        uid: user.uid,
        joined: new Date().toISOString(),
      });

      // 3. (Optional) Send credentials via EmailJS
      // await emailjs.send(
      //   'your_service_id',
      //   'your_template_id',
      //   {
      //     to_email: email,
      //     member_name: name,
      //     member_email: email,
      //     password: password
      //   },
      //   'your_user_id'
      // );

      alert("Member added and account created successfully.");
      navigate("/members");
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Failed to add member or create account.");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Add New Member</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br /><br />
        <input
          type="email"
          placeholder="Email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        /><br /><br />
        <input
          type="text"
          placeholder="Plan Name"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
        /><br /><br />
        <button type="submit">Add Member</button>
      </form>
    </div>
  );
}

export default AddMember;
