
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
        console.log("environment data: ", environment_data);
        console.log("env.env_data[environment_data]: ", env.env_data[environment_data]);
        newPlot.addPoints( xs, env.env_data[environment_data]);
        i++;
        if (i>0){
            //break;
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////


}



//// input fields from template   ////////////////////////
text1 = new Text( 100, 95, "TextInput:" );
testDrawing.add( text1 );
input1 = new TextInput( 100, 100, 200, 30 );
text2 = new Text( 400, 95, "TextOutput:" );
testDrawing.add( text2 );
output1 = new TextOutput( 400, 100, 200, 30 );
output1.setText( "" );
testDrawing.add( output1 );

function input1CB() {
    output1.setText( input1.getText() );
}

input1.setCallback( input1CB );
testDrawing.add( input1 );
text3 = new Text( 100, 245, "stop point:" );
testDrawing.add( text3 );
input2 = new ValueInput( 100, 250, 200, 30 );
//input2.setPrecision( 5 );
testDrawing.add( input2 ); 


runButton = new BoxButton( 250, 350, 200, 40, "Run!!!" );
runButton.setCallback( run, 50 );
runButton.setHoverPaint( rgb( 255, 0, 0 ) );
testDrawing.add( runButton );
testDrawing.add( newPlot );
/////////////////////////////////////////////////////////



resize();