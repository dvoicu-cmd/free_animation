/*
 * 
 * Timer file containing all the functions for calling timers.
 * 
 */

/**
 * Initializes a timer.
 * A timer is just an array of two elements. timer[0] = the initalization status of timer, timer[1] = the initial time, timer[2] = the current time.
 * You would want to call this in the init method.
 * @param {Array} timer an empty array
 */
function initTime(timer) {
    var date = new Date();
    currTIME = date.getTime()/1000.0;
    initTIME = date.getTime()/1000.0;
    timer.push(false);
    timer.push(0);
    timer.push(initTIME);
    timer.push(currTIME);
}

/**
 * Finds the difference between the initial time and current time.
 * @param {Array} timer an array of size three
 * @return {double} current time of the timer.
 */
function timeStep(timer){
    if(animFlag){
        var date = new Date();
        var currTIME = date.getTime()/1000.0;
        timer.pop(); //Remove the old current time
        timer.push(currTIME)
    }
    var difference = timer[3] - timer[2]; //current time - initial time
    timer[1] = difference;
    return difference;
}

/**
 * resets the timer
 * @param {*} timer an array of size two
 */
function resetTime(timer) {
        timer.pop();
        timer.pop();
        timer.pop();
        timer.pop();
        initTime(timer);
}

/**
 * Stops the timer when the time threshold is meet
 * @param {*} timer array of size two
 * @param {*} timerInit boolean controller to stop the timer
 * @param {*} threshold The threshold time to stop the timer
 */
function stopTimer(timer, threshold){
    if(TIME >= threshold){
        timer.pop();
        timer.pop();
        timer.pop();
    }
}

/**
 * Hanldes timers in the render method
 * @param {*} timer 
 * @param {*} timerInit 
 * @param {*} threshold 
 */
function timerHandler(timer, threshold){
    //If the timer has been initalized, await for the threshold to be hit
    if(timer[0] == true){
        stopTimer(timer, threshold);
    }
    else { //Else, you initalize the timer
        resetTime(timer);
        timer[0] = true;
    }
}