import { recipes as rawData } from './../../data/recipes.js';
import RecipeFactory from '../factories/RecipesFactory.js';

let recipeFactory;

function init() {
    try {
        recipeFactory = new RecipeFactory();
        recipeFactory.loadRecipes(rawData);
        recipeFactory.displayRecipes(recipeFactory.recipes);  // Ajoutez cette ligne ici
        recipeFactory.displayTags(recipeFactory.recipes);

        console.log("Created recipe objects:", recipeFactory.recipes);
    } catch (error) {
        console.error("Error during initialization:", error);
    }

    const searchbar = document.getElementById('searchbar');

    searchbar.addEventListener('input', function () {
        const query = searchbar.value.trim().toLowerCase();
        if (query.length >= 3) {
            const filteredRecipes = recipeFactory.searchRecipes(query);
            recipeFactory.displayRecipes(filteredRecipes);
            recipeFactory.displayTags(filteredRecipes);
        } else {
            recipeFactory.displayRecipes(recipeFactory.recipes);
            recipeFactory.displayTags(recipeFactory.recipes);
        }
    });
}

init();

