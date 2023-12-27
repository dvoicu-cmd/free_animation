// ------------------------------ Textures Functions ------------------------------

function isLoaded(im) {
    if (im.complete) {
        console.log("loaded") ;
        return true ;
    }
    else {
        console.log("still not loaded!!!!") ;
        return false ;
    }
}

function loadFileTexture(tex, filename)
{
    tex.textureWebGL  = gl.createTexture();
    tex.image = new Image();
    tex.image.src = filename ;
    tex.isTextureReady = false ;
    // The image is going to be loaded asyncronously (lazy) which could be
    // after the program continues to the next functions. OUCH!
    tex.image.onload = function() { handleTextureLoaded(tex); }
}

function loadImageTexture(tex, image) {
    tex.textureWebGL  = gl.createTexture();
    tex.image = new Image();
    //tex.image.src = "CheckerBoard-from-Memory" ;
    
    gl.bindTexture( gl.TEXTURE_2D, tex.textureWebGL );
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating)
    gl.bindTexture(gl.TEXTURE_2D, null);
    tex.isTextureReady = true ;
}


function handleTextureLoaded(textureObj) {
    gl.bindTexture(gl.TEXTURE_2D, textureObj.textureWebGL);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // otherwise the image would be flipped upsdide down
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureObj.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating)
    gl.bindTexture(gl.TEXTURE_2D, null);
    console.log(textureObj.image.src) ;
    textureObj.isTextureReady = true ;
}

function handleTextureLoadedRepeated(textureObj) {
    gl.bindTexture(gl.TEXTURE_2D, textureObj.textureWebGL);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // otherwise the image would be flipped upsdide down
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureObj.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    //THIS DOES NOT WORK :(
    // I tried calling it but the repeat pattern is just keeps defualting to clamp to edge.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.bindTexture(gl.TEXTURE_2D, null);
    console.log(textureObj.image.src) ;
    textureObj.isTextureReady = true ;
}

function setColor(c)
{
    ambientProduct = mult(lightAmbient, c);
    diffuseProduct = mult(lightDiffuse, c);
    specularProduct = mult(lightSpecular, materialSpecular);
    
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, 
                                        "shininess"),materialShininess );
}

function toggleTextures() {
    useTextures = 1 - useTextures ;
    gl.uniform1i( gl.getUniformLocation(program,"useTextures"), useTextures );
    //For the program, in frag shader program, there is var useTextures, set it's value to the useTextures value
}

function toggleOpacity() {

}

function waitForTextures1(tex) {
    setTimeout( function() {
    console.log("Waiting for: "+ tex.image.src) ;
    wtime = (new Date()).getTime() ;
    if( !tex.isTextureReady )
    {
        console.log(wtime + " not ready yet") ;
        waitForTextures1(tex) ;
    }
    else
    {
        console.log("ready to render") ;
        window.requestAnimFrame(render);
    }
               },5) ;
    
}

// Takes an array of textures and calls render if the textures are created
function waitForTextures(texs) {
    setTimeout( function() {
               var n = 0 ;
               for ( var i = 0 ; i < texs.length ; i++ )
               {
                    console.log("boo"+texs[i].image.src) ;
                    n = n+texs[i].isTextureReady ;
               }
               wtime = (new Date()).getTime() ;
               if( n != texs.length )
               {
               console.log(wtime + " not ready yet") ;
               waitForTextures(texs) ;
               }
               else
               {
               console.log("ready to render") ;
               window.requestAnimFrame(render);
               }
               },5) ;
    
}

// ADD TEXTURE FILES TO HERE.
function initTextures() {

    // var location = window.location.pathname;
    // location = location.substring(0, location.lastIndexOf("/"));
    // location = location.substring(11);
    // Oh forget it. Everyone uses live server.

    //Load wood tiles 0
    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"/Project Submission/textures/woodTiles.png");

    //Load hat textures 1
    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"/Project Submission/textures/hatTexture.png");
    
    //Load body textures 2
    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"/Project Submission/textures/bodyTexture.png");
    
    //Load leg textures 3
    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"/Project Submission/textures/legTexture.png");
    
    //Load foot textures 4
    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"/Project Submission/textures/footTexture.png");
    
    //Load upper arm textures 5
    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"/Project Submission/textures/upperArmTexture.png");
    
    //Load ink textures 6
    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"/Project Submission/textures/inkTexture.png");
    
    //Load face textures 7
    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"/Project Submission/textures/faceTexture.png");

    //Load eyes joy textures 8
    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"/Project Submission/textures/eyeJoyTexture.png");

    //Load eyes neutral textures 9
    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"/Project Submission/textures/eyeTexture.png");

    //Load forearm textures 10
    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"/Project Submission/textures/forearmTexture.png");

    //Load face joy texture 11
    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"/Project Submission/textures/faceJoyTexture.png");


}


// ------------------------------ End of Texture Functions ------------------------------


// ------------------------------ Draw Functions ------------------------------


/**
 * Note:
 * I am positive there was a way to iterate through these textures and make this more generic,
 * I just did not bother as there are less than 20 textures.
 */
function applyTextureWoodFloor(){
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureArray[0].textureWebGL);
    gl.uniform1i(gl.getUniformLocation(program, "texture1"), 0);
    gl.uniform1f(gl.getUniformLocation(program, "blendFactor"), 0);
}

function applyTextureHat(blend){
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textureArray[1].textureWebGL);
    gl.uniform1i(gl.getUniformLocation(program, "texture1"), 1);
    blendInk(blend);
}

function applyTextureBody(blend){
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, textureArray[2].textureWebGL);
    gl.uniform1i(gl.getUniformLocation(program, "texture1"), 2);
    blendInk(blend);
}

function applyTextureLeg(blend){
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, textureArray[3].textureWebGL);
    gl.uniform1i(gl.getUniformLocation(program, "texture1"), 3);
    blendInk(blend);
}

function applyTextureFoot(blend){
    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, textureArray[4].textureWebGL);
    gl.uniform1i(gl.getUniformLocation(program, "texture1"), 4);
    blendInk(blend);
}

function applyTextureUpperArm(blend){
    gl.activeTexture(gl.TEXTURE5);
    gl.bindTexture(gl.TEXTURE_2D, textureArray[5].textureWebGL);
    gl.uniform1i(gl.getUniformLocation(program, "texture1"), 5);
    blendInk(blend);
}

function applyTextureInk(){
    gl.activeTexture(gl.TEXTURE6);
    gl.bindTexture(gl.TEXTURE_2D, textureArray[6].textureWebGL);
    gl.uniform1i(gl.getUniformLocation(program, "texture1"), 6);
}

function applyTextureFace(blend){
    gl.activeTexture(gl.TEXTURE7);
    gl.bindTexture(gl.TEXTURE_2D, textureArray[7].textureWebGL);
    gl.uniform1i(gl.getUniformLocation(program, "texture1"), 7);
    blendInk(blend);
}

function applyTextureEyeJoy(blend){
    gl.activeTexture(gl.TEXTURE8);
    gl.bindTexture(gl.TEXTURE_2D, textureArray[8].textureWebGL);
    gl.uniform1i(gl.getUniformLocation(program, "texture1"), 8);
    blendInk(blend);
}

function applyTextureEye(blend){
    gl.activeTexture(gl.TEXTURE9);
    gl.bindTexture(gl.TEXTURE_2D, textureArray[9].textureWebGL);
    gl.uniform1i(gl.getUniformLocation(program, "texture1"), 9);
    blendInk(blend);
}

function applyTextureForearm(blend){
    gl.activeTexture(gl.TEXTURE10);
    gl.bindTexture(gl.TEXTURE_2D, textureArray[10].textureWebGL);
    gl.uniform1i(gl.getUniformLocation(program, "texture1"), 10);
    blendInk(blend);
}

function applyTextureFaceJoy(blend){
    gl.activeTexture(gl.TEXTURE11);
    gl.bindTexture(gl.TEXTURE_2D, textureArray[11].textureWebGL);
    gl.uniform1i(gl.getUniformLocation(program, "texture1"), 11);
    blendInk(blend);
}

function blendInk(value){
    gl.uniform1i(gl.getUniformLocation(program, "texture2"), 6);
    gl.uniform1f(gl.getUniformLocation(program, "blendFactor"), value);
}


// ------------------------------ End of Draw Functions ------------------------------