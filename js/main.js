const ISFINISHED = 4;
const ISOK = 200;
let game = [];

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
            //exit without handling the data, because there is data missing
            return false;
        }
        let url = "http://gd2.mlb.com/components/game/mlb/year_" + year.value + "/month_" + month.value + "/day_" + day.value + "/master_scoreboard.json";
        let request = new XMLHttpRequest();
        request.onreadystatechange = ()=>{
            if( request.readyState === ISFINISHED && request.status === ISOK){
                let response = JSON.parse(request.responseText);
                console.log("response=",response);
                let game = response.data.games.game;
                console.log("game:",game);
                fillGameData(game[0]);
            }
        }//end of request.onreadystatechange

        request.open("GET",url);
        request.send();


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

    function fillGameData(game){
        if(!game) return false;
        let homeTeamNameInput = document.getElementById("inputHomeTeamName");
        let awayTeamNameInput = document.getElementById("inputAwayTeamName");
        let winningPitcherInput = document.getElementById("inputWinningPitcher");
        let losingPitcherInput = document.getElementById("inputLosingPitcher");
        let venueInput = document.getElementById("inputVenue");
        let homeTeamName = game ?  game.home_team_name : null;
        let awayTeamName = game ? game.away_team_name : null;
        let winningPitcher = game ? (game.winning_pitcher.first + " " + game.winning_pitcher.last) : null;
        let losingPitcher = game ? (game.losing_pitcher.first + " " + game.losing_pitcher.last) : null;
        let venue = game? game.venue : null;

        homeTeamNameInput.value = homeTeamName;
        awayTeamNameInput.value = awayTeamName;
        winningPitcherInput.value = winningPitcher;
        losingPitcherInput.value = losingPitcher;
        venueInput.value = venue;

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
