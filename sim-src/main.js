
//BSInclude JDH.js

//BSInclude frame.js

//BSInclude textInput.js

//BSInclude valueInput.js


//BSInclude xyPlot.js




//BSInclude simulation.js





//My code (main.js)




//// creating the environment
env = new environment();
env.pop_setup();
env.stop = 50;
env.run();
/////////////////////////////


//console.log(env.env_data);




//// setting up jdh
testDrawing = new JDHDrawing( "testDraw" );
bg = new Frame( 0, 0, 1, 1 );
bg.setCombinedPaint( rgb( 120, 150, 150 ) );
testDrawing.add( bg );
////////////////////////////////////////////



//// input fields from template
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
text3 = new Text( 100, 245, "ValueInput:" );
testDrawing.add( text3 );
input2 = new ValueInput( 100, 250, 200, 30 );
//input2.setPrecision( 5 );
testDrawing.add( input2 ); 
///////////////////////////////////////////////






//// plot stuff  ////////////////////////////////////////////////////////////////////
newPlot = new XYPlot( 0.5, 0.1, .4, .8 );

//newPlot.setSoftXLimits( true );
//newPlot.setSoftYLimits( true );


var xs = [];
for (var i  = 0; i < env.stop+1; i++){
    xs.push( i );
}

newPlot.setXLimits( 0.0, env.stop +1 );
newPlot.setYLimits( 0.0, 1000.0 );

console.log("xs: ", xs );

var i = 0;
for (const environment_data in env.env_data){
    console.log("environment data: ", environment_data);
    console.log("env.env_data[environment_data]: ", env.env_data[environment_data]);
    newPlot.addPoints( xs, env.env_data[environment_data]);
    //newPlot.addPoints( [0,1,2,3,4,5,6,7,8,9,10], [5,5,4,4,3,3,2,2,1,1,0]);
    i++;
    if (i>0){
        break;
    }
}


testDrawing.add( newPlot );

///////////////////////////////////////////////////////////////////////////////////////



resize();