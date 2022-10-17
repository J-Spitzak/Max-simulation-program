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
//BSInclude browser.js
//BSInclude browserItem.js
//BSInclude scrollArea.js
//BSInclude boxButton.js\

//  Create an area for the browser.
testDrawing = new JDHDrawing( "testDraw" );
browserArea = new Component( 0, 0, 250, 1 );
testDrawing.add( browserArea );
//browserArea = new ScrollArea( 0, 0, 250, 1 );
browserArea.setClip( true );
// browserArea.setCombinedFontPaint( rgb( 0, 0, 0 ) );
// browserArea.setBackground( new FillRectangle( 0, 0, 1, 1, null ) );
// browserArea.setBackgroundPaint( "#777777" );
// browserArea.setForeground( new Rectangle( 1, 1, -1, -1, null ) );
//  Set the font to something reasonable.
browserArea.setFontSize( 14 );
//  Add a browser that fills the area.
browserTree = new Browser( 0, 0, 1, 1 );
browserArea.add( browserTree );
//  This is a "top level" item.
theTop = new BrowserItem( 0, 0, 1, 24, "top" );
theTop.addBrowser();
browserTree.add( theTop );
//  Add ten items to the top level.
items = [];
for ( var i = 0; i < 10; ++i ) {
    items[i] = new BrowserItem( 0, 0, 1, 24, ( "Item " + i ) );
    theTop.addBrowserItem( items[i] );
}
//  Make the 3rd item another list of five items.
items[2].addBrowser();
for ( var i = 0; i < 5; ++i )
    items[2].addBrowserItem( new BrowserItem( 0, 0, 1, 24, ( "Subitem " + i ) ) );
//  Make the 5th item open an area for controls - 100 pixels high.
items[4].addControlArea( 100 );
//  Add something to it - a button in this case.
button = new BoxButton( 25, 25, 200, 40, "Button" );
items[4].addControl( button );
//  Another top level item.
browserTree.add( new BrowserItem( 0, 0, 1, 24, "another" ) );

resize();