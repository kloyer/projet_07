// Import recipes from the recipes.js file
import { recipes } from '../../data/recipes.js';

// Function to initialize the app
function init() {
    try {
        // No need to fetch, just use the imported data
        console.log("Fetched recipes data:", recipes);
        // You can perform further processing or rendering here
    } catch (error) {
        console.error("Error during initialization:", error);
    }
}

// Call the init function
init();
