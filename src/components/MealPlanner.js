import React, { useState } from 'react';
import './MealPlanner.css';

const MealPlanner = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const meals = ['Breakfast', 'Lunch', 'Dinner'];

  const [mealPlan, setMealPlan] = useState(
    days.reduce((plan, day) => {
      plan[day.toLowerCase()] = meals.reduce((mealsObj, meal) => {
        mealsObj[meal.toLowerCase()] = '';
        return mealsObj;
      }, {});
      return plan;
    }, {})
  );

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
        {days.map(day => (
          <div key={day} className="day-column">
            <h3>{day}</h3>
            {meals.map(mealType => (
              <div key={mealType} className="meal-slot">
                <h4>{mealType}</h4>
                <textarea
                  value={mealPlan[day.toLowerCase()][mealType.toLowerCase()]}
                  onChange={(e) =>
                    handleMealChange(day.toLowerCase(), mealType.toLowerCase(), e.target.value)
                  }
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