// MODULE PATTERN PROJECT

/////////////////////////////////////// STORAGE CONTROLLER ///////////////////////////////////////


/////////////////////////////////////// ITEM CONTROLLER ///////////////////////////////////////
// IFFE, immediately invoked
const ItemCtrl = (function(){
    // Item Constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        items: [
            // {id: 0, name: 'Steak Dinner', calories: 1500},
            // {id: 1, name: 'Cookie', calories: 450},
            // {id: 2, name: 'Eggs', calories: 350}
        ],
        currentItem: null,
        totalCalories: 0
    }

    // public methods
    return{
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            let ID;
            // Create ID
            if(data.items.length > 0){
                // Grabbing the last item in data.items and adding one to it's ID for auto increment
                ID = data.items[data.items.length - 1].id + 1;
            }  
            else {
                ID = 0;
            }

            // Calories to number
            calories = parseInt(calories);

            // Create new item
            newItem = new Item(ID, name, calories);

            // Add to items array
            data.items.push(newItem);

            return newItem;
        },
        getTotalCalories: function(){
            let total = 0;
            // Loop and get total calories 
            data.items.forEach(function(item){
                total += item.calories;
            });

            // Set total calories in data structure
            data.totalCalories = total;

            return data.totalCalories;
        },
        logData: function(){
            return data;
        }
    }

})();

/////////////////////////////////////// UI CONTROLLER ///////////////////////////////////////
const UICtrl = (function(){
    // All UI Vars for easy changes
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }
    
    // public methods
    return {
        populateItemList: function(items){
            let html = '';
            // Create HTML for each item 
            items.forEach(function(item){
                html += `
                <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories}</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                </li>`;
            });

            // Insert list items 
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            // Show list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            // Add class
            li.className = 'collection-item';
            // Add ID
            li.id = `item-${item.id}`;
            // Add HTML
            li.innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories}</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            `;
            // Insert Item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        hideLists: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        getSelectors: function(){
            return UISelectors;
        }
    }
})();

/////////////////////////////////////// APP CONTROLLER ///////////////////////////////////////
const App = (function(ItemCtrl, UICtrl){
    // Load Event Listeners
    const loadEventListeners = function(){
        // Get selectors from UI 
        UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    }

    // Add Item
    const itemAddSubmit = function(e) {
        // Get form input from UI Controller
        const input = UICtrl.getItemInput();

        // check for name and calorie input
        if(input.name !== '' && !(isNaN(parseInt(input.calories)))){
            // Add Item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // Add Item to UI
            UICtrl.addListItem(newItem);

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Clear fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }
    
    // Returning from module makes public 
    return {
        init: function() {

            // Fetch Items from data structure
            const items = ItemCtrl.getItems();

            // Check if there are items
            if(items.length === 0){
                UICtrl.hideLists();
            }
            else {
                // Populate List with Items
                UICtrl.populateItemList(items);
            }

            // Load Event Listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, UICtrl);

// Initialize App
App.init();