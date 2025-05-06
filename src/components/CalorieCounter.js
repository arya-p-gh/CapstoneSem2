import React, { useState, useEffect } from 'react';
import './CalorieCounter.css';

const CalorieCounter = () => {
  const [meals, setMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.edamam.com/api/food-database/v2/parser?app_id=${process.env.REACT_APP_EDAMAM_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_APP_KEY}&ingr=${encodeURIComponent(searchTerm)}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.hints || data.hints.length === 0) {
        console.warn('No results found for the search term.');
        setSearchResults([]);
        return;
      }

      const results = data.hints.map((hint) => ({
        name: hint.food.label,
        calories: Math.round(hint.food.nutrients.ENERC_KCAL || 0),
        protein: Math.round((hint.food.nutrients.PROCNT || 0) * 10) / 10,
        carbs: Math.round((hint.food.nutrients.CHOCDF || 0) * 10) / 10,
        fats: Math.round((hint.food.nutrients.FAT || 0) * 10) / 10,
      }));

      setSearchResults(results);
    } catch (error) {
      console.error('Error fetching food data:', error.message);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectFood = (food) => {
    setFormData({
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats
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
          placeholder="Search for food (e.g., 'apple' or 'chicken')"
          className="search-input"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              searchFood();
            }
          }}
        />
        <button onClick={searchFood} className="search-button">
          Search
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
              <h4>{food.name}</h4>
              <p>
                Calories: {food.calories} | Protein: {food.protein}g | Carbs: {food.carbs}g | Fat: {food.fats}g
              </p>
            </div>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="loading">
          <p>Searching for food items...</p>
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