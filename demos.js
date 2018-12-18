window.Obj_File_Demo = window.classes.Obj_File_Demo =
class Obj_File_Demo extends Scene_Component     // An example that loads a single 3D model from an OBJ file.  Detailed model files can be
  {                                             // used in place of simpler primitive-based shapes to add complexity to a scene.  Simpler
                                                // primitives in your scene can just be thought of as placeholders until you find a model
                                                // file that fits well.  This demo shows the car model twice, with one car showing
    constructor( context, control_box )         // off the Fake_Bump_Map effect while the other has a regular texture and Phong lighting.
      { super(   context, control_box );
        context.globals.graphics_state.    camera_transform = Mat4.translation([ 0,0,-5 ]);
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, context.width/context.height, .1, 1000 );

        var shapes = { "car": new Shape_From_File( "/assets/Car.obj" ) };             // Load the model file.
        this.submit_shapes( context, shapes );

        this.stars = context.get_instance( Phong_Shader )  .material( Color.of( .5,.5,.5,1 ),       // Non bump mapped:
          { ambient: .3, diffusivity: .5, specularity: .5, texture: context.get_instance( "/assets/human_man.mtl" ) } );
        this.bumps = context.get_instance( Fake_Bump_Map ).material( Color.of( .5,.5,.5,1 ),        // Bump mapped:
          { ambient: .3, diffusivity: .5, specularity: .5, texture: context.get_instance( "/assets/human_man.mtl" ) } );
      }
    display( graphics_state )
      { const t = graphics_state.animation_time;
        graphics_state.lights = [ new Light( Mat4.rotation( t/300, Vec.of(1, 0, 0) ).times( Vec.of( 3,  2,  10, 1 ) ),
                                             Color.of( 1, .7, .7, 1 ), 100000 ) ];        // A spinning light to show off the bump map.

        //for( let i of [ -1, 1 ] )
        { const model_transform = Mat4.rotation( t/2000, Vec.of( 0, 2, 1 ) )              // Spin the 3D model shapes as well.
                          .times( Mat4.translation([ 2, 0, 0 ]) )
                          .times( Mat4.rotation( t/1500, Vec.of( -1, 2, 0 ) ) )
                          .times( Mat4.rotation( -Math.PI/2, Vec.of( 1, 0, 0 ) ) );
          this.shapes.car.draw( graphics_state, model_transform, this.bumps );   // Draw the shapes.
        }
      }
  show_explanation( document_element )
    { document_element.innerHTML += "<p>This demo loads an external 3D model file of a car.  It uses a condensed version of the \"webgl-obj-loader.js\" "
                                 +  "open source library, though this version is not guaranteed to be complete.  It is contained in the class \"Shape_From_File\". "
                                 +  "</p><p>One of these cars is lit with bump mapping.  Can you tell which one?</p>";
    }
  }
