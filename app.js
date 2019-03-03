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
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else{
            this.percentage = -1;
        }       
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
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

        deleteItem: (type, id) => { 
            let index, idArray;         

            /* Non ES6 way
                let idArray = data.allItems[type].map(function(current){
                    return current.id;
                });
            */                   

            idArray = data.allItems[type].map(current => current.id);      

            index = idArray.indexOf(id);              

            if(index !== -1){
                //index param is delete from position and 1 param is how many
                data.allItems[type].splice(index, 1);
            }
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

        calculatePercentages: () => data.allItems.exp.forEach(current => current.calcPercentage(data.totals.inc)), 

        getPercentages: () => data.allItems.exp.map(current => current.getPercentage()),

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
        budgetExpensesPercentage: '.budget__expenses--percentage',
        container: '.container',
        itemPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    const formatNumber =  (num, type) =>{
        let numSplit, integerPart, decimalPart;

        /*
            + or - before number
            2 decimals
            comma separating the thousands

            2345.3421 -> + 2,345.34
            2000 -> + 2,000.00
        */

        //Math.abs return a positive number
        num = Math.abs(num);
        //Always put 2 decimal numbers also converts it to string
        num = num.toFixed(2);

        numSplit = num.split('.');

        integerPart = numSplit[0];

        //If it has more than 3 numbers its a thousand or more
        if(integerPart.length > 3){
            integerPart = integerPart.substr(0,integerPart.length -3) + ',' + integerPart.substr(integerPart.length - 3, 3);
            //input 23510, output 23,510
        }

        decimalPart = numSplit[1];      

        return (type === 'exp' ? '-' :  '+') + ' ' + integerPart + '.' + decimalPart;

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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type ==='exp'){
                element = selectors.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace the placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            //Insert the html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: (selectorID) => {
            let element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },

        clearFields: () => {
            let fields,fieldsArray;            
            fields = document.querySelectorAll(selectors.inputDescription + ', ' + selectors.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);            
            fieldsArray.forEach(current => current.value="");
            fieldsArray[0].focus();
        },

        displayBudget: (obj) => {
            const type = obj.budget > 0 ? 'inc' : 'exp';

            document.querySelector(selectors.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(selectors.budgetIncomeValue).textContent = formatNumber(obj.totalIncome, 'inc');
            document.querySelector(selectors.budgetExpensesValue).textContent = formatNumber(obj.totalExpenses, 'exp');
            if(obj.percentage > 0){
                document.querySelector(selectors.budgetExpensesPercentage).textContent = obj.percentage + '%';
            }else{
                document.querySelector(selectors.budgetExpensesPercentage).textContent = '---';
            }
        },

        displayPercentages: (percentages) =>{
            //const fields will be a node list
            let fields = document.querySelectorAll(selectors.itemPercentageLabel);

            const nodeListForEach = (list, callback) =>{
                for(let i=0; i<list.length; i++){
                    callback(list[i], i);
                }
            };

            nodeListForEach(fields, (current, index) => {
                current.textContent = percentages[index] > 0 ? percentages[index] + '%' : '---';
            });

        },
        
        displayMonth: () =>{
            let now, months;
            now = new Date();
            
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            document.querySelector(selectors.dateLabel).textContent = months[now.getMonth()] + ' ' + now.getFullYear();
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
                if(event.keyCode === 13 || event.which === 13){
                    ctrlAddItem();
                }
            });

            document.querySelector(selectors.container).addEventListener('click', ctrlDeleteItem);
    };

    const updateBudget = () =>{

        //1. Calculate the budget
        budgetCtrl.calculateBudget();

        //2. get the budget
        let budget = budgetCtrl.getBudget();

        //3. Display the budget to the UI
        UICtrl.displayBudget(budget);

    };

    const updatePercentages = () => {

        //1. Calculate percentages
        budgetCtrl.calculatePercentages();

        //2. Read percentages from the budget controller
        const percentages = budgetCtrl.getPercentages();

        //3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);

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

            //6. Calculate and update the percentages
            updatePercentages();
        }
    };

    const ctrlDeleteItem = (event) => {
        let itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            

            //1. Delete item from data structure
            budgetCtrl.deleteItem(type, ID);
            //2. Delete item from UI
            UICtrl.deleteListItem(itemID);
            //3. Update and show the new budget
            updateBudget();
            //6. Calculate and update the percentages
            updatePercentages();
        }
    };

    return{
        init: () => {
            console.log('Application has started');
            UICtrl.displayMonth();
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

