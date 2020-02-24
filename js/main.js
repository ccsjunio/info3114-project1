/***************************************************
 *  Main Javascript code
 ***************************************************/

// constants for the ready state from XMLHttpRequest
const UNSENT = 0;
const OPENED = 1;
const HEADERS_RECEIVED = 2;
const LOADING = 3;
const ISFINISHED = 4;
//const for the status of the XMLHttpRequest
const ISOK = 200;
// define the array to contain the games
let games = [];
// define a variable to be the pointer in the array of games
let gameIndex = null;
//define filters types with regular expressions
const NUMBER_INPUT = /[0-9]+/gm;
const TEXT_INPUT = /[^a-zA-Z0-9&\s]+/gm;

// add a listener to execute a function when the page is loaded
window.addEventListener("load",()=>{
    
    //assign the form element to a variable
    let retrievalForm = document.querySelector("form#retrieval-form");
    //assign the next game button to a variable
    let nextGameButton = document.querySelector("button#buttonNextGame");
    //assign the previous game button to a variable
    let previousGameButton = document.querySelector("button#buttonPreviousGame");

    /* add listeners to events */

    // add a listener for the retrieve data button
    retrievalForm.addEventListener("submit",handleRetrieveDataRequest);

    //add a listener for the next game button
    nextGameButton.addEventListener("click",handleNextGameButton);

    //add a listener for the previous game button
    previousGameButton.addEventListener("click",handlePreviousGameButton);

    //add a listener to any text input box when key up occurs
    let inputs = document.querySelectorAll("input[type='text']");
    inputs.forEach((input)=>{
        //handleInputChange will be called when key is up
        input.addEventListener("keyup",handleInputChange);
    });

    //capture submission event from the form with game data
    let changingForm = document.querySelector("form#changing-form");
    changingForm.addEventListener("submit",handleChangingFormSubmission);
    
    /* fill select boxes from the date selection form */

    // fill months
    // assign the month selection box to a variable
    // selector a
    let monthSelect = document.querySelector("select.month-selection");
       
    // remove all options nodes from select for beginning in a clean slate
    while(monthSelect.firstChild){
        monthSelect.removeChild(monthSelect.firstChild);
    }

    // create a DOM element option for the select box
    let option = document.createElement("option");
    // assign attributes for the first element in the list
    option.setAttribute("selected","selected");
    option.value = "";
    option.innerHTML = "Choose the month";
    // assign the first element to the list
    monthSelect.appendChild(option);
    option.removeAttribute("selected");
    // loop to append the other options with the months in the select box
    for(let i=1;i<=12;i++){
        let option = document.createElement("option");
        if(i<10){
            i = "0" + i;
        }// end of if(i<10)
        option.value = i;
        option.innerHTML = i;
        monthSelect.appendChild(option);
    }// end of for

    //fill days
    let daySelect = document.querySelector("select.day-selection");

    //remove all options nodes from select for beginning in a clean slate
    while(daySelect.firstChild){
        daySelect.removeChild(daySelect.firstChild);
    }
    
    // create a DOM element option for the select box
    option = document.createElement("option");
    // assign attributes for the first element in the list
    option.setAttribute("selected","selected");
    option.value = "";
    option.innerHTML = "Choose the day";
    // assign the first element to the list
    daySelect.appendChild(option);
    option.removeAttribute("selected");
    // loop to append the other options with the months in the select box
    for(let i=1;i<=31;i++){
        let option = document.createElement("option");
        if(i<10){
            i = "0" + i;
        }
        option.value = i;
        option.innerHTML = i;
        daySelect.appendChild(option);
    } // end of for to fill the day options to select
        
    /* handles the pressing of button to retrieve games */
    function handleRetrieveDataRequest(event){
        // prevent the default submission of the form, 
        // since there is no action defined on HTML
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

        // if the data is correctly set the url to make the request to
        let url = "http://gd2.mlb.com/components/game/mlb/year_" + year.value + "/month_" + month.value + "/day_" + day.value + "/master_scoreboard.json";
        // assign an new instance of the XMLHttpRequest to variable
        let request = new XMLHttpRequest();
        // assign the dom element of the retrieval button
        let retrieveDataButton = document.getElementById("retrieveDataButton");
        // assign the dom element of a text area to show the quantity of games retrieved
        let gameQuantity = document.getElementById("gameQuantity");
        //add a listerner for ready state change event
        request.onreadystatechange = ()=>{

            // update the message on retrieve data button to show the channel is opened
            // in order for the user to know what is heppening and the system is not
            // stuck. it is good for a better user experience, since we depend on
            // response times from API
            if ( request.readyState === OPENED && request.status === ISOK){
                retrieveDataButton.innerHTML = "channel opened " +  "<img src='./images/loading.gif' style='width:17px;'/>";
            }
            // update the message on retrieve data button to show the headers were received by the API
            if ( request.readyState === HEADERS_RECEIVED && request.status === ISOK){
                retrieveDataButton.innerHTML = "request received " +  "<img src='./images/loading.gif' style='width:17px;'/>";
            }

            // update the message on retrieve data button to show the API is sending the information
            if ( request.readyState === LOADING && request.status === ISOK){
                retrieveDataButton.innerHTML = "loading data " +  "<img src='./images/loading.gif' style='width:17px;'/>";
            }

            // when the information is loaded and the transaction completed with success
            // parse the information received
            if ( request.readyState === ISFINISHED && request.status === ISOK){

                // convert the response to a JSON format object
                let response = JSON.parse(request.responseText);

                // check if there is game information on the response. 
                // if there is any problem, inform the
                // user and get out of the function
                if( !response.data.games.game || response.data.games.game === undefined ){
                    
                    // update the contents of the button to inform there is a problem
                    retrieveDataButton.innerHTML = "problem on response";
                    // update the background color of the button to red for the user
                    // to visually acknowledge there was a problem
                    retrieveDataButton.style.backgroundColor = "#FF0000";
                    // after 2 seconds get the contents of the retrieve button to the regular content
                    window.setTimeout(()=>{
                        retrieveDataButton.style.backgroundColor = "#073472";
                        // the original text is stored at an attribute of the button
                        // this avoids mistakes on contents code located on multiple locations
                        retrieveDataButton.textContent = retrieveDataButton.getAttribute("originalValue");
                    },2000);
                    // the game quantity label reflects that no data was returned
                    // it remains util the next request
                    gameQuantity.innerHTML = "no data returned";
                    // exit the function
                    return false;
                }
           
                // check if the game came as an array or object
                // when there is only one game for the date
                // it comes as as object
                // when there are more than one game
                // it caomes as an array of game objects
                if(!Array.isArray(response.data.games.game)){
                    // if it is only one game, the object information is loaded
                    // to the global array of games
                    games.push(response.data.games.game);
                } else {
                    // if comes as an array it just replaces
                    // the content of the global array of game objects
                    games = response.data.games.game;
                }

                //update quantity of data retrieved
                let quantityOfGames = games.length;
                
                gameQuantity.innerHTML = quantityOfGames + " game" + (quantityOfGames!=1?"s ":"") + " retrieved";

                console.log("games:",games);

                retrieveDataButton.innerHTML = "Retrieve Data";

                fillGameData(0);

            } else if ( request.status != 200 ){

                retrieveDataButton.innerHTML = "request error: " + request.statusText;

            }//end of if( request.readyState === ISFINISHED && request.status === ISOK)

        }//end of request.onreadystatechange

        // open get request channel
        request.open("GET",url);
        // send request
        request.send();
        // modify retrieve data button and add loading icon
        retrieveDataButton.innerHTML = "requesting " +  "<img src='./images/loading.gif' style='width:17px;'/>";

    }//end of function handleRetrieveDataRequest(event)

    /*************************************** 
    * show the next game in the list
    * if it is the last game do nothing
    ****************************************/
    function handleNextGameButton(event){
        event.preventDefault();
        event.stopPropagation();
        // get gameIndex presently being show at the form
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
    // get gameIndex presently being show at the form
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

    /*************************************** 
    * show the modal with an acknowledge message
    * to the user
    ****************************************/
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

    /*************************************** 
    * Fill the form with game information
    * loaded from the API
    * shows the first game in the list
    * with options to navigation through
    * the set of games
    ****************************************/
    function fillGameData(gameIndex){     
        // check if a valid game index is supplied
        if(gameIndex === undefined || gameIndex === null || isNaN( gameIndex ) || games.length === 0) return false;
        // get game information from the index
        // only the index is passed to the function in order
        // to minimize the payload of data transmitted
        let game = games[gameIndex];
        // assign the form to receive game information to a variable
        // as well as the inputs from the form to a variable each
        let gameForm = document.querySelector("form#changing-form");
        let homeTeamNameInput = document.getElementById("inputHomeTeamName");
        let awayTeamNameInput = document.getElementById("inputAwayTeamName");
        let winningPitcherInput = document.getElementById("inputWinningPitcher");
        let losingPitcherInput = document.getElementById("inputLosingPitcher");
        let venueInput = document.getElementById("inputVenue");
        // load the game data to variables, checking if the game is valid before
        let homeTeamName = game ?  game.home_team_name : "";
        let awayTeamName = game ? game.away_team_name : "";
        let winningPitcher = game ? game.winning_pitcher.first + " " + game.winning_pitcher.last : "";
        let losingPitcher = game ? game.losing_pitcher.first + " " + game.losing_pitcher.last : "";
        let venue = game? game.venue : null;

        // load the input boxes with the values of game data
        homeTeamNameInput.value = homeTeamName;
        awayTeamNameInput.value = awayTeamName;
        // some games do not provide some information
        // when this happens, show the user that no information was provided
        // for this field, so that the user don't think it is a system error
        winningPitcherInput.value = winningPitcher.trim()=="" ? "not provided" : winningPitcher.trim();
        losingPitcherInput.value = losingPitcher.trim()=="" ? "not provided" : losingPitcher.trim();
        venueInput.value = venue;

        // set an attribute for the game index being shown in the form
        // easing the navigation process
        gameForm.setAttribute("gameIndex",gameIndex);

        //update game paging
        let quantityOfGames = games.length;
        let gamePaging = document.getElementById("gamePaging");
        gamePaging.innerHTML = "(" + (+gameIndex + 1) +  " of " + quantityOfGames + " game" + (quantityOfGames>1?"s":"") + " )";

    }// end of function fillGameData

    /*************************************** 
    * Handle the input box content change
    * with every key up event
    * to filter the data being input
    * at box content level
    ****************************************/
    function handleInputChange(event){
        // assign the input dom element to a variable
        let inputTarget = event.target;
        // instantiate a variable to load the text pattern to e verified
        let pattern;
        // check if the input type is text
        if(inputTarget.getAttribute("type")=="text"){
            // load the regular expression to test text input contents
            pattern = TEXT_INPUT;
        }
        // replace all characters according to the filter patter for text inputs
        inputTarget.value = inputTarget.value.replace(pattern,"");
    }//function handleInputChange

    /*************************************** 
    * Handle the submission of the form
    * with game data
    * It is not functional now because the 
    * button is disabled for this project
    * as per requirements
    ****************************************/
    function handleChangingFormSubmission(event){
        console.log(event);
        let formTarget = event.target;
        event.preventDefault();
        event.stopPropagation();
        return false
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
