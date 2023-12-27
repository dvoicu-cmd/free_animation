// Sets the camera for a scene
function setCamera(Yaw, Pitch, Roll){
    eye = vec3(Yaw,Pitch,Roll);

    // set the camera matrix
    viewMatrix = lookAt(eye,at,up);
        // initialize the modeling matrix stack
    MS = [];
    modelMatrix = mat4();
    // send all the matrices to the shaders
    setAllMatrices();
}

function initViewedScenes(sceneArray){
    while(sceneArray.length>0){
        sceneArray.pop();
    }
    for(var i = 0; i<=numScenes; i++){
        sceneArray.push(false);
    }
}

function initManualPlayer(){
    toggleManualPlay = true;
    isTimeInit = false;
    initViewedScenes(manuallyViewScene);
}

function scene0(){
    //Set camera controls
    setCamera(0,5,35-(TIME*2));

    //Draw environment
    drawEnv();

    //Draw character
    gPush();
    {
        gRotate(90, 1, 0, 0);
        gTranslate(0,0,7);
        drawCharacter(0,0,0,45,45,45,45,0,0,0,0,0,0,0,0);
    }
    gPop();

}

function scene1(){
    setCamera(-15,5,25-timeStep(scene1T));
    
    //enableFreeCam();
    drawEnv();
    //Draw character
    gPush();
    {
        gRotate((90-timeStep(scene1T)*1.5), 1, 0, 0);
        gTranslate(0,0,8-(timeStep(scene1T)/1.5));
        drawCharacter(
            0,0,(45-(timeStep(scene1T)*5)), //Head
            45,45, //Shoulders
            10,10, //Elbows
            (-25+timeStep(scene1T)*2),(50-(timeStep(scene1T)*2)),0, //Right Foot
            (25+timeStep(scene1T)*2),(50-timeStep(scene1T)*2),0, //Left Foot
            0, //1 -> Happy , 0 -> neutral
            1-(timeStep(fadeTimer)/50) //inkBlend (1 -> more ink , 0 -> more character)
        );
    }
    gPop();
}

function scene2(){
    setCamera(30,3,20-timeStep(scene2T));
    
    //enableFreeCam();
    drawEnv();
    //Draw character
    gPush();
    {
        gRotate((90-timeStep(scene2T)*10), 1, 0, 0);
        gTranslate(0,0,3-(timeStep(scene2T)/10));
        drawCharacter(
            0,0,(53-(timeStep(scene2T)*12)), //Head
            (53+timeStep(scene2T)*2),(53+timeStep(scene2T)*2), //Shoulders
            (100-timeStep(scene2T)*10),(100-timeStep(scene2T)*10), //Elbows
            (-25+timeStep(scene2T)*3),(58-(timeStep(scene2T)*2)),0, //Right Foot
            (33+timeStep(scene2T)*3),(57-timeStep(scene2T)*2),0, //Left Foot
            0, //1 -> Happy , 0 -> neutral
            1-(timeStep(fadeTimer)/20) //inkBlend (1 -> more ink , 0 -> more character)
        );
    }
    gPop();
}

function scene3(){
    //Naming be dammed
    var func = Math.log10(timeStep(scene3T))/2 + 10;
    var func2 = Math.log10(timeStep(scene3T))/50 + 0.5;
    var head = (Math.log10(timeStep(scene3T)+1)) / (Math.log10(10+timeStep(scene3T))) * 50;

    setCamera(5,-2+timeStep(scene3T)/5,13);
    //enableFreeCam();
    drawEnv();
    gPush();
    {
        gTranslate(0,-func2,0) //log
        drawCharacter(
            0,0,-30+head, //Head (log increase)
            (55-head),(55-head), //Shoulders (decrease)
            (40+head),(40+head), //Elbows (decrease)
            -5,10,(-10+func), //Right Foot (decrease to 0 z)
            5,10,(10-func), //Left Foot (decrease to 0 z)
            0, //1 -> Happy , 0 -> neutral
            1-(timeStep(fadeTimer)/20) //inkBlend (1 -> more ink , 0 -> more character)
        );
    }
    gPop();
}

function scene4(){

    var func1 = (Math.log10(timeStep(scene4T)+1)) / (Math.log10(150+timeStep(scene4T))) * 95;
    var func2 = (Math.log10(timeStep(scene4T)+1)) / (Math.log10(2+timeStep(scene4T))) * 40;

    setCamera(0,10,5+func1);
    //enableFreeCam();
    drawEnv();
    gPush();
    {
        drawCharacter(
            0,0,func1, //Head 
            5-func1,5-func1, //Shoulders
            45-func2,45-func2, //Elbows
            -5,10,-10, //Right Foot
            5,10,10, //Left Foot
            0, //1 -> Happy , 0 -> neutral
            0 //inkBlend (1 -> more ink , 0 -> more character)
        );
    }
    gPop();
}

function scene5(){
    var func1 = (Math.log10(timeStep(scene5T)+1)) / (Math.log10(150+timeStep(scene5T))) * 45;
    var func2 = (Math.log10(timeStep(scene5T)+1)) / (Math.log10(40+timeStep(scene5T))) * 150;
    var func3 = (Math.log10(timeStep(scene5T)+1)) / (Math.log10(15+timeStep(scene5T))) * 75;
    var func4 = (Math.log10(timeStep(scene5T)+1)) / (Math.log10(150+timeStep(scene5T))) * 10;


    setCamera(-10-func4,2,10);
    //enableFreeCam();
    drawEnv();
    gPush();
    {
        gTranslate(0,-0.5,0);
        drawCharacter(
            0,0,25-func1, //Head 
            -25+func2,-25+func2, //Shoulders
            func3,func3, //Elbows
            -5,10,0, //Right Foot
            5,10,0, //Left Foot
            0, //1 -> Happy , 0 -> neutral
            0 //inkBlend (1 -> more ink , 0 -> more character)
        );
    }
    gPop();
    
}

function scene6(){

    var func1 = (Math.log10(timeStep(scene6T)+1)) / (Math.log10(5+timeStep(scene6T))) * 65;

    setCamera(-14,2,10);
    //enableFreeCam();
    drawEnv();
    gPush();
    {
        gTranslate(0,-0.5,0);
        drawCharacter(
            0,-func1,0, //Head 
            56,56, //Shoulders
            50,50, //Elbows
            -5,10,0, //Right Foot
            5,10,0, //Left Foot
            0, //1 -> Happy , 0 -> neutral
            0 //inkBlend (1 -> more ink , 0 -> more character)
        );
    }
    gPop();

    console.log(-func1); //-52
}

function scene7(){

    var func1 = (Math.log10(timeStep(scene7T)+1)) / (Math.log10(5+timeStep(scene7T))) * 20;
    var func2 = (Math.log10(timeStep(scene7T)+1)) / (Math.log10(1.5+timeStep(scene7T))) * 60;
    var func3 = (Math.log10(timeStep(scene7T)+1)) / (Math.log10(2+timeStep(scene7T))) * 5;


    setCamera(-14+func3,2,10-func3);
    //enableFreeCam();
    drawEnv();
    gPush();
    {
        gTranslate(0,-0.5,0);
        drawCharacter(
            -func1,-52,0, //Head 
            56,56, //Shoulders
            50+func2,50+func2, //Elbows
            -5,10,0, //Right Foot
            5,10,0, //Left Foot
            1, //1 -> Happy , 0 -> neutral
            0 //inkBlend (1 -> more ink , 0 -> more character)
        );
    }
    gPop();
}

function tpose(){
    setCamera(0,2,20);
    enableFreeCam();
    drawEnv();
    gPush();
    {
        gTranslate(0,-0.5,0);
        drawCharacter(
            0,0,0, //Head 
            15,15, //Shoulders
            35,35, //Elbows
            -5,10,0, //Right Foot
            5,10,0, //Left Foot
            0, //1 -> Happy , 0 -> neutral
            0 //inkBlend (1 -> more ink , 0 -> more character)
        );
    }
    gPop();
}

function drawEnv(){
        //Draw ground
        drawGround();
        gPop();
    
        //Draw puddle
        gPush();
        {
            drawPuddle();
        }
        gPop();
}

//Enables the free camera
function enableFreeCam(){
        gRotate(RZ,0,0,1) ;
        gRotate(RY,0,1,0) ;
        gRotate(RX,1,0,0) ;
}