// MODULE PATTERN PROJECT

/////////////////////////////////////// STORAGE CONTROLLER ///////////////////////////////////////
const StorageCtrl = (function(){

    // Public Methods
    return {
        storeItem: function(item){
            let items;
            // Check if there are already items in the LS
            if(localStorage.getItem('items')===null){
                items = [];
                // Push new item
                items.push(item);
                // Set LS
                localStorage.setItem('items', JSON.stringify(items));
            }
            else {
                // Get what is already in LS and parse to obj
                items = JSON.parse(localStorage.getItem('items'));

                // Push new item
                items.push(item);

                // Re-set LS
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function(){
            let items;

            if(localStorage.getItem('items')===null){
                items = [];
            }
            else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });

            // Re-set LS
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });

            // Re-set LS
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();

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
        // items: [
        //     // {id: 0, name: 'Steak Dinner', calories: 1500},
        //     // {id: 1, name: 'Cookie', calories: 450},
        //     // {id: 2, name: 'Eggs', calories: 350}
        // ],
        items: StorageCtrl.getItemsFromStorage(),
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
        getItemById: function(id){
            let found = null;
            // Loop through data
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, calories){
            // Calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id){
            // Get ids
            ids = data.items.map(function(item) {
                return item.id;
            });

            // Get index
            const index = ids.indexOf(id);

            // Remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function(){
            data.items = [];
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
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
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
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
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `
                    <strong>${item.name}: </strong> <em>${item.calories}</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                    `;
                }
            });
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();

            // Not working..
            if(!(document.querySelector(UISelectors.itemList).hasChildNodes())){
                document.querySelector(UISelectors.itemList).style.display = 'none';
            }
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function(){
            // let listItems = document.querySelectorAll();
            document.querySelector(UISelectors.itemList).innerHTML = ``;
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        hideLists: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function(){
            return UISelectors;
        }
    }
})();

/////////////////////////////////////// APP CONTROLLER ///////////////////////////////////////
const App = (function(ItemCtrl, UICtrl, StorageCtrl){
    // Load Event Listeners
    const loadEventListeners = function(){
        // Get selectors from UI 
        UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on ENTER
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13 || e.code === 13){
                e.preventDefault();
                return false;
            }
        });

        // Edit icon event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
        
        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
        
        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
        
        // Clear all button event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
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

            // Store in LS
            StorageCtrl.storeItem(newItem);

            // Clear fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    // Click edit item
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            // Get list item ID
            // target is icon -> parent: a -> parent: li
            const listId = e.target.parentNode.parentNode.id;

            // Break down into array to get the id #
            const listIdArr = listId.split('-');

            // Get actual id #
            const id = parseInt(listIdArr[1]);

            // Get item obj
            const itemToEdit = ItemCtrl.getItemById(id);

            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    // Update item event
    const itemUpdateSubmit = function(e){
        // Get item inputs
        const input = UICtrl.getItemInput();

        // Update the item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        console.log(updatedItem);

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Update LS
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();
        
        e.preventDefault();
    }

    // Item Delete Submit
    const itemDeleteSubmit = function(e){
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Delete from LS
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Clear items event
    const clearAllItemsClick = function(){
        // Erase data structure
        ItemCtrl.clearAllItems();

        
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);
        
        // Remove from UI
        UICtrl.removeItems();

        // Clear from LS
        StorageCtrl.clearItemsFromStorage();
    }
    
    // Returning from module makes public 
    return {
        init: function() {
            // Clear edit state/set initial state
            UICtrl.clearEditState();

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

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Load Event Listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, UICtrl, StorageCtrl);

// Initialize App
App.init();