import React, { useState } from 'react';
import './MealPlanner.css';

const MealPlanner = () => {
  const [mealPlan, setMealPlan] = useState({
    monday: { breakfast: '', lunch: '', dinner: '' },
    tuesday: { breakfast: '', lunch: '', dinner: '' },
    wednesday: { breakfast: '', lunch: '', dinner: '' },
    thursday: { breakfast: '', lunch: '', dinner: '' },
    friday: { breakfast: '', lunch: '', dinner: '' },
    saturday: { breakfast: '', lunch: '', dinner: '' },
    sunday: { breakfast: '', lunch: '', dinner: '' }
  });

  const handleMealChange = (day, mealType, value) => {
    setMealPlan(prevPlan => ({
      ...prevPlan,
      [day]: {
        ...prevPlan[day],
        [mealType]: value
      }
    }));
  };

  const saveMealPlan = () => {
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
    alert('Meal plan saved successfully!');
  };

  return (
    <div className="meal-planner">
      <h2>Weekly Meal Planner</h2>
      
      <div className="meal-plan-grid">
        {Object.entries(mealPlan).map(([day, meals]) => (
          <div key={day} className="day-column">
            <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
            {Object.entries(meals).map(([mealType, meal]) => (
              <div key={mealType} className="meal-slot">
                <h4>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h4>
                <textarea
                  value={meal}
                  onChange={(e) => handleMealChange(day, mealType, e.target.value)}
                  placeholder={`Plan your ${mealType}...`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <button onClick={saveMealPlan} className="save-button">
        Save Meal Plan
      </button>
    </div>
  );
};

export default MealPlanner; 