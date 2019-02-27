/*
    Module pattern because we want encapsulation and separation of concerns
*/

//Budget Controller
const budgetController = (() => {

    //TODO

})();

// UI Controller
const UIController = (() =>{

    const selectors  =  {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return{
        getInput: () => {
            
            return{
                type: document.querySelector(selectors.inputType).value, //Either inc or exp
                description: document.querySelector(selectors.inputDescription).value,
                value: document.querySelector(selectors.inputValue).value
            };            
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
        //1. Get the field input data
        let input = UICtrl.getInput();
     


        
    };

    return{
        init: () => {
            console.log('Application has started');
            setupEventListeners();
        }
    };

    

})(budgetController, UIController); 

controller.init();

