// MODULE PATTERN PROJECT

// STORAGE CONTROLLER


// ITEM CONTROLLER
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
            {id: 0, name: 'Steak Dinner', calories: 1500},
            {id: 1, name: 'Cookie', calories: 450},
            {id: 2, name: 'Eggs', calories: 350}
        ],
        currentItem: null,
        totalCalories: 0
    }

    // public methods
    return{
        getItems: function(){
            return data.items;
        },
        logData: function(){
            return data;
        }
    }

})();

// UI CONTROLLER
const UICtrl = (function(){
    // All UI Vars for easy changes
    const UISelectors = {
        itemList: '#item-list'
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
        }
    }
})();

// APP CONTROLLER
const App = (function(ItemCtrl, UICtrl){
    
    // Returning from module makes public 
    return {
        init: function() {

            // Fetch Items from data structure
            const items = ItemCtrl.getItems();

            // Populate List with Items
            UICtrl.populateItemList(items);
        }
    }

})(ItemCtrl, UICtrl);

// Initialize App
App.init();