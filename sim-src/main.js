
//BSInclude JDH.js

//BSInclude frame.js

//BSInclude textInput.js

//BSInclude valueInput.js




//BSInclude helper_functions.js


//BSInclude population.js


//BSInclude environment.js


//My code


testDrawing = new JDHDrawing( "testDraw" );
bg = new Frame( 0, 0, 1, 1 );
bg.setCombinedPaint( rgb( 150, 150, 150 ) );
testDrawing.add( bg );
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

resize();