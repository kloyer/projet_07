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

        recipes.forEach(recipe => {
            const recipeElement = document.createElement('div');

            const nameElement = document.createElement('h3');
            nameElement.textContent = recipe.name;
            recipeElement.appendChild(nameElement);

            const ingredientsElement = document.createElement('ul');
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
            recipeElement.appendChild(ingredientsElement);

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = `Description: ${recipe.description}`;
            recipeElement.appendChild(descriptionElement);

            recipesDiv.appendChild(recipeElement);
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
        
        // Ajout du conteneur de la barre de recherche
        const searchContainer = document.createElement('div');
        searchContainer.classList.add('tag-search-container');
        container.appendChild(searchContainer);
        
        // Ajout de la barre de recherche
        const searchInput = document.createElement('input');
        searchInput.type = "text";
        searchInput.placeholder = "Recherche...";
        searchInput.classList.add('tag-search');
        searchInput.addEventListener('input', (event) => {
            const query = event.target.value.trim().toLowerCase();
            this.filterAndDisplayTags(containerId, query);
        });
        searchContainer.appendChild(searchInput);
        
        // Ajout de l'icône de recherche
        const searchIcon = document.createElement('i');
        searchIcon.classList.add('bi', 'bi-search', 'tag-search-icon');
        searchContainer.appendChild(searchIcon);
        
        // Ajout des tags
        tags.forEach(tag => {
            const span = document.createElement('span');
            span.textContent = tag;
            span.classList.add('tag', 'recipe-tag');
            span.addEventListener('click', () => this.selectTag(tag, containerId));
            container.appendChild(span);
        });
    }    
    
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
    
    

    getTypeFromContainerId(containerId) {
        switch(containerId) {
            case 'ingredient-tags-container': return 'ingredients';
            case 'utensil-tags-container': return 'ustensils';
            case 'appliance-tags-container': return 'appliance';
            default: return '';
        }
    }      
    
    selectTag(tag, containerId) {
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
