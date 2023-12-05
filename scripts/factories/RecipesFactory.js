export default class RecipesFactory {
    // Constructor to initialize the recipes array
    constructor() {
        this.recipes = [];
    }
    // Create and return a new recipe object
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
    // Load recipes into the factory's array
    loadRecipes(rawData) {
        this.recipes = rawData.map(d => this.create(d));
    }
    // Search recipes by name or description
    searchRecipes(query) {
        const results = [];
        for (let i = 0; i < this.recipes.length; i++) {
            const recipe = this.recipes[i];
            const lowerCaseName = recipe.name ? recipe.name.toLowerCase() : '';
            const lowerCaseDescription = recipe.description ? recipe.description.toLowerCase() : '';
    
            const isInName = lowerCaseName.includes(query);
            const isInDescription = lowerCaseDescription.includes(query);
            const isInIngredients = Array.isArray(recipe.ingredients) && recipe.ingredients.some(item => {
                return item.ingredient.toLowerCase().includes(query);
            });
    
            if (isInName || isInDescription || isInIngredients) {
                results.push(recipe);
            }
        }
        return results;
    } 
    // Search for recipes based on query and update the UI
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
        
        this.displayRecipes(filteredRecipes, query);
        this.displayTags(filteredRecipes);
    }    
    // Display the recipes on the UI
    displayRecipes(recipes, query) {
        const recipesDiv = document.getElementById('recipes');
        recipesDiv.innerHTML = '';

        if (recipes.length === 0) {
            const errorMessage = document.createElement('p');
            errorMessage.textContent = `Aucune recette ne contient ${query} vous pouvez chercher «tarte aux pommes », « poisson », etc.`;
            errorMessage.classList.add('error-message');
            recipesDiv.appendChild(errorMessage);
            return;
        }
        
        recipes.forEach(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.classList.add('recipe-item');
        
            const imageElement = document.createElement('img');
            imageElement.src = `assets/recipes/${recipe.image}`;
            imageElement.alt = `Image de ${recipe.name}`;
            imageElement.classList.add('recipe-image');
            recipeElement.appendChild(imageElement);
        
            // Conteneur pour le contenu sous l'image
            const contentContainer = document.createElement('div');
            contentContainer.classList.add('recipe-content');
            
            const nameElement = document.createElement('h3');
            nameElement.textContent = recipe.name;
            nameElement.classList.add('recipe-title');
            contentContainer.appendChild(nameElement);
    
            // Sous-titre "Recette"
            const recipeSubtitle = document.createElement('h4');
            recipeSubtitle.textContent = "Recette";
            recipeSubtitle.classList.add('recipe-subtitle');
            contentContainer.appendChild(recipeSubtitle);
    
            const descriptionElement = document.createElement('p');
            descriptionElement.classList.add('recipe-description');
            descriptionElement.textContent = recipe.description;
            contentContainer.appendChild(descriptionElement);
    
            // Sous-titre "Ingrédient"
            const ingredientSubtitle = document.createElement('h4');
            ingredientSubtitle.textContent = "Ingrédients";
            ingredientSubtitle.classList.add('ingredient-subtitle');
            contentContainer.appendChild(ingredientSubtitle);
    
            const ingredientsElement = document.createElement('ul');
            ingredientsElement.classList.add('ingredients-list');
            recipe.ingredients.forEach(ingredient => {
                const li = document.createElement('li');
                li.classList.add('ingredient-item');
    
                // Nom de l'ingrédient
                const ingredientName = document.createElement('div');
                ingredientName.textContent = ingredient.ingredient;
                li.appendChild(ingredientName);
    
                // Quantité et unité
                if (ingredient.quantity || ingredient.unit) {
                    const quantity = document.createElement('div');
                    quantity.textContent = `${ingredient.quantity || ''} ${ingredient.unit || ''}`.trim();
                    quantity.classList.add('ingredient-quantity');
                    li.appendChild(quantity);
                }
                ingredientsElement.appendChild(li);
            });
            contentContainer.appendChild(ingredientsElement);
    
            recipeElement.appendChild(contentContainer);
            recipesDiv.appendChild(recipeElement);
    
            // Mise à jour du compteur de recettes
            this.updateRecipeCount(recipes.length);
        });
    }    
    // Update the number of recipes displayed
    updateRecipeCount(count) {
        const recipeCountElement = document.querySelector('.recipes_count');
        recipeCountElement.textContent = `${count} Recettes`;
    }    
    // Get unique tags from recipes
    getUniqueTags(recipes, field) {
        const tags = new Set();
        
        recipes.forEach(recipe => {
            const fieldData = recipe[field];
    
            if (Array.isArray(fieldData)) {
                fieldData.forEach(item => {
                    if(field === 'ingredients'){
                        tags.add(item.ingredient.toLowerCase());
                    } else {
                        tags.add(item.toLowerCase());
                    }
                });
            } else if (fieldData) {
                tags.add(fieldData.toLowerCase());
            }
        });

        return Array.from(tags);
    }  
    // Get exact match tags from recipes
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
    // Display tags in the UI
    displayTags(recipes) {
        const selectedTagsContainer = document.getElementById('selected-tags-container');
        const selectedTags = Array.from(selectedTagsContainer.children).map(span => span.textContent);
    
        const ingredientTags = this.getUniqueTags(recipes, 'ingredients').filter(tag => !selectedTags.includes(tag));
        const ustensilTags = this.getUniqueTags(recipes, 'ustensils').filter(tag => !selectedTags.includes(tag));
        const applianceTags = this.getUniqueTags(recipes, 'appliance').filter(tag => !selectedTags.includes(tag));
        
        this.renderTags('ingredient-tags-container', ingredientTags);
        this.renderTags('utensil-tags-container', ustensilTags);
        this.renderTags('appliance-tags-container', applianceTags);
    }    
    // Render tag elements
    renderTags(containerId, tags) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        const searchContainer = document.createElement('div');
        searchContainer.classList.add('tag-search-container');
        container.appendChild(searchContainer);

        const searchInput = document.createElement('input');
        searchInput.type = "text";
        searchInput.placeholder = "Recherche...";
        searchInput.classList.add('tag-search');
        searchInput.addEventListener('input', (event) => {
            const query = event.target.value.trim().toLowerCase();
            this.filterAndDisplayTags(containerId, query);
        });
        searchContainer.appendChild(searchInput);

        const searchIcon = document.createElement('i');
        searchIcon.classList.add('bi', 'bi-search', 'tag-search-icon');
        searchContainer.appendChild(searchIcon);

        tags.forEach(tag => {
            const span = document.createElement('span');
            span.textContent = tag;
            span.classList.add('tag', 'recipe-tag');
            span.addEventListener('click', () => this.selectTag(tag, containerId));
            container.appendChild(span);
        });
    }    
    // Filter and display tags based on search
    filterAndDisplayTags(containerId, tagSearchQuery) {
        const container = document.getElementById(containerId);
        const mainSearchQuery = document.getElementById('searchbar').value.trim().toLowerCase();

        const allTags = this.getUniqueTags(this.recipes, this.getTypeFromContainerId(containerId));

        const filteredTags = allTags.filter(tag => tag.toLowerCase().includes(tagSearchQuery));

        const inputElement = container.querySelector('.tag-search');
        const currentInputValue = inputElement.value;
        const cursorPosition = inputElement.selectionStart;

        this.renderTags(containerId, filteredTags);

        const updatedInputElement = container.querySelector('.tag-search');
        updatedInputElement.value = currentInputValue;
        updatedInputElement.setSelectionRange(cursorPosition, cursorPosition);
        updatedInputElement.focus();
    }
    // Get the type based on container ID
    getTypeFromContainerId(containerId) {
        switch(containerId) {
            case 'ingredient-tags-container': return 'ingredients';
            case 'utensil-tags-container': return 'ustensils';
            case 'appliance-tags-container': return 'appliance';
            default: return '';
        }
    }      
    // Add a selected tag to the UI
    selectTag(tag, containerId) {
        tag = tag.toLowerCase();
        const selectedTagsContainer = document.getElementById('selected-tags-container');
        const tagSpan = document.createElement('span');
        tagSpan.textContent = tag;
        tagSpan.classList.add('tag', 'selected-recipe-tag');
    
        const closeIcon = document.createElement('img');
        closeIcon.src = 'assets/img/cross.svg';
        closeIcon.alt = 'Remove tag';
        closeIcon.classList.add('close-icon');
        closeIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            selectedTagsContainer.removeChild(tagSpan);
            const currentSearchQuery = document.getElementById('searchbar').value.trim().toLowerCase();
            this.searchAndUpdate(currentSearchQuery);
        });
    
        tagSpan.appendChild(closeIcon);
        selectedTagsContainer.appendChild(tagSpan);
        const currentSearchQuery = document.getElementById('searchbar').value.trim().toLowerCase();
        this.searchAndUpdate(currentSearchQuery);
    }
    // Search recipes with selected tags
    searchRecipesWithSelectedTags() {
        const selectedTagsContainer = document.getElementById('selected-tags-container');
        const selectedTags = Array.from(selectedTagsContainer.children).map(span => span.textContent);
        const filteredRecipes = this.searchRecipesWithTags(selectedTags);

        this.displayRecipes(filteredRecipes); 
        this.displayTags(filteredRecipes); 
    }
    // Filter recipes based on provided tags
    searchRecipesWithTags(recipes, tags) {
        return recipes.filter(recipe => 
            tags.every(tag => 
                (recipe.ingredients?.map(item => item.ingredient.toLowerCase()) ?? []).includes(tag.toLowerCase()) ||
                (recipe.ustensils?.map(utensil => utensil.toLowerCase()) ?? []).includes(tag.toLowerCase()) ||
                (recipe.appliance && recipe.appliance.toLowerCase() === tag.toLowerCase())
            )
        );
    }
    // Initialize the tag search functionality
    initTagSearch() {
        const tagInputs = document.querySelectorAll('.tag-search');
        tagInputs.forEach(input => {
            input.addEventListener('input', (event) => {
                const query = event.target.value.trim().toLowerCase();
                const containerId = event.target.parentNode.id;
                this.filterAndDisplayTags(containerId, query);
            });
        });
    }  
}
