/*
    Module pattern because we want encapsulation and separation of concerns
*/

//Budget Controller
const budgetController = (() => {

    //TODO

})();

// UI Controller
const UIController = (() =>{

    //TODO

})();

//Global APP Controller
const controller = ((budgetCtrl, UICtrl) =>{

    const ctrlAddItem = () =>{
        console.log('It is working');
    }

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', (event) => {
        if(event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
    });

})(budgetController, UIController); 



