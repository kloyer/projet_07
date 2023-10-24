// Importing raw recipe data and the RecipeFactory class
import { recipes as rawData } from './../../data/recipes.js';
import RecipeFactory from '../factories/RecipesFactory.js';

// Declare variable for recipe factory instance
let recipeFactory;

// Initialization function
function init() {
    try {
        // Create new RecipeFactory instance and load data
        recipeFactory = new RecipeFactory();
        recipeFactory.loadRecipes(rawData);

        // Display the recipes and tags on the UI
        recipeFactory.displayRecipes(recipeFactory.recipes);
        recipeFactory.displayTags(recipeFactory.recipes);

        // Log the loaded recipes
        console.log("Created recipe objects:", recipeFactory.recipes);
    } catch (error) {
        // Log any errors during initialization
        console.error("Error during initialization:", error);
    }

    // Attach input event listener to the searchbar
    const searchbar = document.getElementById('searchbar');
    searchbar.addEventListener('input', function () {
        const query = searchbar.value.trim().toLowerCase();
        recipeFactory.searchAndUpdate(query);
    });

    // Initialize tag search functionality
    recipeFactory.initTagSearch();
}

// Call the initialization function
init();
