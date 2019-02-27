/*
    Module pattern because we want encapsulation and separation of concerns
    We do that by implementing so called IIFE's.
*/

//Budget Controller IIFE
const budgetController = (() => {

    let Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    const calculateTotal = type => {
        let sum = 0;
        data.allItems[type].forEach(current => sum += current.value);
        data.totals[type] = sum;
    };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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

        calculateBudget: () =>{

            //Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //Calculate the budget income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //Calculate percentage of income we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage = -1;
            }
            

        },

        getBudget: () =>{
            return{
                budget : data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage: data.percentage
            };
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        budgetIncomeValue: '.budget__income--value',
        budgetExpensesValue: '.budget__expenses--value',
        budgetExpensesPercentage: '.budget__expenses--percentage'
    };

    return{
        getInput: () => {
            
            return{
                type: document.querySelector(selectors.inputType).value, //Either inc or exp
                description: document.querySelector(selectors.inputDescription).value,
                value: parseFloat(document.querySelector(selectors.inputValue).value)
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

        clearFields: () => {
            let fields,fieldsArray;            
            fields = document.querySelectorAll(selectors.inputDescription + ', ' + selectors.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);            
            fieldsArray.forEach(current => current.value="");
            fieldsArray[0].focus();
        },

        displayBudget: (obj) => {
            document.querySelector(selectors.budgetLabel).textContent = obj.budget;
            document.querySelector(selectors.budgetIncomeValue).textContent = obj.totalIncome;
            document.querySelector(selectors.budgetExpensesValue).textContent = obj.totalExpenses;
            if(obj.percentage > 0){
                document.querySelector(selectors.budgetExpensesPercentage).textContent = obj.percentage + '%';
            }else{
                document.querySelector(selectors.budgetExpensesPercentage).textContent = '---';
            }
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

    const updateBudget = () =>{

        //1. Calculate the budget
        budgetCtrl.calculateBudget();

        //2. get the budget
        let budget = budgetCtrl.getBudget();

        //3. Display the budget to the UI
        UICtrl.displayBudget(budget);

    };

    const ctrlAddItem = () =>{
        let input, newItem;

        //1. Get the field input data
        input = UICtrl.getInput();
     
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){        

            //2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            
            //4. Clear the input fields
            UIController.clearFields();

            //5. Calculate and update the budget
            updateBudget();
        }

    };

    return{
        init: () => {
            console.log('Application has started');
            UICtrl.displayBudget({
                budget : 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

    

})(budgetController, UIController); 

controller.init();

