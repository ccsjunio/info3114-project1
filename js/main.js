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
    
});
