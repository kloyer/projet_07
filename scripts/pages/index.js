import { recipes as rawData } from './../../data/recipes.js';
import RecipeFactory from '../factories/RecipesFactory.js';

let data = [];

function init() {
    try {
        const recipeFactory = new RecipeFactory();

        data = rawData.map(d => recipeFactory.create(d));

        console.log("Created recipe objects:", data);
    } catch (error) {
        console.error("Error during initialization:", error);
    }

    const searchbar = document.getElementById('searchbar');

    searchbar.addEventListener('input', function() {
        const query = searchbar.value.trim().toLowerCase();
        if (query.length >= 3) {
            searchAndDisplayRecipes(query);
        } else {
            clearRecipes();
        }
    });
}

function searchAndDisplayRecipes(query) {
    const filteredRecipes = data.filter(recipe => {
        const lowerCaseName = recipe.name ? recipe.name.toLowerCase() : '';
        const lowerCaseDescription = recipe.description ? recipe.description.toLowerCase() : '';

        return (
            lowerCaseName.includes(query) ||
            lowerCaseDescription.includes(query) ||
            (Array.isArray(recipe.ingredients) && recipe.ingredients.some(item => {
                return item.ingredient.toLowerCase().includes(query);
            }))
        );
    });

    displayRecipes(filteredRecipes);
}

function displayRecipes(recipes) {
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = '';

    recipes.forEach(recipe => {
        const recipeElement = document.createElement('div');

        const nameElement = document.createElement('h3');
        nameElement.textContent = recipe.name;
        recipeElement.appendChild(nameElement);

        const ingredientsElement = document.createElement('ul');
        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = `${ingredient.ingredient} ${ingredient.quantity || ''} ${ingredient.unit || ''}`.trim();
            ingredientsElement.appendChild(li);
        });
        recipeElement.appendChild(ingredientsElement);

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = `Description: ${recipe.description}`;
        recipeElement.appendChild(descriptionElement);

        recipesDiv.appendChild(recipeElement);
    });
}

function clearRecipes() {
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = '';
}

init();
