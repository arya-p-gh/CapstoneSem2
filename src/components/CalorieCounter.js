import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CalorieCounter.css';

const NUTRITIONIX_APP_ID = 'f1f51eb16cdbb315c95b2c74a274ee4e';
const NUTRITIONIX_API_KEY = '9c0ba158';

const CalorieCounter = () => {
  const [meals, setMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });

  useEffect(() => {
    const savedMeals = localStorage.getItem('meals');
    if (savedMeals) {
      setMeals(JSON.parse(savedMeals));
    }
  }, []);

  const searchFood = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(
        'https://trackapi.nutritionix.com/v2/natural/nutrients',
        { query: searchTerm },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-app-id': NUTRITIONIX_APP_ID,
            'x-app-key': NUTRITIONIX_API_KEY
          }
        }
      );
      
      if (response.data && response.data.foods && response.data.foods.length > 0) {
        setSearchResults(response.data.foods);
      } else {
        setSearchResults([]);
        alert('No results found. Try a different search term.');
      }
    } catch (error) {
      console.error('Error searching food:', error);
      alert('Error searching food. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const selectFood = (food) => {
    setFormData({
      name: food.food_name,
      calories: Math.round(food.nf_calories),
      protein: Math.round(food.nf_protein),
      carbs: Math.round(food.nf_total_carbohydrate),
      fats: Math.round(food.nf_total_fat)
    });
    setSearchResults([]);
    setSearchTerm('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMeal = {
      ...formData,
      id: Date.now(),
      date: new Date().toISOString()
    };
    
    const updatedMeals = [...meals, newMeal];
    setMeals(updatedMeals);
    localStorage.setItem('meals', JSON.stringify(updatedMeals));
    
    setFormData({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fats: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = (id) => {
    const updatedMeals = meals.filter(meal => meal.id !== id);
    setMeals(updatedMeals);
    localStorage.setItem('meals', JSON.stringify(updatedMeals));
  };

  const totalCalories = meals.reduce((sum, meal) => sum + Number(meal.calories), 0);

  return (
    <div className="calorie-counter">
      <h2>Calorie Counter</h2>
      
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for food (e.g., 'apple' or 'chicken breast')"
          className="search-input"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              searchFood();
            }
          }}
        />
        <button onClick={searchFood} className="search-button" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="search-results">
          <h3>Search Results</h3>
          {searchResults.map((food, index) => (
            <div 
              key={index} 
              className="search-result-item"
              onClick={() => selectFood(food)}
            >
              <h4>{food.food_name}</h4>
              <p>
                Calories: {Math.round(food.nf_calories)} | 
                Protein: {Math.round(food.nf_protein)}g | 
                Carbs: {Math.round(food.nf_total_carbohydrate)}g | 
                Fat: {Math.round(food.nf_total_fat)}g
              </p>
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="meal-form">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Meal Name"
          required
        />
        <input
          type="number"
          name="calories"
          value={formData.calories}
          onChange={handleChange}
          placeholder="Calories"
          required
        />
        <input
          type="number"
          name="protein"
          value={formData.protein}
          onChange={handleChange}
          placeholder="Protein (g)"
          required
        />
        <input
          type="number"
          name="carbs"
          value={formData.carbs}
          onChange={handleChange}
          placeholder="Carbs (g)"
          required
        />
        <input
          type="number"
          name="fats"
          value={formData.fats}
          onChange={handleChange}
          placeholder="Fats (g)"
          required
        />
        <button type="submit">Add Meal</button>
      </form>

      <div className="total-calories">
        <h3>Total Calories Today: {totalCalories}</h3>
      </div>

      <div className="meals-list">
        <h3>Today's Meals</h3>
        {meals.map((meal) => (
          <div key={meal.id} className="meal-item">
            <div className="meal-info">
              <h4>{meal.name}</h4>
              <p>Calories: {meal.calories}</p>
              <p>Protein: {meal.protein}g</p>
              <p>Carbs: {meal.carbs}g</p>
              <p>Fats: {meal.fats}g</p>
            </div>
            <button onClick={() => handleDelete(meal.id)} className="delete-btn">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalorieCounter; 