// src/pages/AdminPanel.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import "../styles/AdminPanel.css";

function AdminPanel() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", membership: "", phone: "" });
  const [editId, setEditId] = useState(null);
  const [notification, setNotification] = useState("");
  const [feePackage, setFeePackage] = useState("");
  const [activeTab, setActiveTab] = useState("members");
  const navigate = useNavigate();

  const supplements = [
    { 
      id: 1, 
      name: "Gold Standard Whey Protein", 
      brand: "Optimum Nutrition", 
      price: 59.99, 
      size: "5 lbs", 
      flavors: ["Double Rich Chocolate", "Vanilla Ice Cream", "Strawberry", "Cookies & Cream"],
      benefits: "24g protein per serving, low in sugars and fat, supports muscle recovery",
      inStock: true,
      bestSeller: true
    },
    { 
      id: 2, 
      name: "Creatine Monohydrate", 
      brand: "MuscleTech", 
      price: 29.99, 
      size: "1000g", 
      benefits: "Increases strength and power output, supports ATP regeneration during intense exercise",
      dosage: "5g daily, with water or protein shake",
      inStock: true,
      bestSeller: false
    },
    { 
      id: 3, 
      name: "BCAA Energy", 
      brand: "EVL Nutrition", 
      price: 34.99, 
      size: "30 servings", 
      flavors: ["Blue Raspberry", "Fruit Punch", "Watermelon"],
      benefits: "Supports muscle recovery, prevents catabolism during training, improves endurance",
      inStock: true,
      bestSeller: false
    },
    { 
      id: 4, 
      name: "Animal Pak Multivitamin", 
      brand: "Universal Nutrition", 
      price: 39.99, 
      size: "44 packs", 
      benefits: "Complete vitamin and mineral complex, includes amino acids and performance optimizers",
      dosage: "1 pack daily with meal",
      inStock: false,
      bestSeller: false
    },
    { 
      id: 5, 
      name: "Omega-3 Fish Oil", 
      brand: "NOW Foods", 
      price: 24.99, 
      size: "200 softgels", 
      benefits: "Supports joint and heart health, reduces inflammation, improves recovery",
      dosage: "2 softgels daily with meals",
      inStock: true,
      bestSeller: false
    },
    { 
      id: 6, 
      name: "Pre-Workout C4", 
      brand: "Cellucor", 
      price: 49.99, 
      size: "30 servings", 
      flavors: ["Fruit Punch", "Icy Blue Razz", "Orange Burst"],
      benefits: "Energy boost, improved focus, enhanced performance, better pumps",
      dosage: "1 scoop 20-30 minutes before workout",
      inStock: true,
      bestSeller: true
    },
    { 
      id: 7, 
      name: "Mass Gainer", 
      brand: "Dymatize", 
      price: 64.99, 
      size: "12 lbs", 
      flavors: ["Chocolate", "Vanilla"],
      benefits: "1300 calories per serving, 52g protein, ideal for hard gainers",
      inStock: true,
      bestSeller: false
    },
    { 
      id: 8, 
      name: "ZMA Sleep Support", 
      brand: "MuscleTech", 
      price: 19.99, 
      size: "90 capsules", 
      benefits: "Improves sleep quality, supports testosterone production, enhances recovery",
      dosage: "3 capsules before bed on empty stomach",
      inStock: true,
      bestSeller: false
    }
  ];

  const dietPlans = [
    {
      id: 1,
      name: "Muscle Building Plan",
      targetAudience: "Individuals looking to gain lean muscle mass",
      overview: "High protein, moderate carbs, balanced fat intake, caloric surplus of 300-500 calories",
      meals: [
        { time: "7:00 AM", description: "4 egg whites + 2 whole eggs, 1 cup oatmeal with berries, 1 banana" },
        { time: "10:00 AM", description: "Protein shake (30g whey) with 1 tbsp almond butter, 1 apple" },
        { time: "1:00 PM", description: "8oz grilled chicken breast, 1 cup brown rice, 2 cups vegetables" },
        { time: "4:00 PM", description: "6oz tuna, whole grain wrap, mixed greens, ¼ avocado" },
        { time: "7:00 PM", description: "8oz lean beef/salmon, 1 large sweet potato, 2 cups vegetables" },
        { time: "10:00 PM", description: "Casein protein shake or 1 cup Greek yogurt with 1 tbsp honey" }
      ],
      macros: "40% protein, 40% carbs, 20% fats",
      supplements: "Whey protein, creatine monohydrate, fish oil",
      hydration: "1 gallon of water daily"
    },
    {
      id: 2,
      name: "Weight Loss Program",
      targetAudience: "Individuals looking to reduce body fat while preserving muscle",
      overview: "Moderate protein, low carbs, moderate fats, caloric deficit of 500 calories",
      meals: [
        { time: "6:30 AM", description: "3 egg whites + 1 whole egg, ½ cup oatmeal" },
        { time: "9:30 AM", description: "Protein shake with water, handful of almonds" },
        { time: "12:30 PM", description: "6oz grilled chicken breast, large green salad with olive oil dressing" },
        { time: "3:30 PM", description: "1 can tuna or 4oz turkey breast, ½ cucumber, 1 bell pepper" },
        { time: "6:30 PM", description: "6oz white fish or lean protein, 2 cups steamed vegetables" }
      ],
      macros: "40% protein, 25% carbs, 35% fats",
      supplements: "Whey protein, green tea extract, CLA",
      cardio: "30-45 minutes moderate intensity, 4-5 times weekly",
      hydration: "1 gallon of water daily"
    },
    {
      id: 3,
      name: "Mass Gainer Plan",
      targetAudience: "Hard gainers and ectomorphs looking to build serious size",
      overview: "High protein, very high carbs, moderate fats, caloric surplus of 700-1000 calories",
      meals: [
        { time: "6:00 AM", description: "5 whole eggs scrambled, 2 cups oatmeal, 2 bananas, 2 tbsp honey" },
        { time: "9:00 AM", description: "Mass gainer shake (800 calories), 2 tbsp peanut butter, 1 cup whole milk" },
        { time: "12:00 PM", description: "10oz chicken breast, 2 cups rice, 1 cup vegetables, 1 tbsp olive oil" },
        { time: "3:00 PM", description: "8oz steak, 2 large potatoes, 1 cup vegetables" },
        { time: "6:00 PM", description: "10oz salmon or red meat, 2 cups pasta, 1 cup vegetables" },
        { time: "9:00 PM", description: "Mass gainer shake or 2 cups Greek yogurt with granola and fruit" }
      ],
      macros: "30% protein, 50% carbs, 20% fats",
      supplements: "Mass gainer, creatine, ZMA",
      training: "Focus on compound movements with progressive overload",
      rest: "Minimum 8 hours sleep nightly"
    },
    {
      id: 4,
      name: "Athletic Performance Diet",
      targetAudience: "Athletes looking to optimize performance and recovery",
      overview: "High protein, high carbs (timed around workouts), moderate fats",
      meals: [
        { time: "Pre-Workout", description: "1 banana, 1 cup oatmeal, 1 scoop whey protein" },
        { time: "Post-Workout", description: "2 scoops whey protein, 1 cup white rice or sports drink" },
        { time: "Breakfast", description: "4 egg whites + 2 whole eggs, 1 cup oatmeal, mixed berries" },
        { time: "Lunch", description: "8oz grilled chicken, 1 cup quinoa, 2 cups vegetables" },
        { time: "Dinner", description: "8oz salmon or lean beef, sweet potato, 2 cups vegetables" },
        { time: "Snacks", description: "Greek yogurt, nuts, fruit, protein bars (as needed for caloric goals)" }
      ],
      macros: "35% protein, 45% carbs, 20% fats",
      supplements: "Pre-workout, BCAAs, whey protein, creatine",
      hydration: "1-1.5 gallons water daily plus electrolytes during training"
    }
  ];

  const fetchMembers = async () => {
    const querySnapshot = await getDocs(collection(db, "members"));
    const membersList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMembers(membersList);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async () => {
    const { name, email, membership, phone } = form;
    if (!name || !email || !membership || !phone) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      if (editId) {
        const docRef = doc(db, "members", editId);
        await updateDoc(docRef, form);
        setEditId(null);
      } else {
        await addDoc(collection(db, "members"), {
          name,
          email,
          membership,
          phone,
          joined: new Date().toISOString(),
          notification: "",
          feePackage: "",
        });

        await createUserWithEmailAndPassword(auth, email, phone);
      }

      setForm({ name: "", email: "", membership: "", phone: "" });
      fetchMembers();
      alert("Member added and account created!");
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating account or adding member.");
    }
  };

  const handleEdit = (member) => {
    setForm({
      name: member.name,
      email: member.email,
      membership: member.membership,
      phone: member.phone || "",
    });
    setEditId(member.id);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "members", id));
    fetchMembers();
  };

  const handleAssignNotification = async (id) => {
    const docRef = doc(db, "members", id);
    await updateDoc(docRef, { notification });
    setNotification("");
    fetchMembers();
  };

  const handleAssignFee = async (id) => {
    const docRef = doc(db, "members", id);
    await updateDoc(docRef, { feePackage });
    setFeePackage("");
    fetchMembers();
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(members);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Members");
    XLSX.writeFile(wb, "Gym_Members.xlsx");
  };

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>
      
      <div className="tab-container">
        <button 
          onClick={() => setActiveTab("members")}
          className={`tab-button ${activeTab === "members" ? "active" : ""}`}
        >
          Members
        </button>
        <button 
          onClick={() => setActiveTab("supplements")}
          className={`tab-button ${activeTab === "supplements" ? "active" : ""}`}
        >
          Supplement Store
        </button>
        <button 
          onClick={() => setActiveTab("diets")}
          className={`tab-button ${activeTab === "diets" ? "active" : ""}`}
        >
          Diet Plans
        </button>
      </div>

      {activeTab === "members" && (
        <>
          <div className="form-container">
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="form-input" />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="form-input" />
            <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="form-input" />
            <select 
  name="membership" 
  value={form.membership} 
  onChange={handleChange} 
  className="form-input membership-select"
>
  <option value="" disabled>Select Membership Plan</option>
  <option value="Bronze">Bronze</option>
  <option value="Silver">Silver</option>
  <option value="Gold">Gold</option>
</select>            <button 
              onClick={handleAddOrUpdate}
              className="button button-green"
            >
              {editId ? "Update Member" : "Add Member"}
            </button>
          </div>

          <button 
            onClick={exportToExcel}
            className="button button-blue"
          >
            Download Excel
          </button>

          <div className="members-list">
            <ul className="member-cards">
              {members.map((member) => (
                <li key={member.id} className="member-card">
                  <div className="member-info">
                    <strong>{member.name}</strong> - {member.email} ({member.membership})
                    <br />
                    Phone: {member.phone} | Fee Package: {member.feePackage || "N/A"} | Notification: {member.notification || "N/A"}
                  </div>
                  <div className="member-actions">
                    <div className="action-group">
                      <input
                        type="text"
                        placeholder="Assign Fee Package"
                        value={feePackage}
                        onChange={(e) => setFeePackage(e.target.value)}
                        className="form-input"
                      />
                      <button 
                        onClick={() => handleAssignFee(member.id)}
                        className="button button-orange"
                      >
                        Assign Fee
                      </button>
                    </div>
                    <div className="action-group">
                      <input
                        type="text"
                        placeholder="Assign Notification"
                        value={notification}
                        onChange={(e) => setNotification(e.target.value)}
                        className="form-input"
                      />
                      <button 
                        onClick={() => handleAssignNotification(member.id)}
                        className="button button-purple"
                      >
                        Send Notification
                      </button>
                    </div>
                    <button 
                      onClick={() => handleEdit(member)}
                      className="button button-blue"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(member.id)}
                      className="button button-red"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {activeTab === "supplements" && (
        <div>
          <h3>Supplement Store Inventory</h3>
          <div className="supplements-grid">
            {supplements.map(supplement => (
              <div key={supplement.id} className="supplement-card">
                {supplement.bestSeller && (
                  <div className="best-seller-badge">
                    BEST SELLER
                  </div>
                )}
                <h4 className="supplement-title">{supplement.name}</h4>
                <p className="supplement-brand"><strong>Brand:</strong> {supplement.brand}</p>
                <p className="supplement-detail"><strong>Price:</strong> ${supplement.price}</p>
                <p className="supplement-detail"><strong>Size:</strong> {supplement.size}</p>
                {supplement.flavors && (
                  <p className="supplement-detail"><strong>Flavors:</strong> {supplement.flavors.join(", ")}</p>
                )}
                <p className="supplement-detail"><strong>Benefits:</strong> {supplement.benefits}</p>
                {supplement.dosage && (
                  <p className="supplement-detail"><strong>Dosage:</strong> {supplement.dosage}</p>
                )}
                <p className={`stock-status ${supplement.inStock ? "in-stock" : "out-of-stock"}`}>
                  {supplement.inStock ? "In Stock" : "Out of Stock"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "diets" && (
        <div>
          <h3>Diet & Nutrition Plans</h3>
          <div className="diet-plans-container">
            {dietPlans.map(plan => (
              <div key={plan.id} className="diet-plan-card">
                <h4 className="diet-plan-title">{plan.name}</h4>
                <p><strong>For:</strong> {plan.targetAudience}</p>
                <p><strong>Overview:</strong> {plan.overview}</p>
                
                <h5 className="meal-plan-title">Daily Meal Plan</h5>
                <div className="meal-schedule">
                  {plan.meals.map((meal, index) => (
                    <div key={index} className="meal-item">
                      <span className="meal-time">{meal.time}</span>
                      <span className="meal-description">{meal.description}</span>
                    </div>
                  ))}
                </div>
                
                <div className="diet-details-grid">
                  <div>
                    <p><strong>Macro Split:</strong> {plan.macros}</p>
                    <p><strong>Recommended Supplements:</strong> {plan.supplements}</p>
                  </div>
                  <div>
                    {plan.cardio && <p><strong>Cardio:</strong> {plan.cardio}</p>}
                    {plan.training && <p><strong>Training Focus:</strong> {plan.training}</p>}
                    {plan.rest && <p><strong>Rest:</strong> {plan.rest}</p>}
                    <p><strong>Hydration:</strong> {plan.hydration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;