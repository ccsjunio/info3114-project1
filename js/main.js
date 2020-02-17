const ISFINISHED = 4;
const ISOK = 200;
let games = [];
let gameIndex = null;

window.addEventListener("load",()=>{
    console.log("page loaded");

    //assign the form element to a variable
    let retrievalForm = document.querySelector("form#retrieval-form");
    //assign the next game button to a variable
    let nextGameButton = document.querySelector("button#buttonNextGame");
    //assign the previous game button to a variable
    let previousGameButton = document.querySelector("button#buttonPreviousGame");

    // add a listener for the retrieve data button
    retrievalForm.addEventListener("submit",handleRetrieveDataRequest);

    //add a listener for the next game button
    nextGameButton.addEventListener("click",handleNextGameButton);

    //add a listener for the previous game button
    previousGameButton.addEventListener("click",handlePreviousGameButton);

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
                if(i<10){
                    i = "0" + i;
                }
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
                if(i<10){
                    i = "0" + i;
                }
                option.value = i;
                option.innerHTML = i;
                select.appendChild(option);
            }
        }
    );//end of day select for each

    

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
            //exit without handling the data, because there is data missing
            return false;
        }
        let url = "http://gd2.mlb.com/components/game/mlb/year_" + year.value + "/month_" + month.value + "/day_" + day.value + "/master_scoreboard.json";
        let request = new XMLHttpRequest();
        let retrieveDataButton = document.getElementById("retrieveDataButton");
        request.onreadystatechange = ()=>{
            if( request.readyState === ISFINISHED && request.status === ISOK){
                let response = JSON.parse(request.responseText);
                console.log("response=",response);
           
                if(!Array.isArray(response.data.games.game)){
                    games.push(response.data.games.game);
                } else {
                    games = response.data.games.game;
                }

                //update quantity of data retrieved
                let quantityOfGames = games.length;
                let gameQuantity = document.getElementById("gameQuantity");
                gameQuantity.innerHTML = quantityOfGames + " game" + (quantityOfGames!=1?"s ":"") + " retrieved";

                console.log("games:",games);

                
                retrieveDataButton.innerHTML = "Retrieve Data";

                fillGameData(0);
            } else if ( request.status != 200 ){


                retrieveDataButton.innerHTML = "request error: " + request.statusText;

            }
        }//end of request.onreadystatechange

        // open get request channel
        request.open("GET",url);
        // send request
        request.send();
        // modify retrieve data button and add loading icon
        retrieveDataButton = document.getElementById("retrieveDataButton");
        retrieveDataButton.innerHTML = "requesting " +  "<img src='./images/loading.gif' style='width:17px;'/>";

    }//end of function handleRetrieveDataRequest(event)

    /*************************************** 
    * show the next game in the list
    * if it is the last game do nothing
    ****************************************/
    function handleNextGameButton(event){
        event.preventDefault();
        event.stopPropagation();
        console.log("handleNextGameButton called");
        //get gameIndex presently being show at the form
        let gameForm = document.querySelector("form#changing-form");
        gameIndex = parseInt(gameForm.getAttribute("gameIndex"));
        // if the game show is the last one exit function - nothing changes in the form
        if(gameIndex==(games.length-1)){
            return false;
        }
        // if it is not the last of the array
        // increment gameIndex and show the next game
        fillGameData(++gameIndex);
    }

    /*************************************** 
    * show the previous game in the list
    * if it is the last game do nothing
    ****************************************/
   function handlePreviousGameButton(event){
    event.preventDefault();
    event.stopPropagation();
    console.log("handlePreviousGameButton called");
    //get gameIndex presently being show at the form
    let gameForm = document.querySelector("form#changing-form");
    gameIndex = parseInt(gameForm.getAttribute("gameIndex"));
    // if the game show is the first one exit function - nothing changes in the form
    if(gameIndex==0){
        return false;
    }
    // if it is not the first of the array
    // increment gameIndex and show the next game
    fillGameData(--gameIndex);
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

    function fillGameData(gameIndex){     
        console.log("called fillGameData");  
        if(gameIndex === undefined || gameIndex === null || isNaN( gameIndex ) || games.length === 0) return false;
        let game = games[gameIndex];
        let gameForm = document.querySelector("form#changing-form");
        let homeTeamNameInput = document.getElementById("inputHomeTeamName");
        let awayTeamNameInput = document.getElementById("inputAwayTeamName");
        let winningPitcherInput = document.getElementById("inputWinningPitcher");
        let losingPitcherInput = document.getElementById("inputLosingPitcher");
        let venueInput = document.getElementById("inputVenue");
        let homeTeamName = game ?  game.home_team_name : "";
        let awayTeamName = game ? game.away_team_name : "";
        let winningPitcher = game ? game.winning_pitcher.first + " " + game.winning_pitcher.last : "";
        let losingPitcher = game ? game.losing_pitcher.first + " " + game.losing_pitcher.last : "";
        let venue = game? game.venue : null;

        homeTeamNameInput.value = homeTeamName;
        awayTeamNameInput.value = awayTeamName;
        winningPitcherInput.value = winningPitcher.trim()=="" ? "not provided" : winningPitcher.trim();
        losingPitcherInput.value = losingPitcher.trim()=="" ? "not provided" : losingPitcher.trim();
        venueInput.value = venue;

        //set an attribute for the game index being shown in the form
        gameForm.setAttribute("gameIndex",gameIndex);

        //update game paging
        let quantityOfGames = games.length;
        let gamePaging = document.getElementById("gamePaging");
        gamePaging.innerHTML = "(" + (+gameIndex + 1) +  " of " + quantityOfGames + " game" + (quantityOfGames>1?"s":"") + " )";

    }// end of function fillGameData

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
