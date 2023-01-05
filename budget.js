var budgetcontrol = (function () {
    var data, Income, Expense;
    Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;        
    };   
    
    
    Expense = function(id, description, value, percentage){
        this.id = id;
        this.description= description;
        this.value = value;
        this.percentage = -1
    };
    
    Expense.prototype.calpercentage = function(totinc){
        if (totinc > 0){
            this.percentage = Math.round((this.value / totinc) * 100);
        }else{ this.percentage = -1}
    };
    
    var calculateTotals = function(type){
        var sum = 0;
        data.allitems[type].forEach(function(cur){
            sum = sum + cur.value;
        });
        data.totals[type] = sum;
        
    };
    
    
    data = {
    allitems: {
        inc: [],
        exp: [],
        },
    totals:{
        inc: 0,
        exp : 0,
        },
     budget: 0,
    percentage: -1
         
        
    };
        
    return {
            addItems: function (type, des, value) {
            var id, newitems;
                if (data.allitems[type].length > 0) {
                    var id = data.allitems[type][data.allitems[type].length - 1].id + 1;   
                } else {
                    id = 0;
                }
        
        
            if (type === 'inc'){
            newitems = new Income(id, des, value);
            }   else if (type === 'exp'){
                newitems = new Expense(id, des, value);
            }
            data.allitems[type].push(newitems);
            return newitems;   
    },
       // DELETE BUDGET
        
        deleteItm: function(type, id){
            var ids, index;
            ids = data.allitems[type].map(function(cur){         return cur.id               
            });
            index = ids.indexOf(id);
            
            if(index !== -1){
                data.allitems[type].splice(index, 1);
            };     
            
        },
        //calculate the budgdet
        calculateBud: function() {
        // 1. calc the total income and expenses
        calculateTotals('inc');
        calculateTotals('exp');
        
        // 2. calc the budget
        data.budget = data.totals.inc - data.totals.exp;
        
        
        // 3 calc the percentage
        if(data.totals.inc !== 0)
        {data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        }else {
            data.percentage = -1
        }
            
        
    },
        
        
        calculatepercent: function(type){
            // 
            
            
        },
        // get the budget returned for use
        getbudget: function(){
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalsInc: data.totals.inc,
                totalsExp: data.totals.exp,
            };
        },
        testing: function () {
           console.log(data);
    },
       
    };   
        
})();
        
        

var uIcontrol = (function () {
    var DOMstrings = {
        inputType: '.add__type',
        description: '.add__description',
        value: '.add__value',
        addButton: '.add__btn',
        incomelist: '.income__list',
        expenseslist: '.expenses__list',
        budgetLabel:   '.budget__value',
        incomeLabel:    '.budget__income--value',
        expenseLabel:   '.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
    };
        return {
        getInput: function () {
        return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.description).value,
        value: parseFloat(document.querySelector(DOMstrings.value).value),
        };
           
    },
        addListItem: function (obj, type) {
            var html, newhtml, element;
          // create html with placeholders
            if (type === 'inc') {
            element = DOMstrings.incomelist
                
           html= '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix">                    <div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn">delete<img src="botton.PNG" width="20px" height="20px"> </button></div></div></div>'
               
            }else if(type==='exp'){
                element= DOMstrings.expenseslist
              html= '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix">         <div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><img src="botton.PNG" width="20px" height="20px"></button>                   </div></div></div>' 
            };
            
           newhtml= html.replace('%id%', obj.id);
            newhtml= newhtml.replace('%description%', obj.description );
            newhtml= newhtml.replace('%value%', obj.value);
            
           document.querySelector(element).insertAdjacentHTML('beforeend', newhtml);
            
        },
            
            removeItem: function(slctid){
                
                var el = document.getElementById(slctid);
                
                el.parentNode.removeChild(el);
                
                
            },
            
            clearfield: function(){
                var fields = document.querySelectorAll(DOMstrings.description + ', ' + DOMstrings.value);
                                
               var Arrfield =  Array.prototype.slice.call(fields);
                
                Arrfield.forEach(function(cur,index, array){
                   cur.value = ""; 
                    
                });
                Arrfield[0].focus();
                
            },
            
            displayBud: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;  
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalsInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalsExp;
                
            if(obj.percentage > 0){            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
                 
            }else {
                
            document.querySelector(DOMstrings.percentageLabel).textContent = '0%';
            
            };
        
        
        
                  
    },
            getDOMstring: function(){
            return DOMstrings;
                
            
        
        },
    }
     
    
           
})();

var appcontrol = (function(bud, UI){
     var calcBudget= function(){
          // 4. calculate the budget 
         bud.calculateBud();
         // return budget
         var appbudget = bud.getbudget();
         // update the UI
         UI.displayBud(appbudget);
     };
    
    var perform = function(){
        // 1. get values from the UI
        var input = UI.getInput();
        
        if(input.description !== "" && !isNaN(input.value && input.value > 0)){
        // 2. add to the budgetcontrol
        var items = bud.addItems(input.type, input.description, input.value);
        // 3. update the Ui
        UI.addListItem(items, input.type);
        
        // clear the field
        UI.clearfield();
        // calculate budget gotten from th fuuction above
        
        calcBudget();
            
        updatepercentage();
       
          
        };
        
    };
    
    var deleteItem = function(event){
        var itemID, splitID, ID, typeID
        itemID= (event.target.parentNode.parentNode.parentNode.parentNode.id);
        
        
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
        
            bud.deleteItm(type, ID);
            
            UI.removeItem(itemID);
            
            calcBudget();
            
            updatepercentage();
            
            
        
        };
        
        
    };
    
    var updatepercentage = function(){
        // calc tnhe percentage
        
        // read them frm teh budg
        
        
        // update the UI
        
        
    };
    
    
    
    
    
      var setEventListerners = function(){
        document.querySelector('.add__btn').addEventListener('click',  perform);
          document.addEventListener('keypress', function(event){
        if(event.keyCode ===13 || event.which === 13)  {
            perform();
        }
      });
          
        document.querySelector('.container').addEventListener('click', deleteItem);         
          
      };
    
    
    
    return{
      init: ()=> {
        UI.displayBud({
             budget: 0,
            percentage: 0,
            totalsInc: 0,
            totalsExp: 0,
        });
        setEventListerners();
    }  
    }
    
    
})(budgetcontrol, uIcontrol );

appcontrol.init();