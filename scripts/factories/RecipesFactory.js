export default class RecipesFactory {
    constructor() {
        this.recipes = [];
    }

    create({ id, image, name, servings, ingredients, time, description, appliance, ustensils }) {
        return {
            id,
            image,
            name,
            servings,
            ingredients,
            time,
            description,
            appliance,
            ustensils,
        };
    }

    loadRecipes(rawData) {
        this.recipes = rawData.map(d => this.create(d));
    }

    searchRecipes(query) {
        return this.recipes.filter(recipe => {
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
    }

    searchAndUpdate(query) {
        const selectedTagsContainer = document.getElementById('selected-tags-container');
        const selectedTags = Array.from(selectedTagsContainer.children).map(span => span.textContent);
    
        let filteredRecipes;
        
        if (query.length >= 3) {
            filteredRecipes = this.searchRecipes(query);
            filteredRecipes = this.searchRecipesWithTags(filteredRecipes, selectedTags);
        } else {
            filteredRecipes = this.searchRecipesWithTags(this.recipes, selectedTags);
        }
        
        this.displayRecipes(filteredRecipes);
        this.displayTags(filteredRecipes);
    }    

    displayRecipes(recipes) {
        const recipesDiv = document.getElementById('recipes');
        recipesDiv.innerHTML = '';
        
        recipes.filter(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.classList.add('recipe-item');
        
            const imageElement = document.createElement('img');
            imageElement.src = `assets/recipes/${recipe.image}`;
            imageElement.alt = `Image de ${recipe.name}`;
            imageElement.classList.add('recipe-image');
            recipeElement.appendChild(imageElement);
        
            const nameElement = document.createElement('h3');
            nameElement.textContent = recipe.name;
            nameElement.classList.add('recipe-title');
            recipeElement.appendChild(nameElement);
        
            const ingredientsElement = document.createElement('ul');
            ingredientsElement.classList.add('ingredients-list');
            recipe.ingredients.forEach(ingredient => {
                const li = document.createElement('li');
                li.classList.add('ingredient-item');
                li.textContent = `${ingredient.ingredient} ${ingredient.quantity || ''} ${ingredient.unit || ''}`.trim();
                ingredientsElement.appendChild(li);
            });
            recipeElement.appendChild(ingredientsElement);
        
            const descriptionElement = document.createElement('p');
            descriptionElement.classList.add('recipe-description');
            descriptionElement.textContent = `Description: ${recipe.description}`;
            recipeElement.appendChild(descriptionElement);
        
            recipesDiv.appendChild(recipeElement);

            return true;
        });
    }    
       

    getUniqueTags(recipes, field) {
        const tags = new Set();
    
        recipes.forEach(recipe => {
            const fieldData = recipe[field];
            
            if (Array.isArray(fieldData)) {
                fieldData.forEach(item => {
                    if(field === 'ingredients'){
                        tags.add(item.ingredient);
                    } else {
                        tags.add(item);
                    }
                });
            } else if (fieldData) {
                tags.add(fieldData);
            }
        });
    
        console.log('getUniqueTags found tags:', Array.from(tags));
        return Array.from(tags);
    }    

    getExactMatchTags(recipes, field, query) {
        const tags = new Set();
        recipes.forEach(recipe => {
            if (Array.isArray(recipe[field])) {
                recipe[field].forEach(item => {
                    const value = item.ingredient || item;
                    if(value.toLowerCase().includes(query.toLowerCase())) {
                        tags.add(value);
                    }
                });
            } else if (recipe[field] && recipe[field].toLowerCase().includes(query.toLowerCase())) {
                tags.add(recipe[field]);
            }
        });
        return Array.from(tags);
    }
    
    displayTags(recipes) {
        console.log('displayTags called with recipes:', recipes);
        
        const selectedTagsContainer = document.getElementById('selected-tags-container');
        const selectedTags = Array.from(selectedTagsContainer.children).map(span => span.textContent);
    
        const ingredientTags = this.getUniqueTags(recipes, 'ingredients').filter(tag => !selectedTags.includes(tag));
        const ustensilTags = this.getUniqueTags(recipes, 'ustensils').filter(tag => !selectedTags.includes(tag));
        const applianceTags = this.getUniqueTags(recipes, 'appliance').filter(tag => !selectedTags.includes(tag));
        
        this.renderTags('ingredient-tags-container', ingredientTags);
        this.renderTags('utensil-tags-container', ustensilTags);
        this.renderTags('appliance-tags-container', applianceTags);
    }    

    renderTags(containerId, tags) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        tags.forEach(tag => {
            const span = document.createElement('span');
            span.textContent = tag;
            span.classList.add('tag', 'recipe-tag');
            span.addEventListener('click', () => this.selectTag(tag, containerId));
            container.appendChild(span);
        });
    }    
    
    selectTag(tag, containerId) {
        const selectedTagsContainer = document.getElementById('selected-tags-container');
        const span = document.createElement('span');
        span.textContent = tag;
        span.classList.add('tag', 'selected-recipe-tag');
        span.addEventListener('click', () => {
            selectedTagsContainer.removeChild(span);
            const currentSearchQuery = document.getElementById('searchbar').value.trim().toLowerCase();
            this.searchAndUpdate(currentSearchQuery);
        });
        selectedTagsContainer.appendChild(span);
        const currentSearchQuery = document.getElementById('searchbar').value.trim().toLowerCase();
        this.searchAndUpdate(currentSearchQuery);
    }
    
    searchRecipesWithSelectedTags() {
        const selectedTagsContainer = document.getElementById('selected-tags-container');
        const selectedTags = Array.from(selectedTagsContainer.children).map(span => span.textContent);
        const filteredRecipes = this.searchRecipesWithTags(selectedTags);

        this.displayRecipes(filteredRecipes); 
        this.displayTags(filteredRecipes); 
    }

    searchRecipesWithTags(recipes, tags) {
        return recipes.filter(recipe => 
            tags.every(tag => 
                (recipe.ingredients?.map(item => item.ingredient.toLowerCase()) ?? []).includes(tag.toLowerCase()) ||
                (recipe.ustensils?.map(utensil => utensil.toLowerCase()) ?? []).includes(tag.toLowerCase()) ||
                (recipe.appliance && recipe.appliance.toLowerCase() === tag.toLowerCase())
            )
        );
    }
    
}
