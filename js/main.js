window.addEventListener("load",()=>{
    console.log("page loaded");

    //fill months
    let monthSelect = document.querySelectorAll("select.month-selection");
    console.log("monthSelect=",monthSelect);
    monthSelect.forEach(
        (select)=>{
            //remove all options nodes from select for beginning in a clean slate
            while(select.firstChild){
                select.removeChild(select.firstChild);
            }
            let option = document.createElement("option");
            option.setAttribute("selected","selected");
            option.value = "";
            option.innerHTML = "Choose the month";
            select.appendChild(option);
            option.removeAttribute("selected");
            for(let i=1;i<=12;i++){
                let option = document.createElement("option");
                option.value = i;
                option.innerHTML = i;
                select.appendChild(option);
            }
        }
    );//end of month select for each

    //fill days
    let daySelect = document.querySelectorAll("select.day-selection");
    console.log("daySelect=",daySelect);
    daySelect.forEach(
        (select)=>{
            //remove all options nodes from select for beginning in a clean slate
            while(select.firstChild){
                select.removeChild(select.firstChild);
            }
            let option = document.createElement("option");
            option.setAttribute("selected","selected");
            option.value = "";
            option.innerHTML = "Choose the day";
            select.appendChild(option);
            option.removeAttribute("selected");
            for(let i=1;i<=31;i++){
                let option = document.createElement("option");
                option.value = i;
                option.innerHTML = i;
                select.appendChild(option);
            }
        }
    );//end of day select for each

    // add a listener for the retrieve data button
    let retrievalForm = document.querySelector("form#retrieval-form");
    retrievalForm.addEventListener("submit",handleRetrieveDataRequest);

    function handleRetrieveDataRequest(event){
        console.log("caught event on handleRetrieveDataRequest - event = ", event);
        event.preventDefault();
        //assign year selector to a variable
        let year = document.getElementById("selectYearToRetrieve");
        //assign month selector to a variable
        let month = document.getElementById("selectMonthToRetrieve");
        //assign day selector to a variable
        let day = document.getElementById("selectDayToRetrieve");
        
        //test if any of them are empty
        if(year.value == "" || month.value == "" || day.value == ""){
            //throw an error message to the user and do not retrieve any data
            let messageTitle = "Form empty";
            let message = "You must choose all three options: year, month and day!";
            showUserMessageModal(messageTitle,message);
        }

    }

    function showUserMessageModal(title,message){
        let options = {
            "keyboard":true,
            "focus":true,
            "show":true
        };
        document.getElementById("modal-title").innerHTML = title;
        document.getElementById("modal-body").innerHTML = message;

        document.getElementById("btn-modal-trigger").click();
    
    }

    //TODO: develop a custom modal trigger function
    function Modal(title,message){
        this.title = title;
        this.message = message;
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.width = "326px";
        this.height = "24px";

    }
    
});
