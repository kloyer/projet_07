export default class RecipesFactory {
    constructor() {
        // Initialize anything you might need for the factory itself
    }

    create({ id, image, name, servings, ingredients, time, description, appliance, utensils }) {
        return {
            id,
            image,
            name,
            servings,
            ingredients,
            time,
            description,
            appliance,
            utensils
        };
    }
}