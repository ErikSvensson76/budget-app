/*
    Module pattern because we want encapsulation and separation of concerns
*/

//Budget Controller
const budgetController = (() => {

    let Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    let Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: (type, description, value) => {
            var newItem, id = 0;

            //Create new id            
            if(data.allItems[type].length > 0){
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                id = 0;
            }
            

            if(type === 'exp'){
                newItem = new Expense(id, description, value);
            }                 
            else if (type === 'inc'){ 
                newItem = new Income(id, description, value);
            }                

            //Type is exp or inc which are exactly the same as in data.allItems, therefore we can use the type inside brackets to select the array
            data.allItems[type].push(newItem);
            return newItem;
        },
        //REMOVE THIS LATER :)
        testing: () => console.log(data)

    };

})();

// UI Controller
const UIController = (() =>{

    const selectors  =  {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };

    return{
        getInput: () => {
            
            return{
                type: document.querySelector(selectors.inputType).value, //Either inc or exp
                description: document.querySelector(selectors.inputDescription).value,
                value: document.querySelector(selectors.inputValue).value
            };            
        },

        addListItem: (obj, type) =>{
            let html, newHtml, element;

            //Create HTML string with placeholder text
            if(type === 'inc'){
                element = selectors.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type ==='exp'){
                element = selectors.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace the placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);


            //Insert the html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        getSelectors: () => selectors
    };

})();

//Global APP Controller
const controller = ((budgetCtrl, UICtrl) =>{

    let setupEventListeners = () =>{
            let selectors = UIController.getSelectors();
            document.querySelector(selectors.inputBtn).addEventListener('click', ctrlAddItem);

            document.addEventListener('keypress', (event) => {            
                if(event.keyCode === 13){
                    ctrlAddItem();
                }
            });
    };

    

    let ctrlAddItem = () =>{
        let input, newItem;

        //1. Get the field input data
        input = UICtrl.getInput();
     
        //2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);

        
    };

    return{
        init: () => {
            console.log('Application has started');
            setupEventListeners();
        }
    };

    

})(budgetController, UIController); 

controller.init();

