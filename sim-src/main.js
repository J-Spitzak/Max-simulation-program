
//BSInclude JDH.js

//BSInclude frame.js

//BSInclude button.js

//BSInclude boxButton.js

//BSInclude textInput.js

//BSInclude valueInput.js


//BSInclude xyPlot.js




//BSInclude simulation.js





//My code (main.js)








//// setting up jdh  ///////////////////////
testDrawing = new JDHDrawing( "testDraw" );
bg = new Frame( 0, 0, 1, 1 );
bg.setCombinedPaint( rgb( 120, 150, 150 ) );
testDrawing.add( bg );
////////////////////////////////////////////

newPlot = new XYPlot( 0.5, 0.1, .4, .8 );


function run(stop){

    stop = stop.getValue();

    //// creating the environment
    env = new environment();
    env.pop_setup();
    env.stop = stop;
    env.run();
    /////////////////////////////


    //// plot stuff  ////////////////////////////////////////////////////////////////////


    var xs = [];
    for (var i  = 0; i < env.stop+1; i++){
        xs.push( i );
    }

    newPlot.setXLimits( 0.0, env.stop +1 );
    newPlot.setYLimits( 0.0, 3200.0 );

    var i = 0;
    for (const environment_data in env.env_data){
        newPlot.addPoints( xs, env.env_data[environment_data]);
        i++;
        if (i>0){
            //break;
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////


}



//// input fields   /////////////////////////////////////

text3 = new Text( 75, 145, "stop point:" );
testDrawing.add( text3 );

input2 = new ValueInput( 75, 150, 200, 30 );
//input2.setPrecision( 5 );
testDrawing.add( input2 ); 


runButton = new BoxButton( 350, 150, 200, 40, "Run!!!" );
runButton.setCallback( run, input2 );
runButton.setHoverPaint( rgb( 255, 0, 0 ) );

testDrawing.add( runButton );
testDrawing.add( newPlot );
/////////////////////////////////////////////////////////



resize();