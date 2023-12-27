//NOTE: for the intent of stacking coordinate systems in render function, these modeling functions will intentionally not call the final pop operation.


// ----------- Ground ------------------
function drawGround(){
    //apply texture 
    applyTextureWoodFloor();

    gPush();
    {
        gTranslate(0,-5,0);
        gScale(35,1,65)
        setColor(vec4(0.2,0.2,0.2,1)) //Grey- ish
        drawCube();
    }
    //Don't pop ground
}


// ----------- Ink Puddle -----------
function drawPuddle(){
    applyTextureInk();

    gPush();
    {
        gScale(5,0.5,5);
        gTranslate(0,-8,0);
        drawSphere();
    }
}

// ---------------------- Character ----------------------

function drawCharacter(headXAngle, headYAngle, headZAngle, rightShoulder, leftShoulder, leftElbow, rightElbow, rightFootXAngle, rightFootYAngle, rightFootZAngle, leftFootXAngle, leftFootYAngle, leftFootZAngle, happy, inkBlend){
    //Draw Body
    gPush();
    {
        applyTextureBody(inkBlend); //Apply the texture
        gRotate(-90,0,1,0); //tmp rotation
        gScale(1,2,1);
        drawSphere();

        //Draw right leg
        gPush(); 
        {
            gTranslate(0,-0.75,-0.5);
            drawFoot(rightFootXAngle, rightFootYAngle, rightFootZAngle, inkBlend);
        }
        gPop();

        //Draw left leg
        gPush();
        {
            gTranslate(0,-0.75,0.5);
            drawFoot(leftFootXAngle, -leftFootYAngle, -leftFootZAngle, inkBlend);
        }
        gPop();

        //Draw left arm
        gPush();
        {
            gScale(0.75, 0.75, 0.75);
            gTranslate(0,1,1);
            drawArm(leftShoulder, leftElbow, inkBlend);
        }
        gPop();

        //Draw right arm
        gPush();
        {
            //The draw arm function was made for originally for the left arm. 
            //Just roate and invert the forearm bend paramater to get the same result on the right side.
            gRotate(180,0,1,0);
            gScale(0.75, 0.75, 0.75);
            gTranslate(0,1,1);
            drawArm(rightShoulder, -rightElbow, inkBlend);
        }
        gPop();

        //Draw head
        gPush();
        {
            drawHead(headXAngle, headYAngle, headZAngle, happy, inkBlend);
        }
        gPop();

    }
    gPop();
}

function drawHead(headXAngle, headYAngle, headZAngle, happy, inkBlend){
    //Draw neck
    gPush();
    {
        applyTextureInk();
        gScale(1,0.5,1); //Revert the body scale
        gScale(0.5,0.5,0.5);
        gTranslate(0,3.5,0);
        drawSphere();
        //Draw head
        gPush();
        {
            //Select texture
            if(happy == 1){
                applyTextureFaceJoy(inkBlend);
            }
            else{
                applyTextureFace(inkBlend);
            }
            //Head tilt controls:
            gRotate(headXAngle,1,0,0); //x --> tilts the head left and right
            gRotate(headYAngle,0,1,0);  //y --> spins the head
            gRotate(headZAngle,0,0,1); //z --> tilts the head up and down

            gScale(2,2,2); //Revert scale
            gTranslate(0,1,0);
            drawSphere();
            //Draw left eye
            gPush();
            {
                gTranslate(0.8,0,0.4);
                drawEye(happy, inkBlend);
            }
            gPop();
            //Draw right eye
            gPush();
            {
                gTranslate(0.8,0,-0.4);
                drawEye(happy, inkBlend);
            }
            gPop();

            //Draw hat
            gPush();
            {
                gTranslate(-1.5,0.75,0);
                drawHat(inkBlend);
            }
            gPop();

        }
        gPop();
    }
    gPop();
}

function drawEye(happy, inkBlend){
    gPush();
    {
        //Select Texture to apply
        if(happy == 1){
            applyTextureEyeJoy(inkBlend);
        }
        else {
            applyTextureEye(inkBlend);
        }
        //Shrink
        gScale(0.5,0.5,0.5);
        //Squish left and right of sphere
        gScale(0.5,1,0.5);
        drawSphere();
    }
    gPop();
}

function drawHat(inkBlend){
    applyTextureHat(inkBlend); //Apply Texture
    gPush();
    {
        //Hat shape
        //Don't ask how I got it, I just messed with some paramaters till I got what I want :) 
        gScale(0.8,0.9,1.2);
        gRotate(-90,1,0,0);
        gScale(2,1,1); //The length of the hat
        gRotate(-55,0,1,0);
        gScale(1,1,2); //The depth of the hat
        drawCone();
    }
    gPop();
}


/**
 * Draws the arm of the character
 * @param {*} ang1 The angle the rotates the shoulder joint
 * @param {*} ang2 The angle that rotates the elbow joint
 */
function drawArm(ang1, ang2, inkBlend){
    //Draw Joint 1
    gPush();
    {
        applyTextureUpperArm(inkBlend); //Apply Texture
        gScale(1,0.5,1); //Revert the body scale
        gScale(0.5,0.5,0.5); //Scrink
        drawSphere();
        //Draw upper arm
        gPush();
        {
            gRotate(ang1,1,0,0); //Controls the lat movement
            gScale(1,1,2);
            gTranslate(0,0,1);
            drawCube();
            //Draw Joint 2
            gPush();
            {
                gScale(1,1,0.5); //Revert scale
                gTranslate(0,0,2);
                drawSphere();
                //Draw forearm
                gPush();
                {
                    applyTextureForearm(inkBlend); //Apply texture
                    gRotate(ang2,0,1,0); //Controls the bend in forearm
                    gScale(1,1,2);
                    gTranslate(0,0,1);
                    drawCube();
                    //Draw arm
                    gPush();
                    {
                        applyTextureInk();
                        gScale(1,1,0.5); //Revert scale
                        gTranslate(0,0,3);
                        drawSphere();
                    }
                    gPop();
                }
                gPop();
            }
            gPop();
        }
        gPop();
    }
    gPop();
}


/**
 * Draws the foot
 * @param {int} ang The angle that rotates the leg.
 */
function drawFoot(angX, angY, angZ, inkBlend){
    //Draw Joint
    gPush();
    {
        //Plug in variables here to move the foot:

        gRotate(angX,1,0,0); // x -> Spreads the legs
        gRotate(angY,0,1,0); // y -> Spins the legs
        gRotate(angZ,0,0,1); // z -> Rotates the legs forward and back

        gScale(1,0.5,1); // Revert scale from body
        gScale(0.5,0.5,0.5); //Apply new scale
        drawSphere();
        
        //Draw leg
        gPush();
        {
            applyTextureLeg(inkBlend); //Apply texture
            gTranslate(0,-0.5,0);
            gScale(1,1.5,1);
            drawCube();
        }
        gPop();
        
        //Draw foot
        gPush();
        {
            applyTextureFoot(inkBlend); //Apply texture
            gRotate(90,0,0,1);
            gTranslate(-1.75,-1,0);
            gScale(1.5,2,1.2); //x -> flatten feet, y -> leghten feet, z -> widen feet
            drawSphere();
        }
        gPop();

    }
    gPop();
}

// ------------------------------------------------------------------