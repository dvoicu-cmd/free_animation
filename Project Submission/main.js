// Template code for A2 Fall 2021 -- DO NOT DELETE THIS LINE

// ---------------------------------- Global Variables ----------------------------------
var canvas;
var gl;

var program;

var fps;

var near = 1;
var far = 100;


var left = -6.0;
var right = 6.0;
var ytop = 6.0;
var bottom = -6.0;


var lightPosition2 = vec4(100.0, 100.0, 100.0, 1.0 );
var lightPosition = vec4(0.0, 0.0, 100.0, 1.0 );

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 0.4, 0.4, 0.4, 1.0 );
var materialShininess = 30.0;


var ambientColor, diffuseColor, specularColor;

var modelMatrix, viewMatrix ;
var modelViewMatrix, projectionMatrix, normalMatrix;
var modelViewMatrixLoc, projectionMatrixLoc, normalMatrixLoc;
var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var RX = 0 ;
var RY = 0 ;
var RZ = 0 ;

var MS = [] ; // The modeling matrix stack
var TIME = 0.0 ; // Realtime
var resetTimerFlag = true ;
var animFlag = true ;
var prevTime = 0.0 ;
var useTextures = 1 ;

var transformToggle = true; //Toggle ortho or perspective. false = Orthographic Transform. true = Perspective Transform.

var textureArray = []; // Texture array


// ------- Procedurally generated checker texture: -------
var texSize = 64;


var image1 = new Array()
for (var i =0; i<texSize; i++)  image1[i] = new Array();
for (var i =0; i<texSize; i++)
for ( var j = 0; j < texSize; j++)
image1[i][j] = new Float32Array(4);
for (var i =0; i<texSize; i++) for (var j=0; j<texSize; j++) {
    var c = (((i & 0x8) == 0) ^ ((j & 0x8)  == 0));
    image1[i][j] = [c, c, c, 1];
}

// Convert floats to ubytes for texture

var image2 = new Uint8Array(4*texSize*texSize);

for ( var i = 0; i < texSize; i++ )
for ( var j = 0; j < texSize; j++ )
for(var k =0; k<4; k++)
image2[4*texSize*i+4*j+k] = 255*image1[i][j][k];

// ------- End Procedurally generated checker texture -------

// --- Scene Control ---

var numScenes = 7;
var togglePlayAll = false;
var autoViewedScenes = []; //array tracking which scenes have been viewed in the play all option.
var toggleManualPlay = false;
var isTimeInit = false; //Used to tell if the time for a manual scene has been set.
var manuallyViewScene = []; //array for tracking a specific scene to view when manually selecting a scene.
var toggleT_Pose = false;

// ---------------------


// --------- TIMERS ---------

//For fps
var oneSecTimer = [];
var twoSecTimer = [];

var scene1T = [];
var scene2T = [];
var scene3T = [];
var scene4T = [];
var scene5T = [];
var scene6T = [];
var scene7T = [];

var fadeTimer = [];



// ------- End TIMERS -------




// ---------------------------------- End Global Variables ----------------------------------

// ------------------------------ Essential Draw & Canvas Functions ------------------------------


// Sets the modelview and normal matrix in the shaders
function setMV() {
    modelViewMatrix = mult(viewMatrix,modelMatrix) ;
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    normalMatrix = inverseTranspose(modelViewMatrix) ;
    gl.uniformMatrix4fv(normalMatrixLoc, false, flatten(normalMatrix) );
}

// Sets the projection, modelview and normal matrix in the shaders
function setAllMatrices() {
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
    setMV() ;
    
}

// Draws a 2x2x2 cube center at the origin
// Sets the modelview matrix and the normal matrix of the global program
function drawCube() {
    setMV() ;
    Cube.draw() ;
}

// Draws a sphere centered at the origin of radius 1.0.
// Sets the modelview matrix and the normal matrix of the global program
function drawSphere() {
    setMV() ;
    Sphere.draw() ;
}
// Draws a cylinder along z of height 1 centered at the origin
// and radius 0.5.
// Sets the modelview matrix and the normal matrix of the global program
function drawCylinder() {
    setMV() ;
    Cylinder.draw() ;
}

// Draws a cone along z of height 1 centered at the origin
// and base radius 1.0.
// Sets the modelview matrix and the normal matrix of the global program
function drawCone() {
    setMV() ;
    Cone.draw() ;
}

// Post multiples the modelview matrix with a translation matrix
// and replaces the modelview matrix with the result
function gTranslate(x,y,z) {
    modelMatrix = mult(modelMatrix,translate([x,y,z])) ;
}

// Post multiples the modelview matrix with a rotation matrix
// and replaces the modelview matrix with the result
function gRotate(theta,x,y,z) {
    modelMatrix = mult(modelMatrix,rotate(theta,[x,y,z])) ;
}

// Post multiples the modelview matrix with a scaling matrix
// and replaces the modelview matrix with the result
function gScale(sx,sy,sz) {
    modelMatrix = mult(modelMatrix,scale(sx,sy,sz)) ;
}

// Pops MS and stores the result as the current modelMatrix
function gPop() {
    modelMatrix = MS.pop() ;
}

// pushes the current modelMatrix in the stack MS
function gPush() {
    MS.push(modelMatrix) ;
}

// ------------------------------ End of Essential Draw & Canvas Functions ------------------------------



// ------------------------------ Init Function ------------------------------

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

 
    // Load canonical objects and their attributes
    Cube.init(program);
    Cylinder.init(9,program);
    Cone.init(9,program) ;
    Sphere.init(36,program) ;

    gl.uniform1i( gl.getUniformLocation(program, "useTextures"), useTextures );

    // record the locations of the matrices that are used in the shaders
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    
    // set a default material
    setColor(materialDiffuse) ;
    
    
    // -------------- Buttons --------------

    // Init scene selector
    for(var i = 0; i<=numScenes; i++){
        var str = "scene" + i;
        var button = document.createElement("input");
        button.setAttribute("id",str);
        button.setAttribute("type","button");
        button.setAttribute("value",str);
        document.getElementById("scenes").appendChild(button);
    }
    //Add extra elements for t-pose scene and play all button
    var elementBr = document.createElement("br");

    document.getElementById("scenes").appendChild(elementBr);

    var button = document.createElement("input");
    button.setAttribute("id","t-pose");
    button.setAttribute("type","button");
    button.setAttribute("value","character t-pose");
    document.getElementById("scenes").appendChild(button);

    document.getElementById("scenes").appendChild(elementBr);

    button = document.createElement("input");
    button.setAttribute("id","play-all");
    button.setAttribute("type","button");
    button.setAttribute("value","toggle play all: ON");
    document.getElementById("scenes").appendChild(button);

    //Init camera controller
    var controller = new CameraController(canvas);
    controller.onchange = function(xRot,yRot) {
        RX = xRot ;
        RY = yRot ;
        window.requestAnimFrame(render); 
    };

    //Init frame per second
    fps = 0;
    
    // --------- TIMERS ---------
    initTime(oneSecTimer);
    initTime(twoSecTimer);

    oneSecTimer[0] = true;
    twoSecTimer[0] = true;

    // --------------------------


    // load and initialize the textures
    initTextures();
    
    // Recursive wait for the textures to load
    waitForTextures(textureArray);
    //setTimeout (render, 100) ;
    
}

// ------------------------------ End Init Function ------------------------------


// ------------------------------ The Render Function ------------------------------


function render() {
    // clear buffer
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Update frames per second
    fps = fps + 1;

    //DEBUG time
    console.log("Time: "+TIME);

    // get real time
    var curTime;
    if( animFlag ) {
        curTime = (new Date()).getTime() /1000 ;
        if( resetTimerFlag ) {
            prevTime = curTime ;
            resetTimerFlag = false ;
        }
        TIME = TIME + curTime - prevTime ;
        prevTime = curTime ;
    }

    // Update fps display every two seconds
    if(timeStep(twoSecTimer)>=2){
        var fpsDisplay = document.getElementById("fps-display");
        fpsDisplay.textContent = fps;
        resetTime(twoSecTimer);
    }
    
    // one second timer to reset fps
    if(timeStep(oneSecTimer)>=1){
        resetTime(oneSecTimer);
        fps = 0; //Note moving the camera manually breaks the fps counter. What fun.
    }
    
    // set the projection matrix
    // ------- Toggle perspective/orthographic transform -------
    // Note, the annimation needs to be toggled on for
    if (transformToggle){
        projectionMatrix = perspective(45, 1, near, far); //The projection matrix with distance. (Perspective Projection)
    }
    else {
        projectionMatrix = ortho(left, right, bottom, ytop, near, far); //Flat (orthographic transformation)
    }
    // ---------------------------------------------------------

    // -------------------------------------------------------------- Scenes --------------------------------------------------------------

    // -------------------------------- Play All --------------------------------

    //Plays all the scenes in order
    document.getElementById("play-all").onclick = function() { //control
        if(togglePlayAll){
            document.getElementById("play-all").setAttribute("value","toggle play all: OFF");
            togglePlayAll = false;
        }
        else { 
            TIME = 0;
            initViewedScenes(autoViewedScenes); 
            togglePlayAll = true;
            toggleManualPlay = false;
            document.getElementById("play-all").setAttribute("value","toggle play all: ON");

            //Reset all the timers:
            resetTime(scene1T);
            resetTime(scene2T);
            resetTime(scene3T);
            resetTime(scene4T);
            resetTime(scene5T);
            resetTime(scene6T);
            resetTime(scene7T);
            resetTime(fadeTimer);

        }
    }

    if(togglePlayAll){

        // | Scene 0 | t = [0,5] |
        if(TIME >= 0){
            if(!autoViewedScenes[0]){ //If this is not a viewed scene, don't render it
                scene0();
            }
        }

        // | Scene 1 | t = [5,13] |
        if(TIME >= 5){
            if(!autoViewedScenes[1]){
                autoViewedScenes[0] = true; //Mark previous scene as viewed.

                timerHandler(fadeTimer,22);
                timerHandler(scene1T,14);
                scene1();
            }
        }
                
        // | Scene 2 | t = [5,20] |
        if(TIME >= 13){
            if(!autoViewedScenes[2]){
                autoViewedScenes[1] = true;

                timerHandler(fadeTimer,26);
                timerHandler(scene2T,21);
                scene2();
            }
        }
                
        // | Scene 3 | t = [20,25] |
        if(TIME >= 20){
            if(!autoViewedScenes[3]){
                autoViewedScenes[2] = true;

                timerHandler(fadeTimer,26);
                timerHandler(scene3T,26);
                scene3();
            }
        }

        // | Scene 4 | t = [25,31] |
        if(TIME >= 25){
            if(!autoViewedScenes[4]){
                autoViewedScenes[3] = true;

                timerHandler(scene4T,32);
                scene4();
            }
        }

        // | Scene 5 | t = [31,38] |
        if(TIME >= 31){
            if(!autoViewedScenes[5]){
                autoViewedScenes[4] = true;

                timerHandler(scene5T,39);
                scene5();
            }
        }

        // | Scene 6 | t = [38,45] |
        if(TIME >= 38){
            if(!autoViewedScenes[6]){
                autoViewedScenes[5] = true;

                timerHandler(scene6T,46);
                scene6();
            }
        }
                
        // | Scene 7 | t = [45,50] |
        if(TIME >= 45){
            if(!autoViewedScenes[7]){
                autoViewedScenes[6] = true;

                timerHandler(scene7T,56);
                scene7();
            }
        }

        if(TIME >= 50){
            togglePlayAll = false;
        }

    }

    // -------------------------------- End Play All -------------------------------

    // -------------------------------- Manually plays -------------------------------

    //  --- Event handler for manually selecting scenes -----
    document.getElementById("scene0").onclick = function() {
        if(togglePlayAll){ //For all scenes, you need to check if the play all toggle is on. Turn it off to prevent bugs.
            document.getElementById("play-all").click();
        }
        initManualPlayer();
        console.log("manually load scene0");
        manuallyViewScene[0] = true;
        
    }

    document.getElementById("scene1").onclick = function() {
        if(togglePlayAll){ 
            document.getElementById("play-all").click();
        }
        initManualPlayer();
        console.log("manually load scene1");
        manuallyViewScene[1] = true;
    }

    document.getElementById("scene2").onclick = function() {
        if(togglePlayAll){ 
            document.getElementById("play-all").click();
        }
        initManualPlayer();
        console.log("manually load scene2");
        manuallyViewScene[2] = true;
    }

    document.getElementById("scene3").onclick = function() {
        if(togglePlayAll){ 
            document.getElementById("play-all").click();
        }
        initManualPlayer();
        console.log("manually load scene3");
        manuallyViewScene[3] = true;
    }

    document.getElementById("scene4").onclick = function() {
        if(togglePlayAll){ 
            document.getElementById("play-all").click();
        }
        initManualPlayer();
        console.log("manually load scene4");
        manuallyViewScene[4] = true;
    }

    document.getElementById("scene5").onclick = function() {
        if(togglePlayAll){ 
            document.getElementById("play-all").click();
        }
        initManualPlayer();
        console.log("manually load scene5");
        manuallyViewScene[5] = true;
    }

    document.getElementById("scene6").onclick = function() {
        if(togglePlayAll){ 
            document.getElementById("play-all").click();
        }
        initManualPlayer();
        console.log("manually load scene6");
        manuallyViewScene[6] = true;

    }
    
    document.getElementById("scene7").onclick = function() {
        if(togglePlayAll){ 
            document.getElementById("play-all").click();
        }
        initManualPlayer();
        console.log("manually load scene7");
        manuallyViewScene[7] = true;
    }

    // -------------------------------------------------------

    // ---- Manual scenes ----


    /**
    Format for a manual scene
    
    //| Scene # | t = [start time of scene, end time of scene] |
    if(manuallyViewScene[#]){
            if(!isTimeInit){
                TIME = 0;
                isTimeInit = true;

                *
                * Reset any timers you need here
                *

            }
            if(TIME < ending time of scene){

                *
                * Set your scene and timer handlers here
                * 

            }
        }

     */


    if(toggleManualPlay){ //Rendering Manually selected scene
        // | Scene 0 | t = [0,5] |
        if(manuallyViewScene[0]){
            if(!isTimeInit){ //Is the time not initalized, initalize it.
                TIME = 0;
                isTimeInit = true;
            }
            if(TIME <= 5){

                scene0();

            }
        }

        // | Scene 1 | t = [5,13] |
        if(manuallyViewScene[1]){
            if(!isTimeInit){
                TIME = 5;
                isTimeInit = true;

                resetTime(fadeTimer);
                resetTime(scene1T);

            }
            if(TIME <= 13){

                timerHandler(fadeTimer,22)
                timerHandler(scene1T,14);
                scene1();

            }
        }

        //| Scene 2 | t = [13, 20] |
        if(manuallyViewScene[2]){
            if(!isTimeInit){
                TIME = 13;
                isTimeInit = true;
                
                resetTime(scene2T);
                

            }
            if(TIME <= 20){

                //Set your scene and timer handlers here
                timerHandler(fadeTimer,26);
                timerHandler(scene2T,21);

                scene2();

            }
        }

        //| Scene 3 | t = [20, 25] |
        if(manuallyViewScene[3]){
            if(!isTimeInit){
                TIME = 20;
                isTimeInit = true;
                
                resetTime(scene3T);

            }
            if(TIME <= 25){

                //Set your scene and timer handlers here
                timerHandler(fadeTimer,26);
                timerHandler(scene3T,26);

                scene3();

            }
        }

        //| Scene 4 | t = [25, 31] |
        if(manuallyViewScene[4]){
            if(!isTimeInit){
                TIME = 25;
                isTimeInit = true;
                
                resetTime(scene4T);
                

            }
            if(TIME <= 31){

                timerHandler(scene4T,32);

                scene4();

            }
        }

        //| Scene 5 | t = [31, 38] |
        if(manuallyViewScene[5]){
            if(!isTimeInit){
                TIME = 31;
                isTimeInit = true;
                
                resetTime(scene5T);
                

            }
            if(TIME <= 38){

                timerHandler(scene5T,39);

                scene5();

            }
        }

        //| Scene 6 | t = [38, 45] |
        if(manuallyViewScene[6]){
            if(!isTimeInit){
                TIME = 38;
                isTimeInit = true;
                
                resetTime(scene6T);
                

            }
            if(TIME <= 45){

                timerHandler(scene6T,46);

                scene6();

            }
        }

        //| Scene 7 | t = [45, 50] |
        if(manuallyViewScene[7]){
            if(!isTimeInit){
                TIME = 45;
                isTimeInit = true;
                
                resetTime(scene7T);
                

            }
            if(TIME <= 50){

                timerHandler(scene7T,51);

                scene7();

            }
        }


    }

    // -----------------------

    // -------------------------------- End Manual Plays --------------------------------

    // -------------------------------- T- Pose -------------------------------

    //BTW this breaks the program and the fps counter, please refersh the page.
    document.getElementById("t-pose").onclick = function() {
        togglePlayAll = false;
        toggleManualPlay = false;
        toggleT_Pose = true;
    }

    if(toggleT_Pose){
        tpose(); 
    }


    // ------------------------------------------------------------ End Scenes ------------------------------------------------------------

    if( animFlag )
        window.requestAnimFrame(render);

}
// ------------------------------ End of Render Function ------------------------------


// A simple camera controller which uses an HTML element as the event
// source for constructing a view matrix. Assign an "onchange"
// function to the controller as follows to receive the updated X and
// Y angles for the camera:
//
//   var controller = new CameraController(canvas);
//   controller.onchange = function(xRot, yRot) { ... };
//
// The view matrix is computed elsewhere.
function CameraController(element) {
    var controller = this;
    this.onchange = null;
    this.xRot = 0;
    this.yRot = 0;
    this.scaleFactor = 3.0;
    this.dragging = false;
    this.curX = 0;
    this.curY = 0;
    
    // Assign a mouse down handler to the HTML element.
    element.onmousedown = function(ev) {
        controller.dragging = true;
        controller.curX = ev.clientX;
        controller.curY = ev.clientY;
    };
    
    // Assign a mouse up handler to the HTML element.
    element.onmouseup = function(ev) {
        controller.dragging = false;
    };
    
    // Assign a mouse move handler to the HTML element.
    element.onmousemove = function(ev) {
        if (controller.dragging) {
            // Determine how far we have moved since the last mouse move
            // event.
            var curX = ev.clientX;
            var curY = ev.clientY;
            var deltaX = (controller.curX - curX) / controller.scaleFactor;
            var deltaY = (controller.curY - curY) / controller.scaleFactor;
            controller.curX = curX;
            controller.curY = curY;
            // Update the X and Y rotation angles based on the mouse motion.
            controller.yRot = (controller.yRot + deltaX) % 360;
            controller.xRot = (controller.xRot + deltaY);
            // Clamp the X rotation to prevent the camera from going upside
            // down.
            if (controller.xRot < -90) {
                controller.xRot = -90;
            } else if (controller.xRot > 90) {
                controller.xRot = 90;
            }
            // Send the onchange event to any listener.
            if (controller.onchange != null) {
                controller.onchange(controller.xRot, controller.yRot);
            }
        }
    };
}
