function loadImages(sources, type){
    for (var i=0; i < sources.length; i++){
        var currentSrc = sources[i];
        var picName = currentSrc.src.split("/");
        var len = picName.length;
        picName = picName[len-1].split(".")[0];
        var container = $("<div/>", {
            class: "hidden",
            id: picName
        });
        var currentImg = $("<img/>", {
            src: currentSrc.src,
            class: "animalImg",
        });
        currentImg.appendTo(container);
        container.appendTo(".reactionTime");
        container.appendTo(".reactionTime");
    }
}

$(document).ready(function(){
    var snakeSources = [
        {src: "http://0.0.0.0:8000/client/images/snakes/snake1.jpg",
        type: "snake"},
        {src: "http://0.0.0.0:8000/client/images/snakes/snake2.jpg",
        type: "snake"},
        {src: "http://0.0.0.0:8000/client/images/snakes/snake3.jpg",
        type: "snake"},
        {src: "http://0.0.0.0:8000/client/images/snakes/snake4.jpg",
        type: "snake"},
        {src: "http://0.0.0.0:8000/client/images/snakes/snake5.jpg",
        type: "snake"},
        {src: "http://0.0.0.0:8000/client/images/snakes/snake6.jpg",
        type: "snake"},
        {src: "http://0.0.0.0:8000/client/images/snakes/snake7.jpg",
        type: "snake"},
        {src: "http://0.0.0.0:8000/client/images/snakes/snake8.jpg",
        type: "snake"},
        {src: "http://0.0.0.0:8000/client/images/snakes/snake9.jpg",
        type: "snake"},
        {src: "http://0.0.0.0:8000/client/images/snakes/snake10.jpg",
        type: "snake"}
    ];
    var bunnySources = [
        {src: "http://0.0.0.0:8000/client/images/bunnies/bunny1.jpg",
        type: "bunny"},
        {src: "http://0.0.0.0:8000/client/images/bunnies/bunny2.jpg",
        type: "bunny"},
        {src: "http://0.0.0.0:8000/client/images/bunnies/bunny3.jpg",
        type: "bunny"},
        {src: "http://0.0.0.0:8000/client/images/bunnies/bunny4.jpg",
        type: "bunny"},
        {src: "http://0.0.0.0:8000/client/images/bunnies/bunny5.jpg",
        type: "bunny"},
        {src: "http://0.0.0.0:8000/client/images/bunnies/bunny6.jpg",
        type: "bunny"},
        {src: "http://0.0.0.0:8000/client/images/bunnies/bunny7.jpg",
        type: "bunny"},
        {src: "http://0.0.0.0:8000/client/images/bunnies/bunny8.jpg",
        type: "bunny"},
        {src: "http://0.0.0.0:8000/client/images/bunnies/bunny9.jpg",
        type: "bunny"},
        {src: "http://0.0.0.0:8000/client/images/bunnies/bunny10.jpg",
        type: "bunny"}
    ];
    loadImages(snakeSources, "snake");
    loadImages(bunnySources, "bunny");

    var allImageSources = [].concat(snakeSources).concat(bunnySources);

    var reactions = [];

    var playTheGame = function(){
        $(".playAgainButton").remove();
        $(".gameMessage").remove();
        if (allImageSources.length){
            $(".reactionTime").append('<div class="getReady"> READY...SET...</div>');
        } else {
            //send messages to the server, rerender the page

            var stats = calculateResults(reactions);
            displayResults(stats);
            sendResultsToServer(stats, reactions);
            //stop playing the game
            return;
        }
        setTimeout(function(){
            if (allImageSources.length){
                $(".getReady").remove();
                var randomIndex = Math.floor(Math.random() * allImageSources.length);
                var randomSrc = allImageSources[randomIndex].src;
                var imageType = allImageSources[randomIndex].type;
                var picName = randomSrc.split("/");
                var len = picName.length;
                picName = picName[len-1].split(".")[0];

                $("#"+picName).css("display", "block");
                allImageSources.splice(randomIndex, 1);
                var startTime = Date.now();
                $(document).keydown(function(e){
                    e.preventDefault();
                    if ((e.keyCode === 37 && imageType === "snake") || (e.keyCode === 39 && imageType !== "snake")){
                        var endTime = Date.now();
                        clearTimeout(timeoutId);
                        var num = endTime - startTime;
                        $(".reactionTime").append('<div class="gameMessage">SUCCESS! Your reaction time was '+num.toString()+'</div>');
                        $(document).off("keydown");
                        //add button to click to playTheGame() again
                        addPlayAgainButton(picName);
                        reactions.push(
                            {
                                outcome: "success",
                                imageType: imageType,
                                reactionTime: num
                            }
                        );


                    } else if (e.keyCode === 37 && imageType !== "snake"){
                        var endTime = Date.now();
                        clearTimeout(timeoutId);
                        $(".reactionTime").append('<div class="gameMessage">FAILURE! THAT WASNT A SNAKE!</div>');
                        $(document).off("keydown");
                        var num = endTime - startTime;
                        //add button to click to playTheGame() again
                        addPlayAgainButton(picName);
                        reactions.push(
                            {
                                outcome: "failure",
                                imageType: imageType,
                                reactionTime: num
                            }
                        );
                    } else if (e.keyCode === 39 && imageType === "snake"){
                        var endTime = Date.now();
                        clearTimeout(timeoutId);
                        $(".reactionTime").append('<div class="gameMessage">FAILURE! YOU MISSED THE SNAKE!</div>');
                        $(document).off("keydown");
                        var num = endTime - startTime;
                        //add button to click to playTheGame() again
                        addPlayAgainButton(picName);
                        reactions.push(
                            {
                                outcome: "failure",
                                imageType: imageType,
                                reactionTime: num
                            }
                        );
                    }
                });
                var timeoutId = setTimeout(function(){
                    $(".reactionTime").append('<div class="gameMessage">YOUR REACTION TIME WAS TOO SLOW!!!</div>');
                    $(document).off("keydown");
                    //add button to click to playTheGame() again
                    addPlayAgainButton(picName);
                }, 3000);
            } else {
                //no images left, display done and send results to server
                console.log("no images left to display");
                //That's all, display average reaction time for snake v bunny
                //also display accuracy
            }
        }, Math.floor(Math.random()*2000) + 500);
    };


    var addPlayAgainButton = function(picNameToRemove){
        $(".reactionTime").append($("<button/>", {
            class: "playAgainButton",
            text: "Next Round"
        }).click(function(){
            $("#"+picNameToRemove).css("display", "none");
            playTheGame();
        }));
    };
    var calculateResults = function(resultsArray){
        //return object with average reaction time to snakes and bunnies
        //obj should also have accuracy
        var snakeRxnTimeSum = 0;
        var bunnyRxnTimeSum = 0;

        var snakeNumSuccess = 0;
        var snakeNumFailure = 0;

        var bunnyNumSuccess = 0;
        var bunnyNumFailure = 0;
        for (var i=0; i < resultsArray.length; i++){
            var rxn = resultsArray[i];

            if (rxn.imageType === "snake"){
                if (rxn.outcome === "success"){
                    snakeNumSuccess++;
                } else {
                    snakeNumFailure++;
                }
                snakeRxnTimeSum += rxn.reactionTime;
            } else {
                if (rxn.outcome === "success"){
                    bunnyNumSuccess++;
                } else {
                    bunnyNumFailure++;
                }
                bunnyRxnTimeSum += rxn.reactionTime;
            }
        }
        return {
            "bunnyAvgReactionTime": Math.floor(bunnyRxnTimeSum/(bunnyNumSuccess+bunnyNumFailure)),
            "snakeAvgReactionTime": Math.floor(snakeRxnTimeSum/(snakeNumSuccess+snakeNumFailure)),
            "bunnyAccuracy": (bunnyNumSuccess/(bunnyNumSuccess+bunnyNumFailure)) * 100,
            "snakeAccuracy": (snakeNumSuccess/(snakeNumSuccess+snakeNumFailure)) * 100
        }
    }

    var displayResults = function(statsObj){
        //display results from the object returned from calculateResults
        console.log(statsObj);
        $(".reactionTime").append('<div>Average Reaction Time for Snakes: '+statsObj.snakeAvgReactionTime.toString()+' milliseconds</div>');
        $(".reactionTime").append('<div>Average Reaction Time for Bunnies: '+statsObj.bunnyAvgReactionTime.toString()+' milliseconds</div>');
        $(".reactionTime").append("<br>");
        $(".reactionTime").append('<div>Accuracy for Snakes: '+statsObj.snakeAccuracy.toString()+'%</div>');
        $(".reactionTime").append('<div>Accuracy for Bunnies: '+statsObj.bunnyAccuracy.toString()+'%</div>');
    }

    var sendResultsToServer = function(statsObj, resultsArray){
        //send raw and summary data to the server for processing/storage
    }

    $('.reactionTime').append($("<button/>", {
        text: "Start Game",
        class: "playGameButton"
    }).click(function(){
        $(".loading").remove();
        $(".playGameButton").remove();
        $(".instructions").remove();
        playTheGame();
    }))
})