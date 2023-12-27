Dan Voicu: Assignment 2 Free Animation

Description:
I worked on animating an original character that I modelled and textured rising out of an ink puddle. 

Set Up & Quirks:
Due to my crappy implementation of loading textures using relative imports, you need to run the html file using live server in VSCode. Go to Extensions -> Search Live Server -> Install Plugin -> Right click main.html -> Open with Live Server
The character t-pose button breaks the program in many ways. The fps breaks when using the free camera, you can't load other scenes, etc. Best to just refresh the page when you click it.
Playing scene 2 and scene 3 repeatedly messes up the timer for controlling the ink texture on the character. Play scene 1 to reset it.

Interface Guide:
The interface should be self explanatory. You can select an individual scene to play or play all scenes in order. Additionally, you can see the character t-pose by clicking the t-pose button. The camera controls are enabled in t-pose mode, so you can view the model at multiple angles. (Just remember to refresh the page)


Minimum Requirements:
1) I've implemented multiple hierarchical objects, most notably in the character model.
2) I've created and mapped multiple custom textures onto the character model.
3) I've edited the fragment shader to manually control the blend between two textures. ex: When the character rises from the ink, his textures will mix with the ink textures.
4) In each scene. The camera moves around using functions that call lookAt().
5) I've used the date.gettime() method to emulate real time to animate various components in the project. For more details, look into the timers.js file
6) The fps is displayed and shown under the scene selector buttons. It is updated in 2 second increments.
7) The movie and a little thumbnail are included in the Movie Submission directory.
8) This file you are currently reading has been included.

Additional Evaluation
9) Complexity: Implemented complex character model with multiple moving parts.
10) Creativity: Unique character design for animation.
11) Quality: Ehhhhhh, I think it looks good.
12) Programming Style: I tried to keep everything as organized as possible, but I did take a few short cuts and just refused to use for loops in certain sections.


Additional Notes:
I used the program aseprite to create the pixel textures.
The character's name is Zolin.