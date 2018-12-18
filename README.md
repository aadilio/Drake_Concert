# term-project-group-29

1. Our project is a Drake concert with a special guest boss (Jay-Z). Unfortunately, the crowd (the user) is not in a good mood and is not enjoying the concert. Therefore the crowd resorts to aiming (with the user key inputs) and throwing (through another user input) very rubbery tomatoes (projectiles) at the performers. The tomatoes follow a natural arc and bounce of inertia in order to collide with the performer. These two concepts were our advanced features. Detecting collisions, and encoding physical properties (inertia) into each projectile. After the performer gets hit by 5 tomatoes, the performer gets pulled up with a string to ensure no more harm. After some time, the performer is let back on the stage to perform again, but this time he is moving faster in order to not get hit as often (the level difficulty is increased). There are three difficulties, and with each difficulty there is different music, and the user is given the option to change it. Finally, the crowd is also able to "boo" the performer in the middle of the concert. 
2. All group members worked on each portion together, therefore there is overlap in the explanations below.
Aadil: Collisions, Lights, Stage, Sound, Simulation
Joey: Projectiles+Inertia, Skybox, Body, Collisions, Curtains, Levels, Sound, OBJ files
Isaac: Body, Texture Maps + Backgrounds, Sound, OBJ Files
Collisions includes the tomato hitting Drake or Jay-Z and making them spin from the collision.
Projectiles includes the tomato flying from the center, the positioning, as well as the inertia of the bounce of the tomato.
Lights includes the lights that go over the concert to make it seem more like a concert.
Skybox includes creating a skybox for the Backgrounds
Body includes creating the body and transforming the matrix so that all the parts fit properly
Curtains include the text and start to each level
OBJ Files includes the import and use of OBJ files in the program
Texture Maps + Backgrounds includes the backgrounds for the different skyboxes and texture mapping of those.
Sound includes all of the music as well as the "boo" getting implemented.
3. To start the program, the user uses the following key:
  "<Enter>" = Start Level
  The program automatically increments the level once it is completed, however at the end of the boss level this is not the case as the user won! If the user wants to play a specific level again, they can choose a specific level through the following keys:
  "1" = Level 1
  "2" = Level 2
  "3" = Level 3
  In order to hit the performer, the user aims through a series of buttons:
  "J" = Move left
  "K" = Shoot tomatoes
  "L" = Move right
  Finally, the user is able to interact with the crowd directly by either booing or cutting off the volume completely. The following keys are shown below for that.
  "B" = Crowd boo  
  "M" = Stop the music

4. The sound files take time to load on the computer due to their size and the number we have. Therefore, certain sounds might not work at first while still loading.
