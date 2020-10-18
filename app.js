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
        logData: function(){
            return data;
        }
    }

})();

// UI CONTROLLER
const UICtrl = (function(){
    
    // public methods
    return {

    }
})();

// APP CONTROLLER
const App = (function(ItemCtrl, UICtrl){
    
    // Returning from module makes public 
    return {
        init: function() {
            console.log('Init app')
        }
    }

})(ItemCtrl, UICtrl);

// Initialize App
App.init();