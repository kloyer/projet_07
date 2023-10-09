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
        recipeFactory.searchAndUpdate(query);
    });

    recipeFactory.initTagSearch();
}

init();