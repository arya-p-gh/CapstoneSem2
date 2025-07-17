import React, { useState, useEffect } from 'react';
import './CalorieCounter.css';

const CalorieCounter = () => {
  const [meals, setMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });

  useEffect(() => {
    const savedMeals = JSON.parse(localStorage.getItem('meals')) || [];
    setMeals(savedMeals);
  }, []);

  const searchFood = async () => {
    if (!searchTerm.trim()) return;

    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchTerm)}&search_simple=1&action=process&json=1`
      );

      if (!response.ok) throw new Error('Failed to fetch food data.');

      const data = await response.json();
      const results = (data.products || []).map((product) => ({
        name: product.product_name || product.generic_name || 'Unknown',
        calories: Math.round(product.nutriments?.['energy-kcal_100g'] || 0),
        protein: Math.round(product.nutriments?.['proteins_100g'] || 0),
        carbs: Math.round(product.nutriments?.['carbohydrates_100g'] || 0),
        fats: Math.round(product.nutriments?.['fat_100g'] || 0)
      })).filter(food => food.name && (food.calories || food.protein || food.carbs || food.fats));

      setSearchResults(results);
    } catch {
      setSearchResults([]);
    }
  };

  const selectFood = (food) => {
    setFormData(food);
    setSearchResults([]);
    setSearchTerm('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMeal = { ...formData, id: Date.now() };
    const updatedMeals = [...meals, newMeal];
    setMeals(updatedMeals);
    localStorage.setItem('meals', JSON.stringify(updatedMeals));
    setFormData({ name: '', calories: '', protein: '', carbs: '', fats: '' });
  };

  const handleDelete = (id) => {
    const updatedMeals = meals.filter((meal) => meal.id !== id);
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
          placeholder="Search for food"
          className="search-input"
        />
        <button onClick={searchFood} className="search-button">Search</button>
      </div>

      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((food, index) => (
            <div key={index} className="search-result-item" onClick={() => selectFood(food)}>
              <h4>{food.name}</h4>
              <p>Calories: {food.calories} | Protein: {food.protein}g | Carbs: {food.carbs}g | Fats: {food.fats}g</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="meal-form">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Meal Name"
          required
        />
        <input
          type="number"
          name="calories"
          value={formData.calories}
          onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
          placeholder="Calories"
          required
        />
        <input
          type="number"
          name="protein"
          value={formData.protein}
          onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
          placeholder="Protein (g)"
          required
        />
        <input
          type="number"
          name="carbs"
          value={formData.carbs}
          onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
          placeholder="Carbs (g)"
          required
        />
        <input
          type="number"
          name="fats"
          value={formData.fats}
          onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
          placeholder="Fats (g)"
          required
        />
        <button type="submit">Add Meal</button>
      </form>

      <div className="total-calories">
        <h3>Total Calories: {totalCalories}</h3>
      </div>

      <div className="meals-list">
        {meals.map((meal) => (
          <div key={meal.id} className="meal-item">
            <div>
              <h4>{meal.name}</h4>
              <p>Calories: {meal.calories}</p>
            </div>
            <button onClick={() => handleDelete(meal.id)} className="delete-btn">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalorieCounter;