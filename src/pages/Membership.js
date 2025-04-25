import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Membership() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const querySnapshot = await getDocs(collection(db, "plans"));
      const plansList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlans(plansList);
    };

    fetchPlans();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Membership Plans</h2>
      {plans.length === 0 ? <p>Loading...</p> : (
        plans.map((plan) => (
          <div key={plan.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
            <h3>{plan.name}</h3>
            <p>Price: ₹{plan.price}</p>
            <p>Duration: {plan.duration}</p>
            <p>Benefits:</p>
            <ul>
              {plan.benefits.map((benefit, index) => <li key={index}>{benefit}</li>)}
            </ul>
            <button>Buy Now</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Membership;  // ✅ Ensure this is here
