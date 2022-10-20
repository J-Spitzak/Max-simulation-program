//==============================================================================
//
//  A very basic test program.  To build:
//  
//    ../bs/bs.py -i ../JDH -p browserTest.js > js/browserTest.js
//    
//  It should then run from browserTest.html.
//  
//==============================================================================
//BSInclude JDH.js
//BSInclude frame.js
//BSInclude textInput.js
//BSInclude valueInput.js
//BSInclude browser.js
//BSInclude browserItem.js
//BSInclude scrollArea.js
//BSInclude boxButton.js

//  Create an area for the browser.
testDrawing = new JDHDrawing( "testDraw" );
browserArea = new Component( 0, 0, 250, 1 );
testDrawing.add( browserArea );
//browserArea = new ScrollArea( 0, 0, 250, 1 );
browserArea.setClip( true );

bg = new Frame( 0, 0, 1, 1 );

bg.setCombinedPaint( rgb( 150, 150, 150 ) );

testDrawing.add( bg );



/*
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

*/

text3 = new Text( 100, 245, "Worms:" );
testDrawing.add( text3 );

input2 = new ValueInput( 100, 250, 200, 30 );
testDrawing.add( input2 );

text3 = new Text( 100, 345, "Crows:" );
testDrawing.add( text3 );

input2 = new ValueInput( 100, 350, 200, 30 );
testDrawing.add( input2 );





resize();