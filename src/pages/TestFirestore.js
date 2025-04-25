import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

function TestFirestore() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch members from Firestore
  const fetchMembers = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "members"));
    const membersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMembers(membersList);
    setLoading(false);
  };

  // Add a test member
  const addMember = async () => {
    await addDoc(collection(db, "members"), {
      name: "John Doe",
      email: "john@example.com",
      membership: "Gold"
    });
    fetchMembers(); // Refresh list
  };

  // Edit first member (for testing)
  const editMember = async () => {
    if (members.length === 0) return alert("No members found");
    const memberRef = doc(db, "members", members[0].id);
    await updateDoc(memberRef, { name: "John Updated" });
    fetchMembers();
  };

  // Delete first member (for testing)
  const deleteMember = async () => {
    if (members.length === 0) return alert("No members found");
    const memberRef = doc(db, "members", members[0].id);
    await deleteDoc(memberRef);
    fetchMembers();
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Firestore Test</h2>
      <button onClick={addMember}>Add Member</button>
      <button onClick={fetchMembers}>View Members</button>
      <button onClick={editMember}>Edit First Member</button>
      <button onClick={deleteMember}>Delete First Member</button>

      {loading ? <p>Loading...</p> : (
        <ul>
          {members.map((member) => (
            <li key={member.id}>{member.name} - {member.email} ({member.membership})</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TestFirestore;
