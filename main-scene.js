class Tomato {
  constructor(x_coord, y_coord, z_coord, velocity) {
    this.x_coord = x_coord;
    this.y_coord = y_coord;
    this.z_coord = z_coord;
    this.projectile_time = 0;
    this.has_collided = false;
    this.velocity = velocity;
  }
}

window.Drake_Concert_Scene = window.classes.Drake_Concert_Scene =
class Drake_Concert_Scene extends Scene_Component
  { constructor( context, control_box )
      {
        super(   context, control_box );
        Object.assign( this, { time_accumulator: 0, time_scale: 1, t: 0, dt: 1/20, bodies: [], steps_taken: 0 } );   //Bodies is defined here



        if( !context.globals.has_controls   )
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) );

        context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,0,20 ), Vec.of( 0,2,0 ), Vec.of( 0,1,0 ) );

        const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        // define the songs for the game
        this.sounds = {
                          imf_drake: new Audio('assets/inmyfeelings.mp3'),
                          im_upset_drake: new Audio('assets/imupsetdrake.mp3'),
                          jay_z_song: new Audio('assets/jay_z_song.mp3'),
                          crowd_boo: new Audio('assets/CrowdBooo.mp3'),
                      }

        // define the shapes for the game
        const shapes = {
                          head: new Subdivision_Sphere(3),
                          body: new Subdivision_Sphere(3),
                          box: new Cube(),
                          arm1: new Cube(),
                          skybox: new SkyCube(),
                          arms: new Rounded_Capped_Cylinder(2, 4),
                          tomato: new Subdivision_Sphere(3),

                          // OBJ SHAPES
                          obj_level_one: new Shape_From_File( "assets/level_one.obj"),
                          obj_level_two: new Shape_From_File( "assets/level_two.obj"),
                          obj_the_boss: new Shape_From_File( "assets/the_boss.obj"),
                          obj_the_end: new Shape_From_File( "assets/the_end.obj"),
                          obj_jay_z: new Shape_From_File( "assets/jay_z.obj"),
                          obj_drake_sign: new Shape_From_File( "assets/drake_sign.obj"),
                          obj_drake_legs: new Shape_From_File( "assets/drake_legs.obj"),
                          obj_drake_smile: new Shape_From_File( "assets/drake_smile.obj"),
                          obj_drake_sunglasses: new Shape_From_File( "assets/drake_sunglasses.obj"),
                          obj_drake_torso: new Shape_From_File( "assets/drake_torso.obj"),
                          obj_drake_upper_arm: new Shape_From_File( "assets/drake_upper_arm.obj"),
                          obj_drake_forearm: new Shape_From_File( "assets/drake_forearm.obj"),
                          obj_arrow: new Shape_From_File( "assets/obj_arrow.obj"),
                       }

        this.submit_shapes( context, shapes );

        // define the materials for the game
        this.materials =
          {
            phong: context.get_instance( Phong_Shader ).material( Color.of( 0.737,0.737,0.737,1 ) ),
            mybody: context.get_instance( Phong_Shader ).material( Color.of( 0,0.2,1,1 ) ),
            drake_head: context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance( "assets/newDrake.jpg", true ) } ),
            jay_z_head: context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance( "assets/jay_z_face.jpg", true ) } ),
            texture1: context.get_instance( Phong_Shader ).material(Color.of(0,0,0,0.9), {ambient:0.9, texture: context.get_instance("assets/shirt.jpg", false)}),
            crowd: context.get_instance( Phong_Shader ).material(Color.of(0,0,0,1), {ambient:1, texture: context.get_instance("assets/crowdleft.jpg", false)}),
            black: context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ) ),
            dark_gray: context.get_instance( Phong_Shader ).material( Color.of( 0.1,0.1,0.1,1 ), { ambient: 1, diffusivity: 0, specularity: 0.6 } ),
            blue: context.get_instance( Phong_Shader ).material( Color.of( 0.243, 0.407, 0.678, 1) ),
            light_brown: context.get_instance( Phong_Shader ).material( Color.of( 0.698, 0.580, 0.474, 1) ),
            jay_z_skin: context.get_instance( Phong_Shader ).material( Color.of( 0.647, 0.302, 0.160, 1),{ ambient: 1, diffusivity: 0, specularity: 0.6 } ),
            purple: context.get_instance( Phong_Shader ).material( Color.of( 0.454, 0.368, 0.509, 1), { ambient: 1, diffusivity: 0, specularity: 0 } ),
            tomato: context.get_instance( Phong_Shader ).material( Color.of( 0.5, 0, 0, 1 ), { ambient: 1, diffusivity: 0.2, specularity: 1 }),
            arm_texture: context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance( "assets/skin.png", false)}),
            curtains_left_texture: context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance( "assets/curtains_left.png", false)}),
            curtains_right_texture: context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance( "assets/curtains_right.png", false)}),

            skybox_level_one: context.get_instance( Phong_Shader ).material(Color.of(0,0,0,1), {ambient:1, texture: context.get_instance("assets/skybox_level_one.jpg", false)}),
            skybox_level_two: context.get_instance( Phong_Shader ).material(Color.of(0,0,0,1), {ambient:1, texture: context.get_instance("assets/skybox_level_two.jpg", false)}),
            skybox_the_boss: context.get_instance( Phong_Shader ).material(Color.of(0,0,0,1), {ambient:1, texture: context.get_instance("assets/skybox_the_boss.jpg", false)}),

            // OBJ MATERIALS
            obj_drake_sign_material: context.get_instance( Phong_Shader ).material( Color.of( 0.698,0.650,0.498,0.8 ), { ambient: 0.8, diffusivity: .5, specularity: .5 }),
            obj_level_material: context.get_instance( Phong_Shader ).material( Color.of( 1,1,1,1 ), { ambient: 0.8, diffusivity: .5, specularity: .5 }),
            obj_drake_torso_material: context.get_instance( Phong_Shader ).material( Color.of( 0.243, 0.407, 0.678, 1), { ambient: 1, diffusivity: 0, specularity: 0 }),
            obj_drake_sunglasses_material: context.get_instance( Phong_Shader ).material( Color.of( 0, 0, 0, 0.7), { ambient: 1, diffusivity: 0, specularity: 0 }),
            obj_drake_arm_material: context.get_instance( Phong_Shader ).material( Color.of( 0.886, 0.623, 0.517, 1), { ambient: 1, diffusivity: 0, specularity: 0.6 }),
          }

        // define the lights for the game
        this.lights = [
                        new Light( Vec.of( 0,10,25,1 ), Color.of( 1,1,1,1 ), 100000 )
                      ];

        //Aadil Addition to constructor
        this.data = new Test_Data( context );
        //this.submit_shapes( context, this.data.shapes ); //Not using Test Data class anymore
        this.collider = new Subdivision_Sphere(1);        // Make a simpler dummy shape for representing all other shapes during collisions.

        this.inactive_color = context.get_instance( Phong_Shader ).material( Color.of( 0,1,0,1 ), //The green color
                                                            { ambient: .2, texture: this.data.textures.rgb } );
        this.active_color = this.inactive_color.override( { color: Color.of( 0.5,0,0,1 ), ambient: .5 } );
        this.transparent = context.get_instance( Phong_Shader ).material( Color.of( 1,0,1,.1 ), { ambient: .4 } );
        //Aadil end to constructor addtion

        // EXTRA GLOBAL VARIABLES
        this.game_level = 1;
        this.current_song = "imf_drake";

        // drake variables
        this.drake_x_coord = 0;
        this.drake_y_coord = -1.6;
        this.drake_rotation = 0;
        this.drake_speed = 1;
        this.drake_lives = 5;
        this.drake_dying = false;
        this.drake_dying_time = 0;

        // curtain variables
        this.curtains_closed = true;
        this.curtains_displacement = 0;
        this.shooting_time = false;

        // variables for the projectile
        this.projectile_x_coordinate = 0;
        this.projectile_y_displacement = 0;
        this.projectile_z_displacement = 0;
        this.projectile_time = 0;
        this.launched = false;

        // create an array of projectiles
        this.projectiles = [];
        this.bouncers = [];

        //Collision Vars
        this.head_transform = Mat4.identity();

      }

    //----------------------------Aadil Additional functions beginning


    simulate( frame_time )                              // Carefully advance time according to Glenn Fiedler's "Fix Your Timestep" blog post.
    { frame_time = this.time_scale * frame_time;                   // This line lets us create the illusion to the simulator that
                                                                   // the display framerate is running fast or slow.
                                                                   // Avoid the spiral of death; limit the amount of time we will spend
      this.time_accumulator += Math.min( frame_time, 0.1 );	       // computing during this timestep if display lags.
      while ( Math.abs( this.time_accumulator ) >= this.dt )       // Repeatedly step the simulation until we're caught up with this frame.
      { this.update_state( this.dt );                              // Single step of the simulation for all bodies.
        for( let b of this.bodies ) b.advance( this.dt );

        this.t                += Math.sign( frame_time ) * this.dt;   // Following the advice of the article, de-couple
        this.time_accumulator -= Math.sign( frame_time ) * this.dt;   // our simulation time from our frame rate.
        this.steps_taken++;
      }
      let alpha = this.time_accumulator / this.dt;                 // Store an interpolation factor for how close our frame fell in between
      for( let b of this.bodies ) b.blend_state( alpha );          // the two latest simulation time steps, so we can correctly blend the
    }
    random_shape( shape_list = this.shapes )
    { const shape_names = Object.keys( shape_list );
      return shape_list[ shape_names[ ~~( shape_names.length * Math.random() ) ] ]
    }

    //----------------------------Aadil Additional functions end


    // function to play the song
    play_sound( name, volume = 1 )
    { if( 0 < this.sounds[ name ].currentTime && this.sounds[ name ].currentTime < .3 ) return;
      this.sounds[ name ].currentTime = 0;
      this.sounds[ name ].volume = Math.min(Math.max(volume, 0), 1);;
      this.sounds[ name ].play();
    }

    // function to play the song
    stop_sound( name )
    {
      this.sounds[ name ].stop();
    }

    make_control_panel()
      {
        this.key_triggered_button( "Start The Concert",  [ "Enter" ], () =>  {
          if (this.game_level < 4) {
            this.play_sound( this.current_song );
            this.curtains_closed = false;
            this.curtains_displacement = 0;
          }
        });
        this.key_triggered_button( "Stop Music",  [ "m" ], () =>  {
          this.sounds[ this.current_song ].pause();
        });
        this.new_line();
        this.key_triggered_button( "Move Left",  [ "j" ], () => this.projectile_x_coordinate = Math.max(this.projectile_x_coordinate - 0.2, -8) );
        this.key_triggered_button( "Move Right",  [ "l" ], () => this.projectile_x_coordinate = Math.min(this.projectile_x_coordinate + 0.2, 8) );
        this.new_line();
        this.key_triggered_button( "Shoot Tomato",  [ "k" ], () => {
          if (this.shooting_time) {
            this.projectiles.push(new Tomato(this.projectile_x_coordinate, -1, 15, 25));
          }
        });
        this.new_line();
        this.key_triggered_button( "Level 1",  [ "1" ], () => {
          this.curtains_closed = true;
          this.shooting_time = false;
          this.game_level = 1;
          this.sounds[this.current_song].pause();
        });
        this.key_triggered_button( "Level 2",  [ "2" ], () =>  {
          this.curtains_closed = true;
          this.shooting_time = false;
          this.game_level = 2;
          this.sounds[this.current_song].pause();
          this.current_song = "im_upset_drake";
        });
        this.key_triggered_button( "The Boss",  [ "3" ], () => {
          this.curtains_closed = true;
          this.shooting_time = false;
          this.game_level = 3;
          this.sounds[this.current_song].pause();
          this.current_song = "jay_z_song";
        });
        this.new_line();
        this.key_triggered_button( "Boo",  [ "b" ], () =>  {
          this.play_sound( "crowd_boo" );
        });

      }
    display( graphics_state )
      {

        graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;


        // ----- JOEY'S PART -----


        // change the light
        if (this.game_level === 3)
        {
      //    this.lights[0] = new Light( Vec.of( 10 * Math.cos(2 * t),10,10 * Math.sin(2 * t),1 ), Color.of( 1,1,1,1 ), 1000 * (1+Math.sin(t)) );
      //    this.lights[1] = new Light( Vec.of( 10 * Math.cos(0.5 * t),10,10 * Math.sin(0.5 * t),1 ), Color.of( 1,1,1,1 ), 1000 * (1+Math.sin(t)) );
          this.lights[0] = new Light( Vec.of( 10 * Math.cos(2 * t),10,10 * Math.sin(2 * t),-30 ), Color.of( 1,1,1,1 ), 1000 );
          this.lights[1] = new Light( Vec.of( 10 * Math.cos(0.5 * t),10,10 * Math.sin(0.5 * t),1 ), Color.of( 1,1,1,1 ), 1000 );
          this.lights[2] = new Light( Vec.of( 0,10,25,1 ), Color.of( 1,0,0,1 ), 10000 );


        }
        else if (this.game_level === 2)
        {
          this.lights[0] = new Light( Vec.of( 10 * Math.cos(2 * t),10,10 * Math.sin(2 * t),1 ), Color.of( 1,1,1,1 ), 1000 );
          this.lights[1] = new Light( Vec.of( 0,10,25,1 ), Color.of( 1,1,1,1 ), 1000 );
          this.lights[2] = new Light( Vec.of( 0,10,25,1 ), Color.of( 1,0,0,1 ), 100000 );

        }
        else
        {
          this.lights[0] = new Light( Vec.of( 10 * Math.cos(2 * t),10,10 * Math.sin(2 * t),1 ), Color.of( 0,0,1,1 ), 1000 );
          this.lights[1] = new Light( Vec.of( 0,10,25,1 ), Color.of( 1,1,1,1 ), 100000 );
          this.lights[2] = new Light( Vec.of( 0,10,25,1 ), Color.of( 1,1,1,1 ), 100000 );

        }


        // pick the song
        if (this.game_level === 1) {
          this.current_song = "imf_drake";
        }
        else if (this.game_level === 2) {
          this.current_song = "im_upset_drake";
        }
        else {
          this.current_song = "jay_z_song";
        }

        // ----- DRAW THE CURTAINS -----

        let curtains_left_transform = Mat4.identity();
        let curtains_right_transform = Mat4.identity();

        if (this.curtains_closed) {
          // left curtain when closed
          curtains_left_transform = curtains_left_transform.times( Mat4.translation([ -8,1,4 ]));
          curtains_left_transform = curtains_left_transform.times( Mat4.scale([ 8,8,0 ]));
          this.shapes.box.draw( graphics_state, curtains_left_transform, this.materials.curtains_left_texture );

          // right curtain when closed
          curtains_right_transform = curtains_right_transform.times( Mat4.translation([ 8,1,3.9 ]));
          curtains_right_transform = curtains_right_transform.times( Mat4.scale([ 8,8,0 ]));
          this.shapes.box.draw( graphics_state, curtains_right_transform, this.materials.curtains_right_texture );

          let level_transform = Mat4.identity();
          level_transform = level_transform.times( Mat4.translation([ 0,2,8.1 ]));
          if (this.game_level === 1) {
            level_transform = level_transform.times( Mat4.scale([2,2,2]));
            this.shapes.obj_level_one.draw( graphics_state, level_transform, this.materials.obj_level_material );
          }
          else if (this.game_level === 2) {
            level_transform = level_transform.times( Mat4.scale([2,2,2]));
            this.shapes.obj_level_two.draw( graphics_state, level_transform, this.materials.obj_level_material );
          }
          else if (this.game_level === 3) {
            level_transform = level_transform.times( Mat4.translation([1,0,0]))
            level_transform = level_transform.times( Mat4.scale([2,2,2]));
            this.shapes.obj_the_boss.draw( graphics_state, level_transform, this.materials.obj_level_material );
          }
          else {
            level_transform = level_transform.times( Mat4.scale([2,2,2]));
            this.shapes.obj_the_end.draw( graphics_state, level_transform, this.materials.obj_level_material );
          }
        }
        else {
          if (this.curtains_displacement < 15) {
            this.curtains_displacement = this.curtains_displacement + (7 * dt)
            // left curtain when opening
            curtains_left_transform = curtains_left_transform.times( Mat4.translation([ (-8 - this.curtains_displacement),1,4 ]));
            curtains_left_transform = curtains_left_transform.times( Mat4.scale([ 8,8,0 ]));
            this.shapes.box.draw( graphics_state, curtains_left_transform, this.materials.curtains_left_texture );

            // right curtain when opening
            curtains_right_transform = curtains_right_transform.times( Mat4.translation([ (8 + this.curtains_displacement),1,3.9 ]));
            curtains_right_transform = curtains_right_transform.times( Mat4.scale([ 8,8,0 ]));
            this.shapes.box.draw( graphics_state, curtains_right_transform, this.materials.curtains_right_texture );
          }
          this.shooting_time = true;
        }

        // ----- DRAW THE SKYBOX -----

        let skybox_transform = Mat4.identity();
        let skybox_scale = 200;
        skybox_transform = skybox_transform.times( Mat4.scale([skybox_scale, skybox_scale, skybox_scale]));

        // instantiate the skybox
        if (this.game_level === 1) {
          this.shapes.skybox.draw(graphics_state, skybox_transform, this.materials.skybox_level_one);
        }
        else if (this.game_level === 2) {
          this.shapes.skybox.draw(graphics_state, skybox_transform, this.materials.skybox_level_two);
        }
        else {
          this.shapes.skybox.draw(graphics_state, skybox_transform, this.materials.black);
        }


        // ----- DRAW THE "DRAKE" SIGN -----

        let drake_sign_transform = Mat4.identity();

        if (this.game_level === 3) {
          drake_sign_transform = drake_sign_transform.times( Mat4.translation([-1, 8, 0]));
          drake_sign_transform = drake_sign_transform.times( Mat4.scale([ 3, 3, 3 ]));
          this.shapes.obj_jay_z.draw( graphics_state, drake_sign_transform, this.materials.obj_drake_sign_material );
        }
        else {
          drake_sign_transform = drake_sign_transform.times( Mat4.translation([0, 8, 0]));
          drake_sign_transform = drake_sign_transform.times( Mat4.scale([ 3, 3, 3 ]));
          this.shapes.obj_drake_sign.draw( graphics_state, drake_sign_transform, this.materials.obj_drake_sign_material );
        }


        // ----- DRAW DRAKE -----

        // if drake is dying
        let drake_transform = Mat4.identity();
        if (this.drake_dying) {
          this.drake_y_coord += 0.05;
          this.drake_dying_time += dt;

          if (this.drake_dying_time > 5) {
            this.drake_dying = false;
            this.curtains_closed = true;
            this.shooting_time = false;
            this.game_level += 1;
            this.drake_lives = 5;
            this.sounds[this.current_song].pause();
          }

          drake_transform = drake_transform.times( Mat4.translation([this.drake_x_coord, this.drake_y_coord, 0]));
          drake_transform = drake_transform.times( Mat4.rotation(5 * t, Vec.of(0, 1, 0)));
        }
        else {
          this.drake_x_coord = 8 * Math.sin(this.game_level * 2 * t);
          drake_transform = drake_transform.times( Mat4.translation([8 * Math.sin(this.game_level * 2 * t), -1.6, 0]));
          if (this.drake_rotation === 0) {
            drake_transform = drake_transform.times( Mat4.rotation((Math.PI / 8) * Math.sin(t), Vec.of(0, 1, 0)));
          } else {
            drake_transform = drake_transform.times( Mat4.rotation((this.drake_rotation / 10) * Math.PI, Vec.of(0, 1, 0)));
            this.drake_rotation = (this.drake_rotation + 1) % 20;
          }
          //drake_transform = drake_transform.times( Mat4.translation([0, -1.6, 0]));
        }

        // head transform
        //let head_transform = drake_transform;
        this.head_transform = drake_transform;
        this.head_transform = this.head_transform.times( Mat4.translation([ 0, 3.1, 0 ]));
        this.head_transform = this.head_transform.times( Mat4.scale([ 0.55, 0.7, 0.55 ]));
        if (this.game_level === 3) {
          this.shapes.head.draw( graphics_state, this.head_transform, this.materials.jay_z_head );
        }
        else {
          this.shapes.head.draw( graphics_state, this.head_transform, this.materials.drake_head );
        }

        // draw the sunglasses
        let glasses_transform = this.head_transform;
        glasses_transform = glasses_transform.times( Mat4.translation([ 0, 0, 0.7 ]));
        glasses_transform = glasses_transform.times( Mat4.rotation(-1 * Math.PI / 2, Vec.of(1, 0, 0)));
        glasses_transform = glasses_transform.times( Mat4.scale([ 0.78, 0.7, 0.65 ]));
        this.shapes.obj_drake_sunglasses.draw( graphics_state, glasses_transform, this.materials.obj_drake_sunglasses_material );

        // legs transform
        let legs_transform = drake_transform;
        legs_transform = legs_transform.times( Mat4.rotation(-1 * Math.PI / 2, Vec.of(1, 0, 0)));
        legs_transform = legs_transform.times( Mat4.scale([ 0.6, 0.6, 0.6 ]));
        if (this.game_level === 3) {
          this.shapes.obj_drake_legs.draw( graphics_state, legs_transform, this.materials.dark_gray );
        }
        else {
          this.shapes.obj_drake_legs.draw( graphics_state, legs_transform, this.materials.black );
        }


        // torso transform
        let torso_transform = drake_transform;
        torso_transform = torso_transform.times( Mat4.translation([ 0, 1.7, 0 ]));
        torso_transform = torso_transform.times( Mat4.rotation(-1 * Math.PI / 2, Vec.of(1, 0, 0)));
        torso_transform = torso_transform.times( Mat4.scale([ 0.6, 0.6, 0.6 ]));
        if (this.game_level === 3) {
          this.shapes.obj_drake_torso.draw( graphics_state, torso_transform, this.materials.purple );
        }
        else {
          this.shapes.obj_drake_torso.draw( graphics_state, torso_transform, this.materials.obj_drake_torso_material );
        }

        // upper arms - right and left
        let upper_arm_right_transform = torso_transform;
        let upper_arm_left_transform = torso_transform;
        // left arm
        upper_arm_left_transform = upper_arm_left_transform.times( Mat4.translation([ -1.2, 0, 0.3 ]));
        upper_arm_left_transform = upper_arm_left_transform.times( Mat4.rotation(-1 * (Math.PI / 2 - Math.PI / 8), Vec.of(0, 1, 0)));
        upper_arm_left_transform = upper_arm_left_transform.times( Mat4.scale([ 0.8, 0.5, 0.8 ]));
        if (this.game_level === 3) {
          this.shapes.obj_drake_upper_arm.draw( graphics_state, upper_arm_left_transform, this.materials.jay_z_skin);
        }
        else {
          this.shapes.obj_drake_upper_arm.draw( graphics_state, upper_arm_left_transform, this.materials.obj_drake_arm_material);
        }

        // right arm
        upper_arm_right_transform = upper_arm_right_transform.times( Mat4.translation([ 1.2, 0, 0.3 ]));
        upper_arm_right_transform = upper_arm_right_transform.times( Mat4.rotation(Math.PI / 2 - Math.PI / 8, Vec.of(0, 1, 0)));
        upper_arm_right_transform = upper_arm_right_transform.times( Mat4.scale([ 0.8, 0.5, 0.8 ]));
        if (this.game_level === 3) {
          this.shapes.obj_drake_upper_arm.draw( graphics_state, upper_arm_right_transform, this.materials.jay_z_skin);
        }
        else {
          this.shapes.obj_drake_upper_arm.draw( graphics_state, upper_arm_right_transform, this.materials.obj_drake_arm_material);
        }

        // forearms - right and left
        let forearm_right_transform = upper_arm_right_transform;
        let forearm_left_transform = upper_arm_left_transform;
        // right forearm
        forearm_right_transform = forearm_right_transform.times( Mat4.translation([ 0, 0, 1 ]));
        forearm_right_transform = forearm_right_transform.times( Mat4.rotation(-1 * (Math.PI / 4) * Math.sin(5 * t) - (Math.PI / 4), Vec.of(0, 1, 0)));
        forearm_right_transform = forearm_right_transform.times( Mat4.scale([ 0.5, 0.5, 0.5 ]));
        forearm_right_transform = forearm_right_transform.times( Mat4.translation([ 0, 0, 2.1 ]));
        if (this.game_level === 3) {
          this.shapes.obj_drake_forearm.draw( graphics_state, forearm_right_transform, this.materials.jay_z_skin );
        }
        else {
          this.shapes.obj_drake_forearm.draw( graphics_state, forearm_right_transform, this.materials.obj_drake_arm_material );
        }

        // left forearm
        forearm_left_transform = forearm_left_transform.times( Mat4.translation([ 0, 0, 1.0 ]));
        forearm_left_transform = forearm_left_transform.times( Mat4.rotation((Math.PI / 4) * Math.sin(5 * t) + (Math.PI / 4), Vec.of(0, 1, 0)));
        forearm_left_transform = forearm_left_transform.times( Mat4.scale([ 0.5, 0.5, 0.5 ]));
        forearm_left_transform = forearm_left_transform.times( Mat4.translation([ 0, 0, 1.7 ]));
        if (this.game_level === 3) {
          this.shapes.obj_drake_forearm.draw( graphics_state, forearm_left_transform, this.materials.jay_z_skin );
        }
        else {
          this.shapes.obj_drake_forearm.draw( graphics_state, forearm_left_transform, this.materials.obj_drake_arm_material );
        }


        // draw the projectile arrow
        if (this.shooting_time) {
          let shooting_transform = Mat4.identity();
          shooting_transform = shooting_transform.times( Mat4.translation([ this.projectile_x_coordinate, -3.3, 1]));
          shooting_transform = shooting_transform.times( Mat4.scale([ 0.8, 0.8, 0.8 ]));
          this.shapes.obj_arrow.draw( graphics_state, shooting_transform, this.materials.tomato );
        }

        // move all the tomatoes that have been launched
        for (let b of this.projectiles) {
          b.projectile_time += dt;
          b.y_coord = -1 + (b.velocity * b.projectile_time) + (0.5 * (-10 * 9.8) * b.projectile_time * b.projectile_time);
          b.z_coord = 15 - 29.41 * b.projectile_time;

          let projectile_transform = Mat4.identity();
          projectile_transform = projectile_transform.times( Mat4.translation([ b.x_coord, b.y_coord, b.z_coord ]));
          projectile_transform = projectile_transform.times( Mat4.scale([ 0.3, 0.3, 0.3 ]));
          this.shapes.tomato.draw( graphics_state, projectile_transform, this.materials.tomato );

          if (b.y_coord <= -1.6 && b.z_coord <= 0) {
            b.projectile_time = 0;
            //this.bouncers.push(b);
            this.bouncers.push(new Tomato(b.x_coord, -1.6, b.z_coord, b.velocity * 0.8));
          }

          if (Math.sqrt(Math.pow(this.drake_x_coord - b.x_coord, 2) + Math.pow(-1 - b.y_coord, 2) + Math.pow(0 - b.z_coord, 2)) < 0.8) {
            b.has_collided = true;
            this.drake_rotation = 1;
            this.drake_lives -= 1;
            if (this.drake_lives === 0) {
              this.drake_dying = true;
              this.drake_dying_time = 0;
              this.drake_y_coord = -1.6;
            }
          }
        }

        this.projectiles = this.projectiles.filter( b => (b.y_coord > -1.6) && (! b.has_collided));

        // move all the tomatoes that have been bounced
        for (let b of this.bouncers) {

          if (Math.abs(b.x_coord) < 2 && b.z_coord > -40 && b.y_coord < -1.7) {
            b.velocity *= -0.8;
          }
          else {
            b.velocity -= (10 * 9.8) * dt;
          }

          b.projectile_time += dt;
          b.y_coord += b.velocity * dt;
          //b.y_coord = -1.6 + (0.8 * b.velocity * b.projectile_time) + (0.5 * (-10 * 9.8) * b.projectile_time * b.projectile_time);
          b.z_coord -= 29.41 * dt;

          let projectile_transform = Mat4.identity();
          projectile_transform = projectile_transform.times( Mat4.translation([ b.x_coord, b.y_coord, b.z_coord ]));
          projectile_transform = projectile_transform.times( Mat4.scale([ 0.3, 0.3, 0.3 ]));
          this.shapes.tomato.draw( graphics_state, projectile_transform, this.materials.tomato );
        }

        this.bouncers = this.bouncers.filter( b => b.projectile_time < 2 );

        // ----- END JOEY'S PART

        //draw the stage
        let model_transformStage = Mat4.identity();
        model_transformStage = model_transformStage.times( Mat4.translation([0, -4, -20]));
        model_transformStage = model_transformStage.times( Mat4.scale([ 2, 2, 21 ]) );
        this.shapes.box.draw(graphics_state, model_transformStage, this.materials.phong);
        model_transformStage = Mat4.identity();
        model_transformStage = model_transformStage.times( Mat4.translation([0, -4, -1]));
        model_transformStage = model_transformStage.times( Mat4.scale([ 10, 2, 2 ]) );
        this.shapes.box.draw(graphics_state, model_transformStage, this.materials.phong);


        /*
         //  ----- Aadil's Collisions PART


        if( !graphics_state.lights.length )
            graphics_state.lights = [ new Light( Vec.of( 7,15,20,0 ), Color.of( 1,1,1,1 ), 100000 ) ];

        if( this.globals.animate )
            this.simulate( graphics_state.animation_delta_time );                 // Advance the time and state of our whole simulation.
        for( let b of this.bodies )
            b.shape.draw( graphics_state, b.drawn_location, b.material );   // Draw each shape at its current location.


        // ----- END Aadil's Collisions PART
        */

      }

//Aadil Part additional function

      update_state( dt, num_bodies = 40 )
      {

            /*
            //Original Collisions
            if   ( this.bodies.length > num_bodies )  this.bodies = this.bodies.splice( 0, num_bodies );                // Max of 20 bodies
            while( this.bodies.length < num_bodies )                                        // Generate moving bodies:
                  this.bodies.push( new Body( this.random_shape(), undefined, Vec.of( 1,1,1 ) ) //Makes a sphere in our current version
                             .emplace(         Mat4.translation( Vec.of( 0,0,0 ).randomized(30) ) //Radius of how far the balls go
                             .times( Mat4.rotation( Math.PI, Vec.of( 0,0,0 ).randomized(1).normalized() ) ),
                                     Vec.of( 0,0,0 ).randomized(20), Math.random() ) );

                                      // Sometimes we delete some so they can re-generate as new ones:
            this.bodies = this.bodies.filter( b => ( Math.random() > .01 ) || b.linear_velocity.norm() > 1 ); //This is so that we don't get stuck. Won't use in our version.

            for( let b of this.bodies )
             {
                 var b_inv = Mat4.inverse( b.drawn_location );           // Cache this quantity to save time. //NOT SURE WHAT THE PURPOSE OF THSIS IS BUT IT LOOKS BETTER WITH IT.
                 //  var b_inv = b.drawn_location
                 b.linear_velocity = b.linear_velocity.minus( b.center.times( dt ) );            // Apply a small centripetal force to everything.
                 b.material = this.inactive_color;       // Default color: green

                 for( let c of this.bodies )                                      // *** Collision process starts here ***
                                              // Pass the two bodies and the collision shape to check_if_colliding():
                    if( b.linear_velocity.norm() > 0 && b.check_if_colliding( c, b_inv, this.collider ) )   //If they are moving and if they are colliding then:
                    {
                       b.material = this.active_color;                          // If we get here, we collided, so turn red.
                       b.linear_velocity  = Vec.of( 0,0,0 );                    // Zero out the velocity so they don't inter-penetrate any further.
                       b.angular_velocity = 0;
                    }
            }
            */

            // ------ Aadil Collision

            num_bodies = 10;
            this.bodies.push( new Body(this.shapes.head, undefined, Vec.of(5,5,5))
                       .emplace(         this.head_transform, Vec.of( 0,1,0 ).randomized(1), Math.random()



                                         //  Mat4.translation(Vec.of( 0,0,0 ).randomized(1))
                                         //      .times( Mat4.rotation( 1, Vec.of( 0,0,0 ).randomized(1).normalized() ) ), // Rotation of up and down. Just temporary for now
                                     //Vec.of( 0,0,0 ).randomized(1), Math.random()

                                )
                                ); //NEED TO PUSH DRAKE'S WHOLE BODY HERE
            if   ( this.bodies.length > num_bodies )  this.bodies = this.bodies.splice( 0, num_bodies );                // Max of 20 bodies
            while( this.bodies.length < num_bodies )                                        // Generate moving bodies:
                //  this.bodies.push( new Body( this.random_shape(), undefined, Vec.of( 1,1,1 ) ) //Makes a shape in our current version
                  this.bodies.push( new Body( this.shapes.head , undefined, Vec.of( 1,1,1 ) ) //Makes a shape in our current version
                             .emplace(         Mat4.translation( Vec.of( 0,0,0 ).randomized(1) ) //Radius of how far the ball could possibly go. Made it = 1, so it is small
                             .times( Mat4.rotation( 1, Vec.of( 0,0,0 ).randomized(1).normalized() ) ), // Rotation of up and down. Just temporary for now
                                     Vec.of( 0,0,0 ).randomized(1), Math.random()
                                     )
                                     );

                                      // Sometimes we delete some so they can re-generate as new ones:
          //  this.bodies = this.bodies.filter( b => ( Math.random() > .01 ) || b.linear_velocity.norm() > 1 ); //This is so that we don't get stuck. Won't use in our version.

            for( let b of this.bodies )
             {
                 var b_inv = Mat4.inverse( b.drawn_location );           // Cache this quantity to save time. //NOT SURE WHAT THE PURPOSE OF THSIS IS BUT IT LOOKS BETTER WITH IT.
                 //  var b_inv = b.drawn_location
                 b.linear_velocity = b.linear_velocity.minus( b.center.times( dt ) );            // Apply a small centripetal force to everything.
                 b.material = this.inactive_color;       // Default color: green

                 for( let c of this.bodies )                                      // *** Collision process starts here ***
                                              // Pass the two bodies and the collision shape to check_if_colliding():
                    if( b.linear_velocity.norm() > 0 && b.check_if_colliding( c, b_inv, this.collider ) )   //If they are moving and if they are colliding then:
                    {
                       b.material = this.active_color;                          // If we get here, we collided, so turn red.
                       b.linear_velocity  = Vec.of( 0,0,0 );                    // Zero out the velocity so they don't inter-penetrate any further.
                       b.angular_velocity = 0;
                    }
            }

            // ------ Aadil Collision end
      }

      //Aadil Part addition ending



  }
