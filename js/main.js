

function BaseSharedMemory() {
	if ( window.sharedJDHItems === undefined )
		window.sharedJDHItems = {};
	return window.sharedJDHItems;
};

function SharedMemory( newName ) {
    var shared = BaseSharedMemory();
    if ( shared[newName] === undefined )
        shared[newName] = {};
    return shared[newName];
};

function Component( x, y, w, h, label ) {
    this.x = x;
    this.y = y;
    this.w = w;
	this.h = h;
    this.label = label;     //  this can be a string or a component (or null)
	this.name = label;      //  The "name" matches the label initially, although you can change it.  
	this.next = null;       //  the next in a linked list
	this.previous = null;   //  the previous in a linked list
	this.children = null;   //  the first component in a linked list of child components
	this.lastChild = null;  //  the last child added in the child list
	this.parent = null;     //  the parent component of this component
	this.background = null; //  components to draw before this component
	this.foreground = null; //  components to draw after this component
	this.noLabel = false;   //  shut off labeling - if you want to use the label internally somehow
	this.xOffset = 0.0;
	this.yOffset = 0.0;
	this.drawX = x;
	this.drawY = y;
	this.drawW = w;
	this.drawH = h;
	this.trueDrawX = x;
	this.trueDrawY = y;
	this.trueDrawW = w;
	this.trueDrawH = h;
	this.trueScale = 1.0;
	this.strokePaint = null;
	this.fillPaint = null;
	this.lineWidth = null;
	this.lineCap = null;
	this.lineJoin = null;
	this.miterLimit = null;
	this.lineDash = null;
	this.lineDashOffset = null;
	this.font = null;
	this.fontSize = null;
	this.fontFamily = null;
	this.fontVariant = null;
	this.fontItalic = null;
	this.fontBold = null;
	this.fontOutline = null;
	this.alpha = null;
	this.fontFillPaint = null;
	this.fontStrokePaint = null;
	this.inactiveFontFillPaint = null;
	this.inactiveFontStrokePaint = null;
	this.hasShadow = false;
	this.shadowColor = null;
	this.shadowBlur = null;
	this.shadowX = null;
	this.shadowY = null;
	this.clipRegion = false;
	this.visible = true;
	this.callback = null;
	this.callbackComponent = null;
	this.callbackDelay = null;
	this.callbackTimeoutID = null;
	this.callbackWhen = 0;
	this.callbackArg = null;
	this.handleEvents = true;
	this.inactiveEvents = false;
	this.drawing = null;
	this.removeChildren = [];
	this.removeDescendents = [];
	this.tooltipCallback = null;
	this.defaultTooltip = null;
	this.tooltipDefined = false;
	this.physicalChange = false;
	this.scale = null;
	this.scaleX = null;
	this.scaleY = null;
	this.whRatio = null;
	this.whAlign = null;
	this.whFill = false;
	this.restrictiveRedraw = false;
	this.restrictiveImage = null;
	this.restLeft = 0;
	this.restRight = 0;
	this.restTop = 0;
	this.restBottom = 0;
	this.redrawAnyway = true;
	this.saveDrawX = null;
	this.saveDrawY = null;
	this.saveDrawW = null;
	this.saveDrawH = null;
	this.drawNegative = false;
	this._sizeOK = true;
	this.overlayList = null;
	this.localOverlay = null;
	this.diagnostic = null;
	this.widthFractional = false;
	this.heightFractional = false;
};

var ON_ENTER           = 1;
var ON_CHANGE          = 2;
var ON_MOUSE_WHEEL     = 4;
var ON_ARROW_KEY       = 8;
var ON_CLICK           = 16;
var ON_LEAVE           = 32;
var ON_PUSH            = 64;
var ON_RELEASE         = 128;
var ON_FOCUS           = 256;
var ON_LOSTFOCUS       = 512;

Component.prototype.setCallbackWhen = function( newVal ) {
	this.callbackWhen = newVal; 
};

Component.prototype.addCallbackWhen = function( newVal ) {
	this.callbackWhen = newVal | this.callbackWhen;
};

Component.prototype.setCallback = function( newCallback, callbackComponent, callbackDelay, callbackArg ) {
	this.callback = newCallback;
	if ( callbackComponent === undefined )
		this.callbackComponent = null;
	else
		this.callbackComponent = callbackComponent;
	if ( callbackDelay === undefined )
		this.callbackDelay = null;
	else
		this.callbackDelay = callbackDelay;
	if ( callbackArg === undefined )
		this.callbackArg = null;
	else
		this.callbackArg = callbackArg;
};

Component.prototype.doCallback = function( when, event ) {
	if ( when !== undefined && when !== null && this.callbackWhen !== 0 ) {
		if ( !( when & this.callbackWhen ) )
			return false;
	}
	if ( this.callbackDelay ) {
		clearTimeout( this.callbackTimeoutID );
		var callbackStuff = {};
		callbackStuff.this = this;
		callbackStuff.when = when;
		callbackStuff.event = event;
		callbackStuff.arg = this.callbackArg;
		this.callbackTimeoutID = setTimeout( this.triggerCallback, this.callbackDelay, callbackStuff );
	}
	else {
		if ( this.callback !== null ) {
			var callbackStuff = {};
			callbackStuff.this = this;
			callbackStuff.when = when;
			callbackStuff.event = event;
			callbackStuff.arg = this.callbackArg;
			this.callback( this.callbackComponent, callbackStuff );
		}
	}
	return true;
};

Component.prototype.triggerCallback = function( callbackStuff ) {
	var theThis = callbackStuff.this;
	if ( theThis === undefined || theThis === null )
		theThis = this;
	if ( theThis.callback !== undefined && theThis.callback !== null )
		theThis.callback( theThis.callbackComponent, callbackStuff );
};

Component.prototype.setDrawing = function( newDrawing ) {
	this.drawing = newDrawing;
	var child = this.children;
	while( child !== null ) {
		child.setDrawing( newDrawing );
		child = child.next;
	}
} 

Component.prototype.doRedraw = function() {
	this.redrawAnyway = true;
	if ( this.drawing !== null )
		this.drawing.doRedraw();
};

Component.prototype.redrawNow = function() {
	if ( this.drawing !== null )
		this.drawing.redraw();
}

Component.prototype.setShadow = function( on, color, blur, xoff, yoff ) {
	this.hasShadow = on;
	if ( color !== undefined )
		this.shadowColor = color;
	else if ( this.shadowColor === null )
		this.shadowColor = rgb( 0, 0, 0 );
	if ( blur !== undefined )
		this.shadowBlur = blur;
	else if ( this.shadowBlur === null )
		this.shadowBlur = 20;
	if ( xoff !== undefined )
		this.shadowX = xoff;
	else if ( this.shadowX === null )
		this.shadowX = 5;
	if ( yoff !== undefined )
		this.shadowY = yoff;
	else if ( this.shadowY === null )
		this.shadowY = 5;
};

Component.prototype.setScale = function( newVal, ptx, pty ) {
	var doZoom = false;
	if ( ptx !== undefined && pty !== undefined ) {
		doZoom = true;
		var xPos = ( ptx - this.trueDrawX ) / this.trueScale;
		var yPos = ( pty - this.trueDrawY ) / this.trueScale;
	}

	this.scale = newVal;
	this.resizeToo();

	if ( doZoom ) {
		var nxPos = ( ptx - this.trueDrawX ) / this.trueScale;
		var nyPos = ( pty - this.trueDrawY ) / this.trueScale;
		this.setXYOffset( this.xOffset + nxPos - xPos, this.yOffset + nyPos - yPos );
	}
}

Component.prototype.setXYScale = function( newX, newY ) {
	this.scaleX = newX;
	this.scaleY = newY;
}

Component.prototype.getScale = function() {
	if ( this.scale === null )
		return 1.0;
	return this.scale;
}

Component.prototype.setNoLabel = function( newVal ) {
	this.noLabel = newVal;
};

Component.prototype.setLabel = function( newVal ) {
	this.label = newVal;
};

Component.prototype.setText = function( newVal ) {
	this.label = newVal;
};

Component.prototype.getText = function() {
	return this.label;
};

Component.prototype.setName = function( newVal ) {
	this.name = newVal;
};

Component.prototype.getName = function() {
	return this.name;
};

Component.prototype.findChildByName = function( val ) {
	if ( this.children === null )
		return null;
	var child = this.children;
	while( child.next !== null ) {
		if ( val === child.getName() )
			return child;
		child = child.next;
	}
	return null;
};

Component.prototype.setBackground = function( newcomp ) {
	this.background = newcomp;
	if ( this.background !== null )
		this.background.parent = this;
};

Component.prototype.getBackground = function() {
	return this.background;
};

Component.prototype.setForeground = function( newcomp ) {
	this.foreground = newcomp;
	if ( this.foreground !== null )
		this.foreground.parent = this;
};

Component.prototype.getForeground = function() {
	return this.foreground;
};

Component.prototype.addFirst = function( newChild ) {
	if ( this.children === null )
		this.lastChild = newChild;
	newChild.next = this.children;
	this.children = newChild;
	newChild.parent = this;
	newChild.setDrawing( this.drawing );
	this.setPhysicalChange( true );
}

Component.prototype.addTo = function( newChild ) {
	if ( this.children === null )
		this.children = newChild;
	else
		this.lastChild.next = newChild;
	newChild.parent = this;
	newChild.previous = this.lastChild;
	this.lastChild = newChild;
	newChild.setDrawing( this.drawing );
	this.setPhysicalChange( true );  // see this function to find out what this is about!
};

Component.prototype.add = function( newChild ) {
	this.addTo( newChild );
};

Component.prototype.addOverlay = function( newChild ) {
	if ( this.localOverlay !== null ) {
		console.info( "adding to overlay " + this.localOverlay.name );
		this.localOverlay.add( newChild );
	}
	else
		addOverlay( newChild );
	var testComponent = this;
	var listed = false;
	while ( testComponent !== null && testComponent !== undefined && !listed ) {
		if ( testComponent.overlayList !== null ) {
			testComponent.overlayList.push( newChild );
			listed = true;
		}
		testComponent = testComponent.getParent();
	}
}

Component.prototype.setLocalOverlay = function( newOverlay ) {
	this.localOverlay = newOverlay;
}

Component.prototype.keepOverlayList = function() {
	this.overlayList = [];
}

Component.prototype.setOverlayList = function( newList ) {
	this.overlayList = newList;
}

Component.prototype.getOverlayList = function() {
	return this.overlayList;
}

Component.prototype.removeFrom = function( oldChild ) {
	if ( this.children === null )
		return;
	var child = this.children;
	while ( child !== null ) {
		if ( child === oldChild ) { //  found it!
			if ( child === this.children )
				this.children = child.next;
			else if ( child.previous !== null )
				child.previous.next = child.next;
			if ( child === this.lastChild )
				this.lastChild = child.previous;
			else if ( child.next !== null )
				child.next.previous = child.previous;
			child.next = null;
			child.previous = null;
			child.parent = null;
			this.setPhysicalChange( true );
			return;
		}
		child = child.next;
	}
};

Component.prototype.remove = function( oldChild ) {
	this.removeFrom( oldChild );
};

Component.prototype.moveChildEarlier = function( oldChild ) {
	if ( this.children === null )
		return false;  // no children at all
	var child = this.children;
	while ( child !== null ) {
		if ( child === oldChild ) { //  found it!
			if ( child.previous === null )
				return false;  // can't move it earlier
		 	var saveNext = child.next;
			var savePrevious = child.previous;
			child.next = child.previous;
			child.previous = child.previous.previous;
			child.next.previous = child;
			if ( child.previous !== null )
				child.previous.next  = child;
			if ( child === this.lastChild ) {
				this.lastChild = child.next;
				this.lastChild.next = null;
			}
			else {
				savePrevious.next = saveNext;
				saveNext.previous = savePrevious;
			}
			if ( savePrevious === this.children ) {
				this.children = child; 
			}
		 	this.setPhysicalChange( true );
		 	return true;
		}
		child = child.next;
	}
	return false;  // specified child not found
}

Component.prototype.moveChildLater = function( oldChild ) {
	if ( this.children === null )
		return false;  // no children at all
	var child = this.children;
	while ( child !== null ) {
		if ( child === oldChild ) { //  found it!
			if ( child === this.lastChild || child.next === null )
				return false;
			var saveNext = child.next;
			var savePrevious = child.previous;
			child.next = child.next.next;
			child.previous = saveNext;
			saveNext.previous = savePrevious;
			saveNext.next = child;
			savePrevious.next = saveNext;
			if ( child === this.children )
				this.children = child.next;
			if ( child.next === null )
				this.lastChild = child;
			else
				child.next.previous = child;
			var tryC = this.children;
			this.setPhysicalChange( true );
			return true;
		}
		child = child.next;
	}
	return false;  // specified child not found
}

Component.prototype.removeChild = function( oldChild ) {
	this.removeChildren.push( oldChild );
	this.informParentOfRemoval();
	this.setPhysicalChange( true );
}

Component.prototype.informParentOfRemoval = function() {
	if ( this.parent !== null ) {
		this.parent.removeDescendents.push( this );
		this.parent.informParentOfRemoval();
	}
}

Component.prototype.isChild = function( testChild ) {
	if ( this.children === null )
		return false;
	var child = this.children;
	while ( child !== null ) {
		if ( child === testChild )
			return true;
		child = child.next;
	}
	return false;
};

Component.prototype.getParent = function() {
	return this.parent;
};

Component.prototype.setPhysicalChange = function( newVal ) {
	this.physicalChange = newVal;
	if ( this.physicalChange && this.parent !== null )
		this.parent.setPhysicalChange( true );
}

Component.prototype.clear = function() {
	if ( this.children !== null ) {
		var child = this.children;
		while ( child !== null ) {
			child.previous = null;
			child.parent = null;
			tchild = child.next;
			child.next = null;
			child = tchild;
		}
	}
	this.children = null;
	this.lastChild = null;
	this.setPhysicalChange( true );
};

Component.prototype.draw = function( ins ) {
};

Component.prototype.predraw = function( ins ) {
};

Component.prototype.postdraw = function( ins ) {
};

Component.prototype.preSettings = function( ins ) {
};

Component.prototype.postSettings = function( ins ) {
};

Component.prototype.testRemovals = function() {
	if ( this.removeChildren.length > 0 ) {
		for ( var i = 0; i < this.removeChildren.length; ++i )
			this.remove( this.removeChildren[i] );
		this.removeChildren = [];
	}
	if ( this.removeDescendents.length > 0 ) {
		for ( var i = 0; i < this.removeDescendents.length; ++i )
			this.removeDescendents[i].testRemovals();
		this.removeDescendents = [];
	}
}

Component.prototype.setRestrictiveRedraw = function( newVal, left, right, top, bottom ) {
	this.restrictiveRedraw = newVal;
	if ( left !== undefined && left !== null )
		this.restLeft = left;
	else
		this.restLeft = 0;
	if ( right !== undefined && right !== null )
		this.restRight = right;
	else
		this.restRight = 0;
	if ( top !== undefined && top !== null )
		this.restTop = top;
	else
		this.restTop = 0;
	if ( bottom !== undefined && bottom !== null )
		this.restBottom = bottom;
	else
		this.restBottom = 0;
}

Component.prototype.setDrawNegative = function( newVal ) {
	this.drawNegative = newVal;
}

Component.prototype.redraw = function( ins ) {
	if ( !this._sizeOK ) return;
	if ( this.restrictiveRedraw && this.restrictiveImage !== null ) {
		if ( this.redrawAnyway === false ) {
			ins.ctx.drawImage( this.restrictiveImage, this.drawX - this.restLeft, this.drawY - this.restTop );
			return;
		}
		this.redrawAnyway = false;
	}
	if ( this.visible ) {
		this.preSettings( ins );
		this.drawSettings( ins );
		this.predraw( ins );
		if ( this.background !== null ) {
			this.background.redraw( ins );
		}
		this.draw( ins );
		if ( this.children !== null )
			this.drawChildren( ins );
		if ( this.foreground !== null ) {
			this.foreground.redraw( ins );
		}
		this.postdraw( ins );
		this.returnSettings( ins );
		this.postSettings( ins );
	}
	if ( this.restrictiveRedraw ) {
		var imageData = ins.ctx.getImageData( this.drawX - this.restLeft, this.drawY - this.restTop, 
			this.drawW + this.restLeft + this.restRight, this.drawH + this.restTop + this.restBottom );
		if ( browserType() === SAFARI ) {  // Safari doesn't have createImageBitmap() for some reason.
			Promise.all([this.dataToImage( imageData ), this]).then( function( stuff ) {
				stuff[1].restrictiveImage = stuff[0];
			}, function( hey ) {
				console.info( "dataToImage() blew up in the ImageRectangle class -- " + hey + "\n" );
			} );
		}
		else {
			Promise.all([createImageBitmap( imageData, 0, 0, imageData.width, imageData.height ), this]).then( function( stuff ) {
				stuff[1].restrictiveImage = stuff[0];
			}, function( hey ) {
				console.info( "createImageBitmap blew up in the ImageRectangle class -- " + hey + "\n" );
			} );
		}
	}
};

Component.prototype.dataToImage = function( imagedata ) {
	return new Promise ( function( resolve, reject ) {
		var canvas = document.createElement( 'canvas' );
		var ctx = canvas.getContext( '2d' );
		canvas.width = imagedata.width;
		canvas.height = imagedata.height;
		ctx.putImageData( imagedata, 0, 0 );
		var img = new Image();
		img.onload = function() {
			resolve( img );
		}
		img.onError = function() {
			reject( img );
		}
		img.src = canvas.toDataURL();
	} );
}

Component.prototype.restrictiveImageCB = function() {
	console.info( "set up!" );
}

Component.prototype.drawChildren = function( ins ) {
	var child = this.children;
	while ( child !== null ) {
		child.redraw( ins );
		child = child.next;
	}
}

Component.prototype.setVisible = function( newVal ) {
	this.visible = newVal;
	if ( this.alwaysVisible !== undefined && this.alwaysVisible === true )
		this.visible = true;
};
Component.prototype.getVisible = function() {
	return this.visible;
};

Component.prototype.forceVisible = function( newVal ) {
	this.alwaysVisible = newVal;
}

Component.prototype.setStrokePaint = function( newPaint ) {
	this.strokePaint = newPaint;
};
Component.prototype.setFillPaint = function( newPaint ) {
	this.fillPaint = newPaint;
};
Component.prototype.setFontStrokePaint = function( newPaint ) {
	this.fontStrokePaint = newPaint;
};
Component.prototype.setFontFillPaint = function( newPaint ) {
	this.fontFillPaint = newPaint;
};
Component.prototype.setInactiveFontStrokePaint = function( newPaint ) {
	this.inactiveFontStrokePaint = newPaint;
};
Component.prototype.setInactiveFontFillPaint = function( newPaint ) {
	this.inactiveFontFillPaint = newPaint;
};
Component.prototype.setForegroundPaint = function( newPaint ) {
	this.strokePaint = newPaint;
};
Component.prototype.setBackgroundPaint = function( newPaint ) {
	this.fillPaint = newPaint;
};
Component.prototype.getStrokePaint = function() {
	return this.strokePaint;
};
Component.prototype.getFillPaint = function() {
	return this.fillPaint;
};
Component.prototype.getFontStrokePaint = function() {
	return this.fontStrokePaint;
};
Component.prototype.getFontFillPaint = function() {
	return this.fontFillPaint;
};
Component.prototype.getInactiveFontStrokePaint = function() {
	return this.inactiveFontStrokePaint;
};
Component.prototype.getInactiveFontFillPaint = function() {
	return this.inactiveFontFillPaint;
};
Component.prototype.getForegroundPaint = function() {
	return this.strokePaint;
};
Component.prototype.getBackgroundPaint = function() {
	return this.fillPaint;
};
Component.prototype.setCombinedPaint = function( newPaint ) {
	if ( newPaint === undefined )
		return;
	if ( newPaint === null ) {
		this.fillPaint = null;
		this.strokePaint = null;
		return;
	}
	if ( newPaint[1] === undefined ) {
		this.fillPaint = newPaint;
		this.strokePaint = newPaint;
		return;
	}
	if ( newPaint[0] !== null )
		this.fillPaint = newPaint[0];
	if ( newPaint[1] !== null )
		this.strokePaint = newPaint[1];
}
Component.prototype.setCombinedFontPaint = function( newPaint ) {
	if ( newPaint === undefined )
		return;
	if ( newPaint === null ) {
		this.fontFillPaint = null;
		this.fontStrokePaint = null;
		return;
	}
	if ( newPaint[1] === undefined ) {
		this.fontFillPaint = newPaint;
		this.fontStrokePaint = newPaint;
		return;
	}
	if ( newPaint[0] !== null )
		this.fontFillPaint = newPaint[0];
	if ( newPaint[1] !== null )
		this.fontStrokePaint = newPaint[1];
}
Component.prototype.setCombinedInactiveFontPaint = function( newPaint ) {
	if ( newPaint === undefined )
		return;
	if ( newPaint === null ) {
		this.inactiveFontFillPaint = null;
		this.inactiveFontStrokePaint = null;
		return;
	}
	if ( newPaint[1] === undefined ) {
		this.inactiveFontFillPaint = newPaint;
		this.inactiveFontStrokePaint = newPaint;
		return;
	}
	if ( newPaint[0] !== null )
		this.inactiveFontFillPaint = newPaint[0];
	if ( newPaint[1] !== null )
		this.inactiveFontStrokePaint = newPaint[1];
}
Component.prototype.getCombinedPaint = function() {
	return [this.fillPaint, this.strokePaint];
}
Component.prototype.getCombinedFontPaint = function() {
	return [this.fontFillPaint, this.fontStrokePaint];
}
Component.prototype.getCombinedInactiveFontPaint = function() {
	return [this.inactiveFontFillPaint, this.inactiveFontStrokePaint];
}

Component.prototype.setAlpha = function( newVal ) {
	this.alpha = newVal;
}
Component.prototype.getAlpha = function() {
	return this.alpha;
}

Component.prototype.setLineWidth = function( newwidth ) {
	this.lineWidth = newwidth;
};
Component.prototype.getLineWidth = function() {
	return this.lineWidth;
};

Component.prototype.setLineCap = function( newcap ) {
	this.lineCap = newcap;
};
Component.prototype.getLineCap = function() {
	return this.linecap;
};

Component.prototype.setLineJoin = function( newjoin ) {
	this.lineJoin = newjoin;
};
Component.prototype.getLineJoin = function() {
	return this.lineJoin;
};

Component.prototype.setMiterLimit = function( newlimit ) {
	this.miterLimit = newlimit;
};
Component.prototype.getMiterLimit = function() {
	return this.miterLimit;
};

Component.prototype.setLineDash = function( newdash ) {
	this.lineDash = newdash;
};
Component.prototype.getLineDash = function() {
	return this.lineDash;
};

Component.prototype.setLineDashOffset = function( newoffset ) {
	this.lineDashOffset;
};
Component.prototype.getLineDashOffset = function() {
	return this.lineDashOffset;
};

Component.prototype.setThisFont = function() {
	this.font = new Font( this.fontFamily, this.fontSize, this.fontBold, this.fontItalic, this.fontOutline, this.fontVariant );
};
Component.prototype.setFontFamily = function( newVal ) {
	this.fontFamily = newVal;
	this.setThisFont();
};
Component.prototype.getFontFamily = function() {
	return this.fontFamily;
};
Component.prototype.setFontSize = function( newVal ) {
	this.fontSize = newVal;
	this.setThisFont();
};
Component.prototype.getFontSize = function() {
	return this.fontSize;
};
Component.prototype.setFontOutline = function( newVal ) {
	this.fontOutline = newVal;
	this.setThisFont();
};
Component.prototype.getFontOutline = function() {
	return this.fontOutline;
};
Component.prototype.setFontVariant = function( newVal ) {
	this.fontVariant = newVal;
	this.setThisFont();
};
Component.prototype.getFontVariant = function() {
	return this.fontVariant;
};
Component.prototype.setFontItalic = function( newVal ) {
	this.fontItalic = newVal;
	this.setThisFont();
};
Component.prototype.getFontItalic = function() {
	return this.fontItalic;
};
Component.prototype.setFontBold = function( newVal ) {
	this.fontBold = newVal;
	this.setThisFont();
};
Component.prototype.getFontBold = function() {
	return this.fontBold;
};
Component.prototype.setFont = function( newFont ) {
	this.font = newFont;
	if ( newFont === null ) {
		this.fontFamily = null;
		this.fontSize = null;
		this.fontItalic = null;
		this.fontBold = null;
		this.fontOutline = null;
		this.fontVariant = null;
	}
	else {
		this.fontFamily = newFont.family;
		this.fontSize = newFont.size;
		this.fontItalic = newFont.italic;
		this.fontBold = newFont.bold;
		this.fontOutline = newFont.outline;
		this.fontVariant = newFont.variant;
	}
};
Component.prototype.getFont = function() {
	return this.font;
};

Component.prototype.setClip = function( newVal ) {
	this.clipRegion = newVal;
};

Component.prototype.getClip = function() {
	return this.clipRegion;
};

Component.prototype.drawSettings = function( ins ) {
	ins.x = this.drawX;
	ins.y = this.drawY;
	ins.w = this.drawW;
	ins.h = this.drawH;
	if ( this.scale !== null )
		ins.scale = ins.scale * this.scale;
	var parentX = 0;
	var parentY = 0;
	if ( this.parent !== null ) {
		parentX = this.parent.trueDrawX;
		parentY = this.parent.trueDrawY;
	}
	var remX = this.trueDrawX - parentX
	this.drawX = ( this.trueDrawX - remX ) / ins.scale + remX;
	var remY = this.trueDrawY - parentY
	this.drawY = ( this.trueDrawY - remY ) / ins.scale + remY;
	this.drawX = this.drawX + this.xOffset;
	this.drawY = this.drawY + this.yOffset;
	this.useDrawX = parentX / this.trueScale + remX / this.trueScale;
	this.useDrawY = parentY / this.trueScale + remY / this.trueScale;
	if ( this.strokePaint !== null || this.fillPaint !== null ||
			this.lineWidth !== null || this.lineCap !== null ||
			this.lineJoin !== null || this.lineDash !== null ||
			this.lineDashOffset !== null || this.miterLimit !== null ||
			( this.clipRegion !== null && this.clipRegion !== false ) ||
			this.fontFamily !== null || this.fontSize !== null || 
			this.fontVariant !== null || this.fontItalic !== null || 
			this.fontBold !== null || this.fontOutline !== null ||
			this.fontFillPaint !== null || this.fontStrokePaint !== null ||
			this.inactiveFontFillPaint !== null || this.inactiveFontStrokePaint !== null ||
			this.hasShadow === true || this.deactivated || this.alpha !== null || this.scale !== null ||
			this.scaleX !== null || this.scaleY !== null ) {
		this.settingsChange = true;
		ins.ctx.save();
	}
	else
		this.settingsChange = false;
	if ( this.strokePaint !== null )
		ins.ctx.strokeStyle = translatePaint( ins, this.strokePaint );
	if ( this.fillPaint !== null )
		ins.ctx.fillStyle = translatePaint( ins, this.fillPaint );
	if ( this.lineCap !== null )
		ins.ctx.lineCap = lineCapString[ this.lineCap ];
	if ( this.lineJoin !== null )
		ins.ctx.lineJoin = lineJoinString[ this.lineJoin ];
	if ( this.miterLimit !== null )
		ins.ctx.miterLimit = this.miterLimit;
	if ( this.lineDash !== null )
		ins.ctx.lineDash = this.lineDash;
	if ( this.lineWidth !== null )
		ins.ctx.lineWidth = this.lineWidth;
	if ( this.lineDashOffset !== null )
		ins.ctx.lineDashOffset = this.lineDashOffset;
	if ( this.fontFamily !== null || this.fontSize !== null || this.fontVariant !== null || 
		 this.fontItalic !== null || this.fontBold !== null || this.fontOutline !== null ||
		 this.fontFillPaint !== null || this.fontStrokePaint !== null ||
		 this.inactiveFontFillPaint !== null || this.inactiveFontStrokePaint !== null ) {
		if ( this.fontFamily !== null ) {
			this.restoreFontFamily = ins.fontFamily;
			ins.fontFamily = this.fontFamily;
		}
		if ( this.fontSize !== null ) {
			this.restoreFontSize = ins.fontSize;
			ins.fontSize = this.fontSize;
		}
		if ( this.fontVariant !== null ) {
			this.restoreFontVariant = ins.fontVariant;
			ins.fontVariant = this.fontVariant;
		}
		if ( this.fontItalic !== null ) {
			this.restoreFontItalic = ins.fontItalic;
			if ( this.fontItalic === true )
				ins.fontItalic = "italic";
			else if ( this.fontItalic === false )
				ins.fontItalic = "normal";
			else
				ins.fontItalic = this.fontItalic;
		}
		if ( this.fontBold !== null ) {
			this.restoreFontBold = ins.fontBold;
			if ( this.fontBold === true )
				ins.fontBold = "bold";
			else if ( this.fontBold === false )
				ins.fontBold = "normal";
			else if ( this.fontBold === "light" )
				ins.fontBold = "lighter";
			else
				ins.fontBold = this.fontBold;
		}
		if ( this.fontOutline !== null ) {
			this.restoreFontOutline = ins.fontOutline;
			ins.fontOutline = this.fontOutline;
		}
		if ( this.fontFillPaint !== null ) {
			this.restoreFontFillPaint = ins.fontFillPaint;
			ins.fontFillPaint = this.fontFillPaint;
		}
		if ( this.fontStrokePaint !== null ) {
			this.restoreFontStrokePaint = ins.fontStrokePaint;
			ins.fontStrokePaint = this.fontStrokePaint;
		}
		if ( this.inactiveFontFillPaint !== null ) {
			this.restoreInactiveFontFillPaint = ins.inactiveFontFillPaint;
			ins.inactiveFontFillPaint = this.inactiveFontFillPaint;
		}
		if ( this.inactiveFontStrokePaint !== null ) {
			this.restoreInactiveFontStrokePaint = ins.inactiveFontStrokePaint;
			ins.inactiveFontStrokePaint = this.inactiveFontStrokePaint;
		}
		var fontStr = ins.fontSize + "px " + ins.fontFamily;
		if ( ins.fontBold !== null )
			fontStr = ins.fontBold + " " + fontStr;
		if ( ins.fontVariant !== null )
			fontStr = ins.fontVariant + " " + fontStr;
		if ( ins.fontItalic !== null )
			fontStr = ins.fontItalic + " " + fontStr;
		ins.ctx.font = fontStr;
	}
	if ( this.scale !== null ) {
		ins.ctx.scale( this.scale, this.scale );
	}
	if ( this.scaleX !== null || this.scaleY !== null )
		ins.ctx.scale( this.scaleX, this.scaleY );
	if ( this.clipRegion === true ) {
		ins.ctx.beginPath();
		ins.ctx.moveTo( this.useDrawX, this.useDrawY );
		ins.ctx.lineTo( this.useDrawX, this.useDrawY + this.drawH );
		ins.ctx.lineTo( this.useDrawX + this.drawW, this.useDrawY + this.drawH );
		ins.ctx.lineTo( this.useDrawX + this.drawW, this.useDrawY );
		ins.ctx.closePath();
		ins.ctx.clip();
	}
	if ( this.hasShadow ) {
		ins.ctx.shadowColor = translatePaint( ins, this.shadowColor );
		ins.ctx.shadowBlur = this.shadowBlur;
		ins.ctx.shadowOffsetX = this.shadowX;
		ins.ctx.shadowOffsetY = this.shadowY;
	}
	if ( this.deactivated ) {
		ins.deactivated = true;
	}
	if ( this.alpha !== null )
		ins.ctx.globalAlpha = ins.ctx.globalAlpha * this.alpha;
};

Component.prototype.returnSettings = function( ins ) {
	if ( this.settingsChange )
		ins.ctx.restore();
	if ( this.scale !== null )
		ins.scale = ins.scale / this.scale;
	if ( this.fontFamily !== null )
		ins.fontFamily = this.restoreFontFamily;
	if ( this.fontSize !== null )
		ins.fontSize = this.restoreFontSize;
	if ( this.fontVariant !== null )
		ins.fontVariant = this.restoreFontVariant;
	if ( this.fontItalic !== null )
		ins.fontItalic = this.restoreFontItalic;
	if ( this.fontBold !== null )
		ins.fontBold = this.restoreFontBold;
	if ( this.fontOutline !== null )
		ins.fontOutline = this.restoreFontOutline;
	if ( this.fontFillPaint !== null )
		ins.fontFillPaint = this.restoreFontFillPaint;
	if ( this.fontStrokePaint !== null )
		ins.fontStrokePaint = this.restoreFontStrokePaint;
	if ( this.inactiveFontFillPaint !== null )
		ins.inactiveFontFillPaint = this.restoreInactiveFontFillPaint;
	if ( this.inactiveFontStrokePaint !== null )
		ins.inactiveFontStrokePaint = this.restoreInactiveFontStrokePaint;
	if ( this.deactivated ) {
		ins.deactivated = false;
	}
};

Component.prototype.setInactiveText = function( newVal ) {
	this.deactivated = newVal;
}

Component.prototype.setInactiveEvents = function( newVal ) {
	this.inactiveEvents = newVal;
}

Component.prototype.setInactive = function( newVal ) {
	this.setInactiveText( newVal );
	this.setInactiveEvents( newVal );
}

Component.prototype.drawText = function( ins, text, x, y, complex = false ) {
	if ( complex ) {
	}
	else {
		ins.ctx.save();
		if ( this.fontOutline === FONT_BOTH || this.fontOutline === "both" ) {
			if ( ins.deactivated ) {
				if ( ins.inactiveFontFillPaint !== null )
					ins.ctx.fillStyle = translatePaint( ins, ins.inactiveFontFillPaint );
				if ( ins.inactiveFontStrokePaint !== null )
					ins.ctx.strokeStyle = translatePaint( ins, ins.inactiveFontStrokePaint );
			}
			else {
				if ( ins.fontFillPaint !== null )
					ins.ctx.fillStyle = translatePaint( ins, ins.fontFillPaint );
				if ( ins.fontStrokePaint !== null )
					ins.ctx.strokeStyle = translatePaint( ins, ins.fontStrokePaint );
			}
			ins.ctx.fillText( text, x, y );
			ins.ctx.strokeText( text, x, y );
		}
		else if ( this.fontOutline === true || this.fontOutline === FONT_OUTLINE || 
			this.fontOutline === "stroke" || this.fontOutline === "outline" ) {
			if ( ins.deactivated ) {
				if ( ins.inactiveFontStrokePaint !== null )
					ins.ctx.strokeStyle = translatePaint( ins, ins.inactiveFontStrokePaint );
			}
			else {
				if ( ins.fontStrokePaint !== null )
					ins.ctx.strokeStyle = translatePaint( ins, ins.fontStrokePaint );
			}
			ins.ctx.strokeText( text, x, y );
		}
		else {
			if ( ins.deactivated ) {
				if ( ins.inactiveFontFillPaint !== null ) {
					ins.ctx.fillStyle = translatePaint( ins, ins.inactiveFontFillPaint );
				}
			}
			else {
				if ( ins.fontFillPaint !== null )
					ins.ctx.fillStyle = translatePaint( ins, ins.fontFillPaint );
			}
			ins.ctx.fillText( text, x, y );	
		}
		ins.ctx.restore();
	}
};

Component.prototype.measureText = function( ins, text, font ) {
	var ret = 0;
	if ( font !== undefined && font !== null ) {
		if ( font.family !== null )
			var fontStr = font.family;
		else
			var fontStr = ins.fontFamily;
		if ( font.size !== null )
			fontStr = font.size + "px " + fontStr;
		else
			fontStr = ins.fontSize + "px " + fontStr;
		if ( font.bold === true )
			fontStr = "bold " + fontStr;
		else if ( font.bold === false )
			fontStr = "normal " + fontStr;
		else if ( font.bold === "light" )
			fontStr = "lighter " + fontStr;
		else if ( font.bold !== null )
			fontStr = font.bold + " " + fontStr;
		if ( font.variant !== null )
			fontStr = font.variant + " " + fontStr;
		if ( font.italic === true )
			fontStr = "italic " + fontStr;
		else if ( font.italic === false )
			fontStr = "normal " + fontStr;
		else if ( font.italic !== null )
			fontStr = font.italic + fontStr;
		ins.ctx.save();
		ins.ctx.font = fontStr;
	}
	ret = ins.ctx.measureText( text );
	if ( font !== undefined && font !== null ) {
		ins.ctx.restore();
	}
	return ret;
};

Component.prototype.resize = function( x, y, w, h ) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
	this.resizeToo();
};

Component.prototype.setXY = function( x, y ) {
	this.x = x;
	this.y = y;
	this.resizeToo();
};

Component.prototype.setXYOffset = function( ox, oy ) {
	this.xOffset = ox;
	this.yOffset = oy;
	this.resizeToo();
}

Component.prototype.setWH = function( w, h ) {
	this.w = w;
	this.h = h;
	this.resizeToo();
};

Component.prototype.setWHRatio = function( nw, nh, align, fill ) {
	if ( nw === undefined || nh === undefined || nw === null || nw === false )
		this.whRatio = null;
	else
		this.whRatio = nw / nh;
	if ( align === undefined )
		this.whAlign = null;
	else
		this.whAlign = align;
	if ( fill === undefined )
		this.whFill = false;
	else
		this.whFill = fill;
}

Component.prototype.setWidthFractional = function( newVal ) {
	this.widthFractional = newVal;
}

Component.prototype.setHeightFractional = function( newVal ) {
	this.heightFractional = newVal;
}

Component.prototype.resizeToo = function() {
    this.drawX = this.xPixel( this.x );
	this.drawY = this.yPixel( this.y );
	var px = 0;
	var py = 0;
	var pw = 100;
	var ph = 100;
	if ( this.parent !== null ) {
		px = this.parent.drawX;
		py = this.parent.drawY;
		pw = this.parent.drawW;
		ph = this.parent.drawH;
	}
	var tw = this.w;
	var th = this.h;
	if ( ( Math.abs( tw ) > 1 || tw === -1 ) && (!this.widthFractional ) ) //  absolute
		this.drawW = tw;
	else
		this.drawW = tw * pw;
	if ( this.drawW < 0 ) //  measure from the right edge
	    this.drawW = pw - this.drawX + px + this.drawW;
	if ( ( Math.abs( th ) > 1 || th === -1 ) && (!this.heightFractional ) ) //  absolute
		this.drawH = th;
	else
		this.drawH = th * ph;
	if ( this.drawH < 0 )
		this.drawH = ph - this.drawY + py + this.drawH;
	if ( this.whRatio !== null ) {
		var currentRatio = this.drawW / this.drawH;
		if ( ( currentRatio > this.whRatio && !this.whFill ) || ( currentRatio < this.whRatio && this.whFill ) ) { //  restricted by H
			var setDrawW = this.drawW;
			this.drawW = this.whRatio * this.drawH;
			switch ( this.whAlign ) {
				case ALIGN_ABOVE_MIDDLE:
				case ALIGN_BELOW_MIDDLE:
				case ALIGN_CENTERED_MIDDLE:
					this.drawX = this.drawX + ( setDrawW - this.drawW ) / 2.0;
					break;
				case ALIGN_ABOVE_RIGHT:
				case ALIGN_BELOW_RIGHT:
				case ALIGN_CENTERED_RIGHT:
					this.drawX = this.drawX + setDrawW - this.drawW;
					break;
			}
		}
		else if ( ( currentRatio < this.whRatio && !this.whFill ) || ( currentRatio > this.whRatio && this.whFill ) ) { //  restricted by W
			var setDrawH = this.drawH;
			this.drawH = this.drawW / this.whRatio;
			switch ( this.whAlign ) {
				case ALIGN_CENTERED_LEFT:
				case ALIGN_CENTERED_RIGHT:
				case ALIGN_CENTERED_MIDDLE:
					this.drawY = this.drawY + ( setDrawH - this.drawH ) / 2.0;
					break;
				case ALIGN_BELOW_LEFT:
				case ALIGN_BELOW_RIGHT:
				case ALIGN_BELOW_MIDDLE:
					this.drawY = this.drawY + setDrawH - this.drawH;
					break;
			}
		}
	}
	var parentX = 0;
	var parentY = 0;
	if ( this.parent !== null ) {
		this.trueScale = this.parent.trueScale;
		parentX = this.parent.trueDrawX;
		parentY = this.parent.trueDrawY;
	}
	else
		this.trueScale = 1.0;
	if ( this.scale !== null )
		this.trueScale = this.trueScale * this.scale;
	var remX = this.drawX - parentX
	this.drawX = ( this.drawX - remX ) / this.trueScale + remX;
	var remY = this.drawY - parentY
	this.drawY = ( this.drawY - remY ) / this.trueScale + remY;
	this.drawX = this.drawX + this.xOffset;
	this.drawY = this.drawY + this.yOffset;
	this.trueDrawX = this.drawX * this.trueScale;
	this.trueDrawY = this.drawY * this.trueScale;
	this.trueDrawW = this.drawW * this.trueScale;
	this.trueDrawH = this.drawH * this.trueScale;
	this.drawX = this.trueDrawX;
	this.drawY = this.trueDrawY;
	this.resizeHandler();
	this.resizeChildren();
	if ( this.restrictiveRedraw ) {
		if ( this.drawX !== this.saveDrawX )
			this.redrawAnyway = true;
		else if ( this.drawY !== this.saveDrawY )
			this.redrawAnyway = true;
		else if ( this.drawW !== this.saveDrawW )
			this.redrawAnyway = true;
		else if ( this.drawH !== this.saveDrawH )
			this.redrawAnyway = true;
		this.saveDrawX = this.drawX;
		this.saveDrawY = this.drawY;
		this.saveDrawW = this.drawW;
		this.saveDrawH = this.drawH;
	}
	this._sizeOK = true;
	if ( !this.drawNegative && ( this.drawW < 0 || this.drawH < 0 ) )
		this._sizeOK = false;
};

Component.prototype.xPixel = function( inst ) {
	var ret = 0;
	if ( typeof( inst ) === "number" ) {
		if ( this.parent === null )
			var ret = inst;
		else
			var ret = this.parent.xPosition( inst );
	}
	else {
		if ( typeof( inst[0] ) === "string" ) {
			ret = this.variable( inst[0] );
			if ( ret !== null )
				return ret;
			var componentPtr = null;
			if ( this.drawing.topLevel !== null )
				componentPtr = this.drawing.topLevel.findChildByName( inst[0] );
			if ( componentPtr === null )
				return this.xPixel( inst.slice( 1 ) );
			else
				return componentPtr.xPixel( inst.slice( 1 ) );
		}
		if ( inst.length === 1 ) {
			if ( typeof( inst[0] === "object" ) )
				return this.xPosition( this.xPixel( inst[0] ) );
			else
				return this.xPosition( inst[0] );
		}
		ret = this.instruction( inst );
		if ( ret === null )
			ret = 0;
	}
	return ret;
};

Component.prototype.yPixel = function( inst ) {
	if ( typeof( inst ) === "number" ) {
		if ( this.parent === null )
			var ret = inst;
		else
			var ret = this.parent.yPosition( inst );
	}
	else {
		if ( typeof( inst[0] ) === "string" ) {
			ret = this.variable( inst[0] );
			if ( ret !== null )
				return ret;
			var componentPtr = null;
			if ( this.drawing.topLevel !== null )
				componentPtr = this.drawing.topLevel.findChildByName( inst[0] );
			if ( componentPtr === null )
				return this.yPixel( inst.slice( 1 ) );
			else
				return componentPtr.yPixel( inst.slice( 1 ) );
		}
		if ( inst.length === 1 ) {
			if ( typeof( inst[0] === "object" ) )
				return this.yPosition( this.yPixel( inst[0] ) );
			else
				return this.yPosition( inst[0] );
		}
		ret = this.instruction( inst );
		if ( ret === null )
			ret = 0;
	}
	return ret;
};

Component.prototype.variable = function( varName ) {
	if ( varName === "width" )
		return this.drawW;
	if ( varName === "height" )
		return this.drawH;
	if ( varName === "x" )
		return this.drawX;
	if ( varName === "y" )
		return this.drawY;
	return null;
};

Component.prototype.instruction = function( inst ) {
	switch ( inst[0] ) {
		case X_PROJECTION:
			return this.xProjection( inst.slice( 1 ) );
			break;
		case Y_PROJECTION:
			return this.yProjection( inst.slice( 1 ) );
			break;
		case ADD:
			return this.instValue( inst[1] ) + this.instValue( inst[2] );
			break;
		case SUB:
			console.info( this.instValue( inst[1] ) + "   " + this.instValue( inst[2] ) );
			return this.instValue( inst[1] ) - this.instValue( inst[2] );
			break;
		case MUL:
			return this.instValue( inst[1] ) * this.instValue( inst[2] );
			break;
		case DIV:
			return this.instValue( inst[1] ) / this.instValue( inst[2] );
			break;
	}
	return null;
};

Component.prototype.instValue = function( inst ) {
	if ( typeof( inst ) === "number" )
		return inst;
	if ( typeof( inst ) === "string" ) {
		ret = this.variable( inst );
		if ( ret !== null )
			return ret;
		else
			return 0;
	}
	if ( inst.length === 1 )
		return this.instValue( inst[0] );
	var componentPtr = null;
	if ( this.drawing.topLevel !== null )
		componentPtr = this.drawing.topLevel.findChildByName( inst[0] );
	if ( componentPtr === null )
		ret = this.instruction( inst );
	else
		ret = componentPtr.instValue( inst.slice( 1 ) );
	if ( ret === null )
		ret = 0;
	return ret;
};

Component.prototype.xPosition = function( val, notRelative ) {
	if ( Math.abs( val ) < 1 && !notRelative )  //  x location is relative
		var ret = val * this.drawW;  //  temporary...this is the offset!
	else
		var ret = val;
	if ( ret < 0 && !notRelative )
		ret = this.trueDrawX + this.drawW + ret;
	else
		ret = this.trueDrawX + ret;
	return ret;
};

Component.prototype.yPosition = function( val, notRelative ) {
	if ( Math.abs( val ) < 1 && !notRelative )  //  y location is relative
		var ret = val * this.drawH;  //  temporary...this is the offset!
	else
		var ret = val;
	if ( ret < 0 && !notRelative )
		ret = this.trueDrawY + this.drawH + ret;
	else
		ret = this.trueDrawY + ret;
	return ret;
};

Component.prototype.xProjection = function( params ) {
	if ( typeof( params ) === "number" )
		return this.drawX + params;
	return this.drawX + params[0];
};

Component.prototype.yProjection = function( params ) {
	if ( typeof( params ) === "number" )
		return this.drawY + params;
	return this.drawY + params[0];
};

Component.prototype.resizeHandler = function() {
};

Component.prototype.resizeChildren = function() {
	if ( this.background !== null )
		this.background.resizeToo();
	if ( this.children !== null ) {
		var child = this.children;
		while ( child !== null ) {
			child.resizeToo();
			child = child.next;
		}
	}
	if ( this.foreground !== null )
		this.foreground.resizeToo();
};

Component.prototype.handle = function( event ) {
	return false;
};

Component.prototype.prehandle = function( event ) {
	return false;
}

Component.prototype.tryHandle = function( event ) {
	var ret = false;
	if ( this.visible && this.handleEvents && !this.inactiveEvents ) {
		if ( !this.rejectEvent( event ) ) {
			ret = this.prehandle( event );
			if ( ret )
				setLastEventComponent( this );
			if ( !ret && this.foreground !== null )
				ret = this.foreground.tryHandle( event );
			if ( !ret && this.children !== null ) {
				var child = this.lastChild;
				while ( !ret && child !== null ) {
					ret = child.tryHandle( event );
					child = child.previous;
				}
			}
			if ( !ret ) {
				ret = this.handle( event );
				if ( ret )
					setLastEventComponent( this );
			}
			if ( !ret && this.background !== null )
				ret = this.background.tryHandle( event );
			if ( this.tooltipDefined && !ret && event.type === MOUSE_HOVER )
				ret = this.executeTooltip( event );
		}
	}
	return ret;
};

tooltipVisible = null;

Component.prototype.executeTooltip = function( event ) {
	if ( this.eventInside( event ) ) {
		if ( this.defaultTooltip !== null ) {
			if ( tooltipVisible !== null )
				tooltipVisible.setVisible( false );
			this.defaultTooltip.show( event.e.clientX, event.e.clientY );
			tooltipVisible = this.defaultTooltip;
			doOverlayRedraw();
			return true;
		}
	}
	return false;
};

Component.prototype.setTooltip = function( tooltip, comp ) {
	if ( tooltip === null ) {
		this.tooltipDefined = false;
		return;
	}
	if ( typeof( tooltip ) === "string" ) {
		this.tooltipCallback = null;
		this.defaultTooltip = new Tooltip( tooltip );
		this.tooltipDefined = true;
	}
	else {
		this.tooltipCallback = tooltip;
		this.defaultTooltip = null;
		if ( comp === undefined )
			comp = null;
		this.tooltipDefined = true;
	}
};

Component.prototype.setHandleEvents = function( newVal ) {
	this.handleEvents = newVal;
	if ( this.alwaysHandleEvents !== undefined && this.alwaysHandleEvents === true )
		this.handleEvents = true;
};

Component.prototype.forceHandleEvents = function( newVal ) {
	this.alwaysHandleEvents = newVal;
}

Component.prototype.rejectEvent = function( event ) {
	return false;
};

Component.prototype.eventInside = function( event ) {
	if ( event.px < this.trueDrawX )
		return false;
	if ( event.px > this.trueDrawX + this.trueDrawW )
		return false;
	if ( event.py < this.trueDrawY )
		return false;
	if ( event.py > this.trueDrawY + this.trueDrawH )
		return false;
	return true;
};

Component.prototype.isInside = function( x, y ) {
	if ( x < this.trueDrawX )
		return false;
	if ( y < this.trueDrawY )
		return false;
	if ( x > this.trueDrawX + this.trueDrawW )
		return false;
	if ( y > this.trueDrawY + this.trueDrawH )
		return false;
	return true;
};

Component.prototype.xInside = function( x ) {
	if ( x < this.trueDrawX )
		return false;
	if ( x > this.trueDrawX + this.trueDrawW )
		return false;
	return true;
}

Component.prototype.yInside = function( y ) {
	if ( y < this.trueDrawY )
		return false;
	if ( y > this.trueDrawY + this.trueDrawH )
		return false;
	return true;
}

Component.prototype.getX = function() {
	return this.x;
};
Component.prototype.getY = function() {
	return this.y;
};
Component.prototype.getW = function() {
	return this.w;
};
Component.prototype.getH = function() {
	return this.h;
};

Component.prototype.getDrawnX = function() {
	if ( this.parent !== null )
		return this.drawX - this.parent.drawX;
	else
		return this.drawX;
}

Component.prototype.getDrawnY = function() {
	if ( this.parent !== null )
		return this.drawY - this.parent.drawY;
	else
		return this.drawY;
}

Component.prototype.getDrawnW = function() {
	return this.drawW;
}
Component.prototype.getDrawnH = function() {
	return this.drawH;
}


var ALIGN_ABOVE_RIGHT             = 0;  //  Default
var ALIGN_ABOVE_LEFT              = 1;
var ALIGN_CENTERED_LEFT           = 2;
var ALIGN_BELOW_RIGHT             = 3;
var ALIGN_CENTERED_RIGHT          = 4;
var ALIGN_BELOW_LEFT              = 5;
var ALIGN_BELOW_MIDDLE            = 6;
var ALIGN_ABOVE_MIDDLE            = 7;
var ALIGN_CENTERED_MIDDLE         = 8;

function Text( x, y, textString ) {
	Component.call( this, x, y, 1, 1, textString );
	this.xOffset = 0;
	this.yOffset = 0;
	this.textX = x;
	this.textY = y;
	this.alignment = ALIGN_ABOVE_RIGHT;
	this.heightFactor = 0.8;
	this.textBox = null;  //  This tracks the x, y, w and h of the last drawn text.
};

Text.prototype = Object.create( Component.prototype );
Text.prototype.constructor = Text;

Text.prototype.setOffsets = function( newx, newy ) {
	this.xOffset = newx;
	this.yOffset = newy;
};

Text.prototype.setAlignment = function( newVal ) {
	this.alignment = newVal;
};

Text.prototype.getAlignment = function() {
	return this.alignment;
};

Text.prototype.setHeightFactor = function( newVal ) {
	this.heightFactor = newVal;
};

Text.prototype.setXY = function( nx, ny ) {
	this.textX = nx;
	this.textY = ny;
	Component.prototype.setXY.call( this, nx, ny );
}

Text.prototype.draw = function( ins ) {
	var text = this.measureText( ins, this.label );
	var x = this.drawX;
	var y = this.drawY;
	if ( this.parent !== null ) {
		x = this.parent.trueDrawX / ins.scale + this.textX;
		y = this.parent.trueDrawY / ins.scale + this.textY;
	}
	switch ( this.alignment ) {
		case ALIGN_ABOVE_RIGHT:
			break;
		case ALIGN_ABOVE_LEFT:
			x = x - text.width;
			break;
		case ALIGN_CENTERED_LEFT:
			x = x - text.width;
			y = y + this.heightFactor * ins.fontSize / 2.0;
			break;
		case ALIGN_BELOW_RIGHT:
			y = y + this.heightFactor * ins.fontSize;
			break;
		case ALIGN_CENTERED_RIGHT:
			y = y + this.heightFactor * ins.fontSize / 2.0;
			break;
		case ALIGN_BELOW_LEFT:
			x = x - text.width;
			y = y + this.heightFactor * ins.fontSize;
			break;
		case ALIGN_BELOW_MIDDLE:
			x = x - text.width / 2.0;
			y = y + this.heightFactor * ins.fontSize;
			break;
		case ALIGN_ABOVE_MIDDLE:
			x = x - text.width / 2.0;
			break;
		case ALIGN_CENTERED_MIDDLE:
			x = x - text.width / 2.0;
			y = y + this.heightFactor * ins.fontSize / 2.0;
			break;
	}
	if ( this.xOffset < 1 )
		x = x + this.xOffset * text.width;
	else
		x = x + this.xOffset;
	if ( Math.abs( this.yOffset ) < 1 )
		y = y + this.yOffset * ins.fontSize;
	else
		y = y + this.yOffset;
	this.drawText( ins, this.label, x, y );
	this.textBox = [ x, y, text.width, ins.fontSize ];
};

function Rectangle( x, y, w, h, label ) {
	Component.call( this, x, y, w, h, label );
};

Rectangle.prototype = Object.create( Component.prototype );
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.draw = function( ins ) {
    ins.ctx.strokeRect( this.drawX, this.drawY, this.drawW, this.drawH );
};

function FillRectangle( x, y, w, h, label ) {
	Component.call( this, x, y, w, h, label );
};

FillRectangle.prototype = Object.create( Component.prototype );
FillRectangle.prototype.constructor = FillRectangle;

FillRectangle.prototype.draw = function( ins ) {
	ins.ctx.fillRect( this.drawX, this.drawY, this.drawW, this.drawH );
};

function Arc( x, y, w, h, label ) {
	Component.call( this, x, y, w, h, label );
	this.angle1 = 0;
	this.angle2 = 2 * Math.PI;
}

Arc.prototype = Object.create( Component.prototype );
Arc.prototype.constructor = Arc;

Arc.prototype.setAngles = function( ang1, ang2 ) {
	this.angle1 = ang1;
	this.angle2 = ang2;
}

Arc.prototype.draw = function( ins ) {
	var centerX = this.drawX + this.drawW / 2.0;
	var centerY = this.drawY + this.drawH / 2.0;
	if ( this.drawW > this.drawH )
		var rad = this.drawH / 2.0;
	else
		var rad = this.drawW / 2.0;
	ins.ctx.beginPath();
	ins.ctx.arc( centerX, centerY, rad, this.angle1, this.angle2 );
	ins.ctx.stroke();
};

function FillArc( x, y, w, h, label ) {
	Component.call( this, x, y, w, h, label );
	this.angle1 = 0;
	this.angle2 = 2 * Math.PI;
}

FillArc.prototype = Object.create( Component.prototype );
FillArc.prototype.constructor = FillArc;

FillArc.prototype.setAngles = function( ang1, ang2 ) {
	this.angle1 = ang1;
	this.angle2 = ang2;
}

FillArc.prototype.draw = function( ins ) {
	var centerX = this.drawX + this.drawW / 2.0;
	var centerY = this.drawY + this.drawH / 2.0;
	if ( this.drawW > this.drawH )
		var rad = this.drawH / 2.0;
	else
		var rad = this.drawW / 2.0;
	ins.ctx.beginPath();
	ins.ctx.arc( centerX, centerY, rad, this.angle1, this.angle2 );
	ins.ctx.fill();
};

function FillSector( x, y, w, h, label ) {
	Component.call( this, x, y, w, h, label );
	this.angle1 = 0;
	this.angle2 = 2 * Math.PI;
}

FillSector.prototype = Object.create( Component.prototype );
FillSector.prototype.constructor = FillSector;

FillSector.prototype.setAngles = function( ang1, ang2 ) {
	this.angle1 = ang1;
	this.angle2 = ang2;
}

FillSector.prototype.draw = function( ins ) {
	var centerX = this.drawX + this.drawW / 2.0;
	var centerY = this.drawY + this.drawH / 2.0;
	if ( this.drawW > this.drawH )
		var rad = this.drawH / 2.0;
	else
		var rad = this.drawW / 2.0;
	ins.ctx.beginPath();
	ins.ctx.moveTo( centerX, centerY );
	ins.ctx.arc( centerX, centerY, rad, this.angle1, this.angle2 );
	ins.ctx.fill();
};

function ImageRectangle( x, y, w, h, label ) {
	Component.call( this, x, y, w, h, label );
	this.dimg = null;
	this.inputData = null;
	this.data = null;
	this.fill = true;
	this.smooth = true;
	this.screenCtx = null;
	this.sourceWidth = null;
	this.sourceHeight = null;
	this.savedImage = null;
	this.xScale = 1.0;
	this.yScale = 1.0;
	this.xOffset = 0.0;
	this.yOffset = 0.0;
};

ImageRectangle.prototype = Object.create( Component.prototype );
ImageRectangle.prototype.constructor = ImageRectangle;

ImageRectangle.prototype.source = function( sourceFile ) {
	this.dimg = new Image();
	this.dimg.src = sourceFile;
};

ImageRectangle.prototype.sourceToImage = function( sourceFile ) {
	return new Promise ( function( resolve, reject ) {
		var img = new Image();
		img.onload = function() {
			resolve( img );
		}
		img.onError = function() {
			reject( img );
		}
		img.src = sourceFile;
	} );
};

ImageRectangle.prototype.dataToImage = function( imagedata ) {
	return new Promise ( function( resolve, reject ) {
		var canvas = document.createElement( 'canvas' );
		var ctx = canvas.getContext( '2d' );
		canvas.width = imagedata.width;
		canvas.height = imagedata.height;
		ctx.putImageData( imagedata, 0, 0 );
		var img = new Image();
		img.onload = function() {
			resolve( img );
		}
		img.onError = function() {
			reject( img );
		}
		img.src = canvas.toDataURL();
	} );
}

ImageRectangle.prototype.setFromSource = function( sourceFile ) {
	Promise.all([this.sourceToImage( sourceFile ), this]).then( function( stuff ) {
		stuff[1].dimg = stuff[0];
		stuff[1].doCallback();
	}, function( hey ) {
		console.info( "sourceToImage() blew up in the ImageRectangle class -- " + hey + "\n" );
	} );
};

ImageRectangle.prototype.grabOffScreenImage = function( image ) {
	return new Promise ( function( resolve, reject ) {
		var canvas = document.createElement( 'canvas' );
		var ctx = canvas.getContext( '2d' );
		canvas.width = image.width;
		canvas.height = image.height;
		ctx.drawImage( image, 0, 0 );
		var img = new Image();
		img.crossOrigin = "Anonymous";
		img.onload = function() {
			resolve( img );
		}
		img.onError = function() {
			reject( img );
		}
		img.src = canvas.toDataURL();
	} );
}

ImageRectangle.prototype.getFromSource = function( sourceFile ) {
	if ( sourceFile === undefined || sourceFile === null )
		return this.savedImage;
	Promise.all([this.sourceToImage( sourceFile ), this]).then( function( stuff ) {
		var canvas = document.getElementById( "hidden" );//createElement( 'canvas' );
		var ctx = canvas.getContext( '2d' );
		canvas.width = stuff[0].width;
		canvas.height = stuff[0].height;
		canvas.style.visibility = "hidden";
		ctx.drawImage( stuff[0], 0, 0 );
		stuff[1].savedImage = ctx.getImageData( 0, 0, stuff[0].width, stuff[0].height );
		console.info( "drew " + stuff[0].width + ", " + stuff[0].height + "\n" );
		stuff[1].doCallback();
	}, function( hey ) {
		console.info( "sourceToImage() blew up in the ImageRectangle class -- " + hey + "\n" );
	} );
};

ImageRectangle.prototype.getWidth = function() {
	if ( this.dimg === null )
		return 0;
	else
		return this.dimg.width;
}

ImageRectangle.prototype.getHeight = function() {
	if ( this.dimg === null )
		return 0;
	else
		return this.dimg.height;
}

ImageRectangle.prototype.setFromData = function( imageData ) {
	if ( browserType() === SAFARI ) {  // Safari doesn't have createImageBitmap() for some reason.
		Promise.all([this.dataToImage( imageData ), this]).then( function( stuff ) {
			stuff[1].dimg = stuff[0];
			stuff[1].doCallback();
		}, function( hey ) {
			console.info( "dataToImage() blew up in the ImageRectangle class -- " + hey + "\n" );
		} );
	}
	else {
		Promise.all([createImageBitmap( imageData, 0, 0, imageData.width, imageData.height ), this]).then( function( stuff ) {
			stuff[1].dimg = stuff[0];
			stuff[1].doCallback();
		}, function( hey ) {
			console.info( "createImageBitmap blew up in the ImageRectangle class -- " + hey + "\n" );
		} );
	}
}

ImageRectangle.prototype.getNewData = function( width, height ) {
	return new ImageData( new Uint8ClampedArray( 4 * width * height ), width, height );
}

ImageRectangle.prototype.getScreenData = function( x, y, w, h ) {
	if ( this.screenCtx === null )
		return this.getNewData( w, h );
	else {
		if ( x === undefined ) x = 0;
		if ( y === undefined ) y = 0;
		if ( w === undefined ) {
			w = this.getW();
		}
		if ( h === undefined ) {
			h = this.getH();
		}
		return this.screenCtx.getImageData( x, y, w, h );
	}
};

ImageRectangle.prototype.setFill = function( newFill ) {
	this.fill = newFill;
};

ImageRectangle.prototype.setSmooth = function( newVal ) {
	this.smooth = newVal;
};

ImageRectangle.prototype.setScale = function( x, y ) {
	this.xScale = x;
	if ( y === undefined || y === null )
		this.yScale = x;
	else
		this.yScale = y;
};

ImageRectangle.prototype.setOffset = function( x, y ) {
	this.xOffset = x;
	this.yOffset = y;
}

ImageRectangle.prototype.draw = function( ins ) {
	this.screenCtx = ins.ctx;
	if ( this.dimg !== null ) {
		if ( this.fill ) {
			if ( !this.smooth ) {
				ins.ctx.imageSmoothingEnabled = false;
				ins.ctx.mozImageSmoothingEnabled = false;
				ins.ctx.webkitImageSmoothingEnabled = false;
				ins.ctx.msImageSmoothingEnabled = false;
			}
			ins.ctx.drawImage( this.dimg, this.drawX + this.xOffset, this.drawY + this.yOffset, this.xScale * this.drawW, this.yScale * this.drawH );
			if ( !this.smooth ) {
				ins.ctx.imageSmoothingEnabled = true;
				ins.ctx.mozImageSmoothingEnabled = true;
				ins.ctx.webkitImageSmoothingEnabled = true;
				ins.ctx.msImageSmoothingEnabled = true;
			}
		}
		else
			ins.ctx.drawImage( this.dimg, this.drawX, this.drawY );
	}
};

function Path( x, y, w, h, label ) {
	Component.call( this, x, y, w, h, label );
	this.scaledDrawing = false;
	this.itemList = [];
	this.MOVETO                  = 0;
	this.LINETO                  = 1;
	this.ARCTO                   = 2;
	this.BEZIER_CURVE_TO         = 3;
	this.QUAD_CURVE_TO           = 4;
	this.ARC                     = 5;
};

Path.prototype = Object.create( Component.prototype );
Path.prototype.constructor = Path;

Path.prototype.setScaledDrawing = function( newVal ) {
	this.scaledDrawing = newVal;
};

Path.prototype.moveTo = function( x, y ) { return this.moveto( x, y ); };
Path.prototype.moveto = function( x, y ) {
	var thisItem = {};
	thisItem.type = this.MOVETO;
	thisItem.x = x;
	thisItem.y = y;
	this.itemList.push( thisItem );
	return thisItem;
};

Path.prototype.lineTo = function( x, y ) { return this.lineto( x, y ); };
Path.prototype.lineto = function( x, y ) {
	var thisItem = {};
	thisItem.type = this.LINETO;
	thisItem.x = x;
	thisItem.y = y;
	this.itemList.push( thisItem );
	return thisItem;
};

Path.prototype.arcTo = function( x1, y1, x2, y2, r ) { return this.arcto( x1, y1, x2, y2, r ); };
Path.prototype.arcto = function( x1, y1, x2, y2, r ) {
	var thisItem = {};
	thisItem.type = this.ARCTO;
	thisItem.x1 = x1;
	thisItem.y1 = y1;
	thisItem.x2 = x2;
	thisItem.y2 = y2;
	thisItem.r = r;
	this.itemList.push( thisItem );
	return thisItem;
};

Path.prototype.bezierTo = function( x1, y1, x2, y2, x3, y3 ) { return this.bezierto( x1, y1, x2, y2, x3, y3 ); };
Path.prototype.bezierto = function( x1, y1, x2, y2, x3, y3 ) {
	var thisItem = {};
	thisItem.type = this.BEZIER_CURVE_TO;
	thisItem.x1 = x1;
	thisItem.y1 = y1;
	thisItem.x2 = x2;
	thisItem.y2 = y2;
	thisItem.x3 = x3;
	thisItem.y3 = y3;
	this.itemList.push( thisItem );
	return thisItem;
}

Path.prototype.drawItems = function( ins ) {
	var len = this.itemList.length;
	for ( i = 0; i < len; ++i ) {
		var thisItem = this.itemList[i];
		if ( thisItem.type === this.MOVETO ) {
			if ( this.scaledDrawing ) {
				ins.ctx.moveTo( this.drawX + thisItem.x * this.drawW, this.drawY + thisItem.y * this.drawH );
			}
			else
				ins.ctx.moveTo( this.drawX + thisItem.x, this.drawY + thisItem.y );
		}
		else if ( thisItem.type === this.LINETO ) {
			if ( this.scaledDrawing ) {
				ins.ctx.lineTo( this.drawX + thisItem.x * this.drawW, this.drawY + thisItem.y * this.drawH );
			}
			else
				ins.ctx.lineTo( this.drawX + thisItem.x, this.drawY + thisItem.y );
		}
		else if ( thisItem.type === this.BEZIER_CURVE_TO ) {
			if ( this.scaledDrawing ) {
				ins.ctx.bezierCurveTo( this.drawX + thisItem.x1 * this.drawW, this.drawY + thisItem.y1 * this.drawH,
					this.drawX + thisItem.x2 * this.drawW, this.drawY + thisItem.y2 * this.drawH,
					this.drawX + thisItem.x3 * this.drawW, this.drawY + thisItem.y3 * this.drawH );
			}
			else
				ins.ctx.bezierCurveTo( this.drawX + thisItem.x1, this.drawY + thisItem.y1,
					this.drawX + thisItem.x2, this.drawY + thisItem.y2,
					this.drawX + thisItem.x3, this.drawY + thisItem.y3 );
		}
		else if ( thisItem.type === this.ARCTO ) {
			if ( this.scaledDrawing ) {
			 	ins.ctx.arcTo( this.drawX + thisItem.x1 * this.drawW, this.drawY + thisItem.y1 * this.drawH,
			 		this.drawX + thisItem.x2 * this.drawW, this.drawY + thisItem.y2 * this.drawH, thisItem.r * this.drawH );
			}
			else
				ins.ctx.arcTo( this.drawX + thisItem.x1, this.drawY + thisItem.y1, 
					this.drawX + thisItem.x2, this.drawY + thisItem.y2, thisItem.r );
		}
	}
};

function LinePath( x, y, w, h, label ) {
	Path.call( this, x, y, w, h, label );
};

LinePath.prototype = Object.create( Path.prototype );
LinePath.prototype.constructor = LinePath;

LinePath.prototype.draw = function( ins ) {
	ins.ctx.beginPath();
	this.drawItems( ins );
	ins.ctx.stroke();
};

function LoopPath( x, y, w, h, label ) {
	Path.call( this, x, y, w, h, label );
};

LoopPath.prototype = Object.create( Path.prototype );
LoopPath.prototype.constructor = LoopPath;

LoopPath.prototype.draw = function( ins ) {
	ins.ctx.beginPath();
	this.drawItems( ins );
	ins.ctx.closePath();
	ins.ctx.stroke();
};

function FillPath( x, y, w, h, label ) {
	Path.call( this, x, y, w, h, label );
};

FillPath.prototype = Object.create( Path.prototype );
FillPath.prototype.constructor = FillPath;

FillPath.prototype.draw = function( ins ) {
	ins.ctx.beginPath();
	this.drawItems( ins );
	ins.ctx.closePath();
	ins.ctx.fill();
};

function Line( x1, y1, x2, y2, label ) {
	LinePath.call( this, x1, y1, x2 - x1, y2 - y1, label );
	this.moveTo( 0, 0 );
	this.lineTo( x2 - x1, y2 - y1 );
};

Line.prototype = Object.create( LinePath.prototype );
Line.prototype.constructor = Line;

function ScaledLine( x1, y1, x2, y2, label ) {
	Line.call( this, x1, y1, x2, y2, label );
	this.setScaledDrawing( true );
};

ScaledLine.prototype = Object.create( Line.prototype );
ScaledLine.prototype.constructor = ScaledLine;


function Frame( x, y, w, h, label ) {
	Component.call( this, x, y, w, h, label );
	this.setBackground( new FillRectangle( 0, 0, 1, 1, null ) );
	this.setForeground( new Rectangle( 0, 0, 1, 1, null ) );
	this.frameLabel = null;
};

Frame.prototype = Object.create( Component.prototype );
Frame.prototype.constructor = Frame;

Frame.prototype.outlineFrame = function() {
	this.setForeground( new Rectangle( 0, 0, 1, 1, null ) );
};

Frame.prototype.noFrame = function() {
	this.setForeground( null );
};

Frame.prototype.boxFrame = function( isDown ) {
	this.illuminatedPaint = rgb( 255, 255, 255 );
	this.shadowedPaint = rgb( 100, 100, 100 );
	this.setForeground( new Component( 0, 0, 1, 1 ) );
	this.lowerRight = new LinePath( 0, 0, 1, 1 );
	this.lowerRight.setScaledDrawing( true );
	this.lowerRight.moveTo( 0, 1 );
	this.lowerRight.lineTo( 1, 1 );
	this.lowerRight.lineTo( 1, 0 );
	this.getForeground().add( this.lowerRight );
	this.upperLeft = new LinePath( 0, 0, 1, 1 );
	this.upperLeft.setScaledDrawing( true );
	this.upperLeft.moveTo( 1, 0 );
	this.upperLeft.lineTo( 0, 0 );
	this.upperLeft.lineTo( 0, 1 );
	this.getForeground().add( this.upperLeft );
	if ( isDown === undefined || !isDown ) {
		this.upperLeft.setStrokePaint( this.illuminatedPaint );
		this.lowerRight.setStrokePaint( this.shadowedPaint );
	}
	else {
		this.lowerRight.setStrokePaint( this.illuminatedPaint );
		this.upperLeft.setStrokePaint( this.shadowedPaint );
	}
};

Frame.prototype.setIlluminatedPaint = function( newPaint ) {
	this.illuminatedPaint = newPaint;
};

Frame.prototype.setShadowedPaint = function( newPaint ) {
	this.shadowedPaint = newPaint;
};

Frame.prototype.setLabel = function( newLabel ) {
	Component.prototype.setLabel.call( this, newLabel );
	if ( newLabel === undefined || newLabel === null ) {
		if ( this.frameLabel !== null ) {
			this.frameLabel.setVisible( false );
		}
	}
	else {
		if ( this.frameLabel !== null )
			this.frameLabel.setText( newLabel );
		else {
			console.info( "adding " + newLabel );
			this.frameLabel = new Text( -this.w, this.h / 2, newLabel );
			this.frameLabel.setAlignment( ALIGN_CENTERED_LEFT );
			this.add( this.frameLabel );
		}
		this.frameLabel.setVisible( true );
	}
}
function ResizeBox( x, y, w, h, label ) {
	Component.call( this, x, y, w, h, label );
	this.setForeground( new Rectangle( 0, 0, 1, 1, null ) );
	this.setCombinedPaint( rgba( 1, 0, 0, 1 ) );
	this.getForeground().setCombinedPaint( rgba( 1, 0, 0, 1 ) );
	this.getForeground().setLineWidth( 2 );
	this.doCallbackOnDrag = true;
	this.moveCapable = false;
	this.resizeCapable = true;
	this.drawCornerHints = true;
	this.drawEdgeHints = true;
	this.drawMoveHint = true;
	this.dragWidth = 5;
	this.pushInEffect = false;
	this.moveArea = null;
};

ResizeBox.prototype = Object.create( Component.prototype );
ResizeBox.prototype.constructor = ResizeBox;

ResizeBox.prototype.setDoCallbackOnDrag = function( newVal ) {
	this.doCallbackOnDrag = newVal;
};

ResizeBox.prototype.setMoveCapable = function( newVal ) {
	this.moveCapable = newVal;
};

ResizeBox.prototype.setMoveArea = function( x, y, w, h ) {
	this.remove( this.moveArea );
	if ( x === null )
		this.moveArea = null;
	else
		this.moveArea = new Component( x, y, w, h );
	this.add( this.moveArea );  //  added so the resize stuff works
}

ResizeBox.prototype.setResizeCapable = function( newVal ) {
	this.resizeCapable = newVal;
};

ResizeBox.prototype.setDragWidth = function( newVal ) {
	this.dragWidth = newVal;
};

ResizeBox.prototype.setDrawFrame = function( newVal ) {
	this.getForeground().setVisible( newVal );
};
ResizeBox.prototype.setDrawCornerHints = function( newVal ) {
	this.drawCornerHints = newVal;
};
ResizeBox.prototype.setDrawEdgeHints = function( newVal ) {
	this.drawEdgeHints = newVal;
};
ResizeBox.prototype.setDrawMoveHint = function( newVal ) {
	this.drawMoveHint = newVal;
};

ResizeBox.prototype.draw = function( ins ) {
	var dist = 4;
	if ( this.getForeground().getLineWidth() !== null )
		dist = this.getForeground().getLineWidth() + 3;
	if ( this.onNW ) {
		if ( this.drawCornerHints ) {
			ins.ctx.beginPath();
			ins.ctx.moveTo( this.drawX + 15, this.drawY - dist );
			ins.ctx.lineTo( this.drawX - dist,  this.drawY - dist );
			ins.ctx.lineTo( this.drawX - dist, this.drawY + 15 );
			ins.ctx.stroke();
			ins.ctx.beginPath();
			ins.ctx.moveTo( this.drawX + 15 - dist, this.drawY + dist );
			ins.ctx.lineTo( this.drawX + dist,  this.drawY + dist );
			ins.ctx.lineTo( this.drawX + dist, this.drawY + 15 - dist );
			ins.ctx.stroke();
		}
	}
	else if ( this.onNE ) {
		if ( this.drawCornerHints ) {
			ins.ctx.beginPath();
			ins.ctx.moveTo( this.drawX + this.drawW - 15, this.drawY - dist );
			ins.ctx.lineTo( this.drawX + this.drawW + dist,  this.drawY - dist );
			ins.ctx.lineTo( this.drawX + this.drawW + dist, this.drawY + 15 );
			ins.ctx.stroke();
			ins.ctx.beginPath();
			ins.ctx.moveTo( this.drawX + this.drawW - 15 + dist, this.drawY + dist );
			ins.ctx.lineTo( this.drawX + this.drawW - dist,  this.drawY + dist );
			ins.ctx.lineTo( this.drawX + this.drawW - dist, this.drawY + 15 - dist );
			ins.ctx.stroke();
		}
	}
	else if ( this.onSE ) {
		if ( this.drawCornerHints ) {
			ins.ctx.beginPath();
			ins.ctx.moveTo( this.drawX + this.drawW - 15, this.drawY + this.drawH + dist );
			ins.ctx.lineTo( this.drawX + this.drawW + dist,  this.drawY + this.drawH + dist );
			ins.ctx.lineTo( this.drawX + this.drawW + dist, this.drawY + this.drawH - 15 );
			ins.ctx.stroke();
			ins.ctx.beginPath();
			ins.ctx.moveTo( this.drawX + this.drawW - 15 + dist, this.drawY + this.drawH - dist );
			ins.ctx.lineTo( this.drawX + this.drawW - dist,  this.drawY + this.drawH - dist );
			ins.ctx.lineTo( this.drawX + this.drawW - dist, this.drawY + this.drawH - 15 + dist );
			ins.ctx.stroke();
		}
	}
	else if ( this.onSW ) {
		if ( this.drawCornerHints ) {
			ins.ctx.beginPath();
			ins.ctx.moveTo( this.drawX + 15, this.drawY + this.drawH + dist );
			ins.ctx.lineTo( this.drawX - dist,  this.drawY + this.drawH + dist );
			ins.ctx.lineTo( this.drawX - dist, this.drawY + this.drawH - 15 );
			ins.ctx.stroke();
			ins.ctx.beginPath();
			ins.ctx.moveTo( this.drawX + 15 - dist, this.drawY + this.drawH - dist );
			ins.ctx.lineTo( this.drawX + dist,  this.drawY + this.drawH - dist );
			ins.ctx.lineTo( this.drawX + dist, this.drawY + this.drawH - 15 + dist );
			ins.ctx.stroke();
		}
	}
	else if ( this.onLeft ) {
		if ( this.drawEdgeHints ) {
			ins.ctx.beginPath();
			ins.ctx.moveTo( this.drawX - dist, this.drawY + this.drawH / 2 - 15 );
			ins.ctx.lineTo( this.drawX - dist,  this.drawY + this.drawH / 2 + 15 );
			ins.ctx.stroke();
			ins.ctx.beginPath();
			ins.ctx.moveTo( this.drawX + dist, this.drawY + this.drawH / 2 - 15 + dist );
			ins.ctx.lineTo( this.drawX + dist,  this.drawY + this.drawH / 2 + 15 - dist );
			ins.ctx.stroke();
		}
	}
	else if ( this.onRight ) {
		if ( this.drawEdgeHints ) {
			ins.ctx.beginPath();
			ins.ctx.moveTo( this.drawX + this.drawW + dist, this.drawY + this.drawH / 2 - 15 );
			ins.ctx.lineTo( this.drawX + this.drawW + dist,  this.drawY + this.drawH / 2 + 15 );
			ins.ctx.stroke();
			ins.ctx.beginPath();
			ins.ctx.moveTo( this.drawX + this.drawW - dist, this.drawY + this.drawH / 2 - 15 + dist );
			ins.ctx.lineTo( this.drawX + this.drawW - dist,  this.drawY + this.drawH / 2 + 15 - dist );
			ins.ctx.stroke();
		}
	}
	else if ( this.onTop ) {
		if ( this.drawEdgeHints ) {
			ins.ctx.beginPath();
			ins.ctx.moveTo( this.drawX + this.drawW / 2 - 15, this.drawY - dist );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 + 15, this.drawY - dist );
			ins.ctx.stroke();
			ins.ctx.beginPath();
			ins.ctx.moveTo( this.drawX + this.drawW / 2 - 15 + dist, this.drawY + dist );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 + 15 - dist, this.drawY + dist );
			ins.ctx.stroke();
		}
	}
	else if ( this.onBottom ) {
		if ( this.drawEdgeHints ) {
			ins.ctx.beginPath();
			ins.ctx.moveTo( this.drawX + this.drawW / 2 - 15, this.drawY + this.drawH + dist );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 + 15, this.drawY + this.drawH + dist );
			ins.ctx.stroke();
			ins.ctx.beginPath();
			ins.ctx.moveTo( this.drawX + this.drawW / 2 - 15 + dist, this.drawY + this.drawH - dist );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 + 15 - dist, this.drawY + this.drawH - dist );
			ins.ctx.stroke();
		}
	}
	else if ( this.onMove ) {
		if ( this.drawMoveHint ) {
			ins.ctx.beginPath();
			ins.ctx.moveTo( this.drawX + this.drawW / 2 - 20, this.drawY + this.drawH / 2 - 30 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2, this.drawY + this.drawH / 2 - 40 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 + 20, this.drawY + this.drawH / 2 - 30 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 + 10, this.drawY + this.drawH / 2 - 30 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 + 10, this.drawY + this.drawH / 2 - 10 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 + 30, this.drawY + this.drawH / 2 - 10 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 + 30, this.drawY + this.drawH / 2 - 20 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 + 40, this.drawY + this.drawH / 2 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 + 30, this.drawY + this.drawH / 2 + 20 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 + 30, this.drawY + this.drawH / 2 + 10 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 + 10, this.drawY + this.drawH / 2 + 10 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 + 10, this.drawY + this.drawH / 2 + 30 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 + 20, this.drawY + this.drawH / 2 + 30 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2, this.drawY + this.drawH / 2 + 40 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 - 20, this.drawY + this.drawH / 2 + 30 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 - 10, this.drawY + this.drawH / 2 + 30 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 - 10, this.drawY + this.drawH / 2 + 10 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 - 30, this.drawY + this.drawH / 2 + 10 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 - 30, this.drawY + this.drawH / 2 + 20 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 - 40, this.drawY + this.drawH / 2 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 - 30, this.drawY + this.drawH / 2 - 20 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 - 30, this.drawY + this.drawH / 2 - 10 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 - 10, this.drawY + this.drawH / 2 - 10 );
			ins.ctx.lineTo( this.drawX + this.drawW / 2 - 10, this.drawY + this.drawH / 2 - 30 );
			ins.ctx.closePath();
			ins.ctx.stroke();
		}
	}
}

ResizeBox.prototype.handle = function( event ) {
	switch ( event.type ) {
		case MOUSE_PUSH:
			if ( this.eventOnEdge( event ) ) {
				this.pushInEffect = true;
				this.pushX = this.drawX;
				this.pushY = this.drawY;
				this.pushW = this.drawW;
				this.pushH = this.drawH;
				return true;
			}
			else
				this.pushInEffect = false;
			break;
		case MOUSE_MOVE:
			if ( this.eventOnEdge( event ) ) {
				event.drawing.doRedraw();
				return true;
			}
			else {
				var doTheRedraw = false;
				if ( this.onTop || this.onBottom || this.onLeft || this.onRight || this.onNE || this.onNW ||
					this.onSE || this.onSW || this.onMove )
					doTheRedraw = true;
				this.onTop = false;
				this.onBottom = false;
				this.onLeft = false;
				this.onRight = false;
				this.onNE = false;
				this.onNW = false;
				this.onSE = false;
				this.onSW = false;
				this.onMove = false;
				if ( doTheRedraw )
					event.drawing.doRedraw();
			}
			break;
		case MOUSE_RELEASE:
			this.pushInEffect = false;
			break;
		case MOUSE_DRAG:
			if ( getLastEventComponent() === this ) {
				if ( this.pushInEffect ) {
					this.newX = this.pushX;
					this.newY = this.pushY;
					this.newW = this.pushW;
					this.newH = this.pushH;
					if ( this.onMove ) {
						this.newX = this.pushX + event.dragX;
						this.newY = this.pushY + event.dragY;
					}
					else {
						if ( this.onTop || this.onNE || this.onNW ) {
							this.newH = this.newH - event.dragY;
							this.newY = this.pushY + event.dragY;
						}
						else if ( this.onBottom || this.onSE || this.onSW )
							this.newH = this.newH + event.dragY;
						if ( this.onLeft || this.onNW || this.onSW ) {
							this.newW = this.newW - event.dragX;
							this.newX = this.pushX + event.dragX;
						}
						else if ( this.onRight || this.onSE || this.onNE )
							this.newW = this.newW + event.dragX;
					}
					this.doCallback();
					return true;
				}
			}
			break;
		default:
			this.pushInEffect = false;
			break;
	}
	event.drawing.setCursor( "default" );
	return false;
};

ResizeBox.prototype.getNewX = function() {
	return this.newX;
};
ResizeBox.prototype.getNewY = function() {
	return this.newY;
};
ResizeBox.prototype.getNewW = function() {
	return this.newW;
};
ResizeBox.prototype.getNewH = function() {
	return this.newH;
};

ResizeBox.prototype.eventInMoveArea = function( event ) {
	if ( this.moveArea === null )
		return this.eventInside( event );
	else
		return this.moveArea.eventInside( event );
};

ResizeBox.prototype.eventOnEdge = function( event ) {
	if ( this.resizeCapable ) {
		this.onTop = false;
		this.onBottom = false;
		this.onLeft = false;
		this.onRight = false;
		this.onNE = false;
		this.onNW = false;
		this.onSE = false;
		this.onSW = false;
		this.onMove = false;
		if ( ( event.py > this.drawY - this.dragWidth && event.py < this.drawY + this.dragWidth ) &&
			( event.px > this.drawX - this.dragWidth && event.px < this.drawX + this.drawW + this.dragWidth ) )
			this.onTop = true;
		else if  ( ( event.py > this.drawY + this.drawH - this.dragWidth && event.py < this.drawY + this.drawH + this.dragWidth ) &&
			( event.px > this.drawX - this.dragWidth && event.px < this.drawX + this.drawW + this.dragWidth ) )
			this.onBottom = true;
		if ( ( event.px > this.drawX - this.dragWidth && event.px < this.drawX + this.dragWidth ) &&
			( event.py > this.drawY - this.dragWidth && event.py < this.drawY + this.drawH + this.dragWidth ) )
			this.onLeft = true;
		else if ( ( event.px > this.drawX + this.drawW - this.dragWidth && event.px < this.drawX + this.drawW + this.dragWidth ) &&
			( event.py > this.drawY - this.dragWidth && event.py < this.drawY + this.drawH + this.dragWidth ) )
			this.onRight = true;
		if ( this.onTop ) {
			if ( this.onLeft ) {
				event.drawing.setCursor( "nw-resize" );
				this.onNW = true;
				return true;
			}
			else if ( this.onRight ) {
				event.drawing.setCursor( "ne-resize" );
				this.onNE = true;
				return true;
			}
			else {
				event.drawing.setCursor( "row-resize" );
				return true;
			}
		}
		else if ( this.onBottom ) {
			if ( this.onLeft ) {
				event.drawing.setCursor( "sw-resize" );
				this.onSW = true;
				return true;
			}
			else if ( this.onRight ) {
				event.drawing.setCursor( "se-resize" );
				this.onSE = true;
				return true;
			}
			else {
				event.drawing.setCursor( "row-resize" );
				return true;
			}
		}
		else if ( this.onLeft ) {
			event.drawing.setCursor( "col-resize" );
			return true;
		}
		else if ( this.onRight ) {
			event.drawing.setCursor( "col-resize" );
			return true;
		}
	}
	if ( this.moveCapable && this.eventInMoveArea( event ) ) {
		event.drawing.setCursor( "move" );
		this.onMove = true;
		return true;
	}
	return false;
};
	
function Button( x, y, w, h, label ) {
	Component.call( this, x, y, w, h, label );
	this.buttonOn = false;
	this.buttonPushed = false;
	this.buttonHover = false;
	this.radioList = null;
	this.radioIndex = 0;
	this.toggleButton = false;
	this.triggerOnRelease = false;
	this.textItem = null;
	this.labelChild = null;  //  holds possible label icons
	if ( label !== undefined && label !== null )
		this.setLabel( label );
	this.buttonSwitch = false;
};

Button.prototype = Object.create( Component.prototype );
Button.prototype.constructor = Button;

Button.prototype.getTextItem = function() {
	return this.textItem;
}

Button.prototype.setLabel = function( newVal ) {
	Component.prototype.setLabel.call( this, newVal );
	if ( this.labelChild !== null )
		this.labelChild.clear();
	if ( typeof( newVal ) === "string" ) {
		if ( this.textItem === null ) {
			this.textItem = new Text( this.getW() / 2, this.getH() / 2, this.label );
			this.textItem.setAlignment( ALIGN_CENTERED_MIDDLE );
			this.add( this.textItem );
		}
		this.textItem.setText( newVal );
	}
	else {
		if ( this.labelChild === null ) {
			this.labelChild = new Component( 0, 0, 1, 1 );
			this.add( this.labelChild );
		}
		this.labelChild.add( newVal );
	}
};

Button.prototype.setRadioList = function( newList ) {
	this.radioIndex = newList.length;
	newList[newList.length] = this;
	this.radioList = newList;
	if ( newList.length === 1 )
		this.setButtonOn( true );
}

Button.prototype.setToggleButton = function( newVal ) {
	this.toggleButton = newVal;
};

Button.prototype.changeRadioList = function() {
	for ( var i = 0; i < this.radioList.length; ++i ) {
		if ( i !== this.radioIndex ) {
			this.radioList[i].setButtonOn( false );
		}
	}
};

Button.prototype.setButtonOn = function( newVal ) {
	this.buttonOn = newVal;
	if ( this.buttonOn && this.radioList !== null )
		this.changeRadioList();
	this.buttonChange();
}
Button.prototype.setButtonPushed = function( newVal ) {
	this.buttonPushed = newVal;
	this.buttonChange();
}
Button.prototype.setButtonHover = function( newVal ) {
	this.buttonHover = newVal;
	this.buttonChange();
}

Button.prototype.getButtonOn = function() {
	return this.buttonOn;
}
Button.prototype.getButtonPushed = function() {
	return this.buttonPushed;
}
Button.prototype.getButtonHover = function() {
	return this.buttonHover;
}

Button.prototype.getValue = function() {
	return this.buttonOn;
}

Button.prototype.setTriggerOnRelease = function( newVal ) {
	this.triggerOnRelease = newVal;
}

Button.prototype.setValue = function( newVal ) {
	this.setButtonOn( newVal );
};

Button.prototype.buttonChange = function() {
	this.doRedraw();
};

Button.prototype.handle = function( event ) {
	switch ( event.type ) {
		case MOUSE_PUSH:
			if ( this.eventInside( event ) ) {
				if ( !this.buttonOn && !this.triggerOnRelease ) {
					if ( this.toggleButton || this.radioList !== null )
						this.setButtonOn( true );
					this.doCallback();
					this.buttonSwitch = true;
				}
				else
					this.buttonSwitch = false;
				this.setButtonPushed( true );
				this.buttonChange();
				return true;
			}
			break;
		case MOUSE_MOVE:
			if ( this.eventInside( event ) ) {
				this.setButtonHover( true );
				this.buttonChange();
				return true;
			}
			else if ( this.buttonHover ) {
				this.setButtonHover( false );
				this.buttonChange();
				return true;
			}
			break;
		case MOUSE_RELEASE:
			if ( this.buttonPushed ) {
				if ( this.toggleButton ) {
					if ( this.buttonOn && !this.buttonSwitch ) {
						this.buttonOn = false;
						this.doCallback();
					}
				}
				else if ( this.triggerOnRelease )
					this.doCallback();
				this.setButtonPushed( false );
				this.doRedraw();
			}
			break;
	}
	return false;
};
	
	
function Popup( x, y, w, h, label ) {
	Frame.call( this, x, y, w, h );
	this.setBackground( new FillRectangle( 0, 0, 1, 1, null ) );
	Frame.prototype.getBackground.call( this ).setFillPaint( rgb( 255, 255, 255 ) );
	Frame.prototype.getBackground.call( this ).setShadow( true );
	this.resizeBox = new ResizeBox( 0, 0, 1, 1 );
	this.resizeBox.setDrawFrame( false );
	this.resizeBox.setDrawCornerHints( false );
	this.resizeBox.setDrawEdgeHints( false );
	this.resizeBox.setDrawMoveHint( false );
	this.resizeBox.setMoveCapable( true );
	this.resizeBox.setCallback( this.resizeCallback, this );
	Frame.prototype.add.call( this, this.resizeBox );
	this.titleBarSize = 25;
	this.titleBar = new Frame( 0, 0, 1, this.titleBarSize );
	this.titleBar.setFillPaint( rgb( 150, 150, 150 ) );
	Frame.prototype.add.call( this, this.titleBar );
	this.titleText = new Text( 10, this.titleBarSize / 2, label );
	this.titleText.setAlignment( ALIGN_CENTERED_RIGHT );
	this.titleBar.add( this.titleText );
	this.closeButton = new Button( -23, 2, 21, 21 );
	this.closeButton.setCallback( this.closeButtonCallback, this );
	this.closeButton.setCombinedPaint( rgb( 200, 200, 200 ) );
	this.closeButton.setLineWidth( 2 );
	this.line1 = new LinePath( 0, 0, 1, 1 );
	this.line1.setScaledDrawing( true );
	this.line1.moveTo( 0.2, 0.2 );
	this.line1.lineTo( 0.8, 0.8 );
	this.closeButton.add( this.line1 );
	this.line2 = new LinePath( 0, 0, 1, 1 );
	this.line2.setScaledDrawing( true );
	this.line2.moveTo( 0.2, 0.8 );
	this.line2.lineTo( 0.8, 0.2 );
	this.closeButton.add( this.line2 );
	Frame.prototype.add.call( this, this.closeButton );
	
	this.frameArea = new Frame( 0, this.titleBarSize, 1, -0.000001 );
	this.frameArea.setClip( true );
	Frame.prototype.add.call( this, this.frameArea );

	this.resizeBox.setMoveArea( 0, 0, 1, this.titleBarSize );

	this.addOverlay( this );
	this.setVisible( false );
	this.setX = 0;
	this.setY = 0;
	this.closeTimeoutID = null;
	this.resize( x, y, w, h );
	this.clickOnTitleBar = false;
	this.modal = false;
	this.hideTimeout = null;
	this.alwaysHide = false;
	this.hideTimeoutID = null;
};

Popup.prototype = Object.create( Frame.prototype );
Popup.prototype.constructor = Popup;

Popup.prototype.add = function( obj ) {
	this.frameArea.add( obj );
}

Popup.prototype.frameAdd = function( comp ) {
	Frame.prototype.add.call( this, comp );
}

Popup.prototype.getBackground = function() {
	return this.frameArea.getBackground();
}
Popup.prototype.getForeground = function() {
	return this.frameArea.getForeground();
}

Popup.prototype.getFrame = function() {
	return this.frameArea;
}

Popup.prototype.setMoveEverywhere = function() {
	this.resizeBox.setMoveArea( null );
}

Popup.prototype.setHideTimeout = function( msec, hideAlways ) {
	if ( hideAlways === undefined || hideAlways === null )
		this.alwaysHide = false;
	else
		this.alwaysHide = hideAlways;
	this.hideTimeout = msec;
};

Popup.prototype.setResizable = function( newVal ) {
	this.resizeBox.setVisible( newVal );
};

Popup.prototype.setShadow = function( newVal ) {
	Frame.prototype.getBackground.call( this ).setShadow( newVal );
}

Popup.prototype.setTearOffInclude = function( newVal ) {
	this.tearOffInclude = null;
};

Popup.prototype.resizeCallback = function( thisInstance ) {
	var newX = thisInstance.resizeBox.getNewX() - thisInstance.getParent().drawX;
	var newY = thisInstance.resizeBox.getNewY() - thisInstance.getParent().drawY;
	if ( newX < 1 )
		newX = newX - thisInstance.getParent().drawW;
	if ( newY < 1 )
		newY = newY - thisInstance.getParent().drawH;
	thisInstance.resize( newX, newY, thisInstance.resizeBox.getNewW(), thisInstance.resizeBox.getNewH() );
	thisInstance.doRedraw();
	doOverlayRedraw();
}

Popup.prototype.closeButtonCallback = function( thisInstance ) {
	thisInstance.hide();
};

Popup.prototype.showTitleBar = function( newVal ) {
	this.titleBar.setVisible( newVal );
	if ( newVal )
		this.frameArea.resize( 0, this.titleBarSize, 1, -0.000001 );
	else
		this.frameArea.resize( 0, 0, 1, 1 );
};

Popup.prototype.showCloseButton = function( newVal ) {
	this.closeButton.setVisible( newVal );
};

Popup.prototype.setModal = function( newVal ) {
	this.modal = newVal;
};

Popup.prototype.show = function() {
	if ( this.x + this.w > window.innerWidth )
		this.x = window.innerWidth - this.w;
	if ( this.x < 0 )
		this.x = 0;
	if ( this.y + this.h > window.innerHeight )
		this.y = window.innerHeight - this.h;
	if ( this.y < 0 )
		this.y = 0;
	this.resize( this.x, this.y, this.w, this.h );
	this.setVisible( true );
	if ( this.alwaysHide )
		this.closeTimeoutID = setTimeout( this.hideTimeoutCB, this.hideTimeout, this );
	doOverlayRedraw();
};

Popup.prototype.hideTimeoutCB = function( thisInstance ) {
	thisInstance.hide();
};

Popup.prototype.hide = function() {
	this.setVisible( false );
	clearTimeout( this.closeTimeoutID );
	this.closeTimeoutID = null;
	doOverlayRedraw();
};

Popup.prototype.handle = function( event ) {
	switch ( event.type ) {
		case MOUSE_MOVE:
			if ( this.eventInside( event ) && !this.hideAlways ) {
				clearTimeout( this.closeTimeoutID );
				this.closeTimeoutID = null;
			}
			else if ( this.closeTimeoutID === null && this.hideTimeout !== null ) {
				if ( this.hideTimeout === 0 )
					this.hideTimeoutCB( this );
				else
					this.closeTimeoutID = setTimeout( this.hideTimeoutCB, this.hideTimeout, this );
			}
		break;
		case MOUSE_PUSH:
		case MOUSE_RELEASE:
		case MOUSE_WHEEL:
		case MOUSE_CLICK:
			if ( this.eventInside( event ) )
				return true;
		break;
	}
	if ( this.modal )
		return true;
	return false;
};

function Tooltip( label ) {
	Popup.call( this, 100, 100, 100, 100 );
	this.text = label;
	this.getBackground().setFillPaint( rgb( 255, 234, 170 ) );
	this.setCombinedPaint( rgb( 255, 234, 170 ) );
	this.setFontSize( 12 );
	this.setCombinedFontPaint( rgb( 0, 0, 0 ) );
	this.textComp = new Text( 10, .5, this.text );
	this.textComp.setAlignment( ALIGN_CENTERED_RIGHT );
	this.add( this.textComp );
	this.showTitleBar( false );
	this.setResizable( false );
	this.setHideTimeout( 0, false );
	this.setX = 0;
	this.setY = 0;
	this.closeTimeoutID = null;
	this.delayTime = 2000;
};

Tooltip.prototype = Object.create( Popup.prototype );
Tooltip.prototype.constructor = Tooltip;

Tooltip.prototype.predraw = function( ins ) {
	var tPars = this.measureText( ins, this.text );
	var newW = tPars.width + 20;
	if ( newW + this.setX > window.innerWidth )
		this.setX = window.innerWidth - newW - 10;
	if ( this.setX < 0 )
		this.setX = 0;

	if ( this.setH < 0 )
		this.setH = 0;
	this.resize( this.setX, this.setY, newW, 25 );
	this.textComp.setXY( 10, 25 / 2 );
};

Tooltip.prototype.show = function( x, y ) {
	this.setX = x;
	this.setY = y;
	Popup.prototype.show.call( this );
};

function forceRedraw() {
	resize();
};

function JDHDrawing( canvasName, useOpenGL ) {
	this.canvasName = canvasName;
	this.useOpenGL = useOpenGL;
	if ( this.useOpenGL === undefined || this.useOpenGL === null )
		this.useOpenGL = false;
	this.context = null;
	this.canvas = document.getElementById( this.canvasName );
	if ( this.canvas !== null && this.canvas.style.zIndex !== undefined && this.canvas.style.zIndex !== null && this.canvas.style.zIndex.length > 0 )
		this.zIndex = this.canvas.style.zIndex;
	else
		this.zIndex = null;
	if ( this.useOpenGL ) {
		this.context = this.canvas.getContext( "webgl" );
		if ( this.context === null )
			alert( "OpenGL is not available it seems.  Your situation is hopeless.\n" );
	}
	else
		this.context = this.canvas.getContext( "2d" );
	this.ins = {};
	this.ins.ctx = this.context;
	this.topLevel = new Component( 0, 0, window.innerWidth, window.innerHeight, "top level" );
	this.initEventHandlers();
	var shared = SharedMemory( "JDHShared" );
	if ( shared.drawings === undefined ) {
		shared.drawings = [];
		window.resize = function() {
			var shared = SharedMemory( "JDHShared" );
			for ( var i = 0; i < shared.drawings.length; ++i )
				shared.drawings[i].resize();
		};
		window.redrawCycleInterval = 10;
		window.redrawCycle = function() {
			var shared = SharedMemory( "JDHShared" );
			for ( var i = 0; i < shared.drawings.length; ++i ) {
				shared.drawings[i].checkForRedraw();
			}
			setTimeout( window.redrawCycle, window.redrawCycleInterval );
		}
		window.redrawCycle();
	}
	shared.drawings.push( this );
	shared[canvasName] = this;
	this.x = 0;
	this.y = 0;
	this.w = window.innerWidth;
	this.h = window.innerHeight;
	this.redrawTrigger = true;
	this.setX = null;
	this.setY = null;
	if ( this.canvas.style.left !== undefined && this.canvas.style.left !== null && this.canvas.style.left.length > 2 ) {
		this.setX = this.canvas.style.left.substring( 0, this.canvas.style.left.length - 2 );
		this.x = this.setX;
	}
	if ( this.canvas.style.top !== undefined && this.canvas.style.top !== null && this.canvas.style.top.length > 2 ) {
		this.setY = this.canvas.style.top.substring( 0, this.canvas.style.top.length - 2 );
		this.y = this.setY;
	}
	this.setW = null;
	this.setH = null;
};

function setRedrawCycleInterval( newVal ) {
	window.redrawCycleInterval = newVal;
}


function pushDrawing( newDrawing ) {
	var shared = SharedMemory( "JDHShared" );
	for ( var i = 0; i < shared.drawings.length; ++i ) {
		if ( shared.drawings[i].canvasName === newDrawing.canvasName )
			return;
	}
	console.info( "adding " + newDrawing.canvasName + " to " + shared.drawings.length );
	shared.drawings.push( newDrawing );
};

JDHDrawing.prototype.redraw = function() {
	this.ins.stokePaint = "#000000";
	this.ins.fillPaint = "#aaaaaa";
	this.ins.fontFillPaint = "#000000";
	this.ins.fontStrokePaint = "#000000";
	this.ins.ctx.font = "20px sans-serif";
	this.ins.fontSize = 20;
	this.ins.fontFamily = "sans-serif";
	this.ins.fontVariant = null;
	this.ins.fontItalic = null;
	this.ins.fontBold = null;
	this.ins.fontOutline = null;
	this.ins.deactivated = false;
	this.ins.scale = 1.0;
	this.ins.inactiveFontFillPaint = "#666666";
	this.ins.inactiveFontStrokePaint = "#666666";
	this.ins.ctx.strokeStyle = this.ins.strokePaint;
	this.ins.ctx.fillStyle = this.ins.fillPaint;
	this.ins.ctx.clearRect( 0, 0, window.innerWidth, window.innerHeight );
	if ( this.topLevel != null ) {
		this.topLevel.testRemovals();
		this.topLevel.redraw( this.ins );
	}	
};

JDHDrawing.prototype.resize = function( newX, newY, newW, newH ) {
	if ( newX !== undefined && newX !== null ) {
		this.canvas.style.left = newX.toFixed( 0 ).toString() + "px";
		this.x = newX;
		this.setX = newX;
	}
	else if ( this.setX === null ) {
		this.canvas.style.left = "0px";
		this.x = 0;
	}
	if ( newY !== undefined && newY !== null ) {
		this.canvas.style.top = newY.toFixed( 0 ).toString() + "px";
		this.y = newY;
		this.setY = newY;
	}
	else if ( this.setY === null ) {
		this.canvas.style.top = "0px";
		this.y = 0;
	}
	if ( newW !== undefined && newW !== null ) {
		this.canvas.width = newW;
		this.w = newW;
		this.setW = newW;
	}
	else if ( this.setW === null ) {
		this.canvas.width = window.innerWidth - this.x;
		this.w = this.canvas.width;
	}
	else {
		this.canvas.width = this.setW;
		this.setW = this.canvas.width;
	}
	if ( newH !== undefined && newH !== null ) {
		this.canvas.height = newH;
		this.h = newH;
		this.setH = newH;
	}
	else if ( this.setH === null ) {
		this.canvas.height = window.innerHeight - this.y;
		this.h = this.canvas.height;
	}
	else {
		this.canvas.height = this.setH;
		this.h = this.canvas.height;
	}
	this.topLevel.resize( 0, 0, this.canvas.width, this.canvas.height );
	this.redraw();
};

JDHDrawing.prototype.add = function( newComponent ) {
	if ( this.topLevel !== null ) {
		this.topLevel.add( newComponent, this );
		newComponent.setDrawing( this );
	}
};

JDHDrawing.prototype.getCursor = function() {
	return this.canvas.style.cursor;
};
JDHDrawing.prototype.setCursor = function( newCursor ) {
	this.canvas.style.cursor = newCursor;
};

function addOverlay( newComponent ) {
	var shared = SharedMemory( "JDHShared" );
	if ( shared.overlayComponent === undefined ) {
		shared.overlayComponent = new Component( 0, 0, window.innerWidth, window.innerHeight, "overlay" );
	}
	shared.overlayComponent.add( newComponent );
};

function clearOverlay() {
	var shared = SharedMemory( "JDHShared" );
	if ( shared.overlayComponent !== undefined )
		shared.overlayComponent.clear();
}

function removeFromOverlay( oldComponent ) {
	var shared = SharedMemory( "JDHShared" );
	if ( shared.overlayComponent !== undefined ) {
		shared.overlayComponent.removeChild( oldComponent );
	}
}

function isOverlay( oldComponent ) {
	var shared = SharedMemory( "JDHShared" );
	if ( shared.overlayComponent === undefined )
		return false;
	if ( shared.overlayComponent.isChild( oldComponent ) )
		return true;
	return false;
}

function redrawOverlay() {
	var shared = SharedMemory( "JDHShared" );
	if ( shared.drawings === undefined )
		return;
	if ( shared.drawings.overlay === undefined )
		shared.drawings.overlay = shared.drawings[shared.drawings.length - 1];
	if ( shared.overlayComponent === undefined )
		return;
	if ( shared.drawings.overlay.topLevel.getForeground() === null ) {
		shared.drawings.overlay.topLevel.setForeground( shared.overlayComponent );
		shared.overlayComponent.setDrawing( shared.drawings.overlay );
	}
	shared.drawings.overlay.doRedraw();
};

var UNKNOWN_PAINT         = 0;
var COLOR_PAINT           = 1;
var LINEAR_GRADIENT_PAINT = 2;
var RADIAL_GRADIENT_PAINT = 3;
var IMAGE_PAINT           = 4;
var PATTERN_IMAGE_PAINT   = 5;
var POINTER_PAINT         = 6;

function Paint( type ) {
	var obj = {};
	obj.type = type;
	obj.r = null;
	obj.g = null;
	obj.b = null;
	obj.a = null;
	obj.value = null;
	obj.x1;
	obj.y1;
	obj.r1;
	obj.x2;
	obj.y2;
	obj.r2;
	obj.img = null;
	obj.pattern = null;
	obj.dynamic = false;
	obj.useH1 = false;
	obj.useH2 = false;
	obj.stopList = null;
	obj.paint = null;
	obj.setPaint = function( newPaint ) {
		this.paint = newPaint;
	};
	obj.addStop = function( position, color ) {
		var stopObj = {};
		stopObj.position = position;
		stopObj.color = color;
		stopObj.next = null;
		if ( obj.stopList === null )
			obj.stopList = stopObj;
		else {
			var stop = obj.stopList;
			while ( stop.next !== null )
				stop = stop.next;
			stop.next = stopObj;
		}
	};
	return obj;
};

function rgb( r, g, b ) {
	return rgba( r, g, b, null );
}

function rgba( R, G, B, A ) {
	var a = A;
	if ( a === null )
		a = 1.0;
	if ( a > 1.0 )
		a = a / 255.0;
	var r = R;
	if ( r <= 1.0 )
		r = Math.round( r * 255 );
	var g = G;
	if ( g <= 1.0 )
		g = Math.round( g * 255 );
	var b = B;
	if ( b <= 1.0 )
		b = Math.round( b * 255 );
	var newPaint = new Paint( COLOR_PAINT );
	newPaint.r = r;
	newPaint.g = g;
	newPaint.b = b;
	newPaint.a = a;
	newPaint.value = "rgba( " + Math.floor( r ) + ", " + Math.floor( g ) + ", " + Math.floor( b ) + ", " + a + " )";
	return newPaint;
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
function rgbToHsv(r, g, b){
    r = r/255, g = g/255, b = b/255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if(max == min){
        h = 0; // achromatic
    }else{
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, v];
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
function hsvToRgb(h, s, v){
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [r * 255, g * 255, b * 255];
}

function hexToHsv( hex ) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
	r = parseInt( result[1], 16 );
	g = parseInt( result[2], 16 );
	b = parseInt( result[3], 16 );
	r /= 255, g /= 255, b /= 255;
	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;
	if ( max == min ) {
		h = s = 0; // achromatic
	} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch ( max ) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}
	return [h, s, l];
}

function hexToRgb( hex ) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
	r = parseInt( result[1], 16 );
	g = parseInt( result[2], 16 );
	b = parseInt( result[3], 16 );
	r /= 255, g /= 255, b /= 255;
	return [r, g, b];
}

function linearGradient( x1, y1, x2, y2 ) {
	var newPaint = new Paint( LINEAR_GRADIENT_PAINT );
	newPaint.x1 = x1;
	newPaint.y1 = y1;
	newPaint.x2 = x2;
	newPaint.y2 = y2;
	return newPaint;
}

function radialGradient( x1, y1, r1, x2, y2, r2, useH1, useH2 ) {
	var newPaint = new Paint( RADIAL_GRADIENT_PAINT );
	newPaint.x1 = x1;
	newPaint.y1 = y1;
	newPaint.r1 = r1;
	newPaint.x2 = x2;
	newPaint.y2 = y2;
	newPaint.r2 = r2;
	if ( useH1 !== undefined && useH1 !== null )
		newPaint.useH1 = useH1;
	if ( useH2 !== undefined && useH2 !== null )
		newPaint.useH2 = useH2;
	return newPaint;
}

function image( sourceFile, dynamic ) {
	var newPaint = Paint( IMAGE_PAINT );
	if ( dynamic === undefined || dynamic === false ) {
		newPaint.img = new Image();
		newPaint.img.src = sourceFile;
		newPaint.dynamic = true;
	}
	else
		newPaint.img = sourceFile;
	return newPaint;
};

function patternImage( sourceFile, pattern, dynamic ) {
	var newPaint = Paint( PATTERN_IMAGE_PAINT );
	if ( dynamic === undefined || dynamic === false ) {
		newPaint.img = new Image();
		newPaint.img.src = sourceFile;
		newPaint.dynamic = true;
	}
	else
		newPaint.img = sourceFile;
	newPaint.pattern = pattern;
	return newPaint;
};

function translatePaint( ins, paint ) {
	if ( typeof( paint ) === "string" )
		return paint;
	else if ( paint.type === COLOR_PAINT )
		return paint.value;
	else if ( paint.type === POINTER_PAINT )
		return translatePaint( ins, paint.paint );
	else if ( paint.type === LINEAR_GRADIENT_PAINT || paint.type === RADIAL_GRADIENT_PAINT ) {
		var x1 = paint.x1;
		var y1 = paint.y1;
		var x2 = paint.x2;
		var y2 = paint.y2;
		if ( Math.abs( paint.x1 ) < 1 )
			x1 = paint.x1 * ins.w;
		else
			x1 = paint.x1;
		if ( x1 < 0 )
			x1 = ins.x + ins.w + x1;
		else
			x1 = ins.x + x1;
		if ( Math.abs( paint.y1 ) < 1 )
			y1 = paint.y1 * ins.h;
		else
			y1 = paint.y1;
		if ( y1 < 0 )
			y1 = ins.y + ins.h + y1;
		else
			y1 = ins.y + y1;
		if ( Math.abs( paint.x2 ) < 1 )
			x2 = paint.x2 * ins.w;
		else
			x2 = paint.x2;
		if ( x2 < 0 )
			x2 = ins.x + ins.w + x2;
		else
			x2 = ins.x + x2;
		if ( Math.abs( paint.y2 ) < 1 )
			y2 = paint.y2 * ins.h;
		else
			y2 = paint.y2;
		if ( y2 < 0 )
			y2 = ins.y + ins.h + y2;
		else
			y2 = ins.y + y2;
		var ret = null;
		if ( paint.type === LINEAR_GRADIENT_PAINT )
			ret = ins.ctx.createLinearGradient( x1, y1, x2, y2 );
		else if ( paint.type === RADIAL_GRADIENT_PAINT ) {
			var r1 = paint.r1;
			var r2 = paint.r2;
			if ( paint.r1 < 1 ) {
				if ( paint.useH1 )
					r1 = paint.r1 * ins.h;
				else
					r1 = paint.r1 * ins.w;
			}
			if ( paint.r2 < 1 ) {
				if ( paint.useH2 )
					r2 = paint.r2 * ins.h;
				else
					r2 = paint.r2 * ins.w;
			}
			ret = ins.ctx.createRadialGradient( x1, y1, r1, x2, y2, r2 );
		}
		var stop = paint.stopList;
		while ( stop !== null ) {
			if ( typeof( stop.color ) === "string" )
				ret.addColorStop( stop.position, stop.color );
			else
				ret.addColorStop( stop.position, stop.color.value );
			stop = stop.next;
		}
		return ret;
	}
	else if ( paint.type === IMAGE_PAINT ) {
		if ( paint.dynamic )
			var img = paint.img;
		else {
			var img = new Image();
			img.src = paint.img;
		}
		ret = ins.ctx.createPattern( img, 'no-repeat' );
		return ret;
	}
	else if ( paint.type === PATTERN_IMAGE_PAINT ) {
		if ( paint.dynamic )
			var img = paint.img;
		else {
			var img = new Image();
			img.src = paint.img;
		}
		ret = ins.ctx.createPattern( img, paint.pattern );
		return ret;
	}
};

function pointerPaint( newPaintSpec ) {
	if ( newPaintSpec === undefined )
		return new Paint( POINTER_PAINT );
	else {
		var newPaint = new Paint( POINTER_PAINT );
		newPaint.setPaint( newPaintSpec );
		return newPaint;
	}
}

var FONT_FILLED      = 0;
var FONT_OUTLINE     = 1;
var FONT_BOTH        = 2;
function Font( family, size, bold, italic, outline, variant ) {
	var obj = {};
	if ( family !== undefined )
		obj.family = family;
	else
		obj.family = null;
	if ( size !== undefined )
		obj.size = size;
	else
		obj.size = null;
	if ( bold !== undefined )
		obj.bold = bold;
	else
		obj.bold = null;
	if ( italic !== undefined )
		obj.italic = italic;
	else
		obj.italic = null;
	if ( outline !== undefined )
		obj.outline = outline;
	else
		obj.outline = null;
	if ( variant !== undefined )
		obj.variant = variant;
	else
		obj.variant = null;
	return obj;
};

var BUTT_LINECAP     = 0;
var ROUND_LINECAP    = 1;
var SQUARE_LINECAP   = 2;
var lineCapString = ['butt', 'round', 'square'];

var MITER_LINEJOIN   = 0;
var BEVEL_LINEJOIN   = 1;
var ROUND_LINEJOIN   = 2;
var lineJoinString = ['miter', 'bevel', 'round'];

var LINEAR           = 0;
var LOG              = 1;

var X_PROJECTION     = 1;
var Y_PROJECTION     = 2;
var ADD              = 3;
var SUM              = 3;
var SUB              = 4;
var SUBTRACT         = 4;
var MULTIPLY         = 5;
var MULT             = 5;
var MUL              = 5;
var DIV              = 6;
var DIVIDE           = 6;

function findXPixel( inst ) {
	if ( topLevel === null )
		return 0;
	return topLevel.xPixel( inst );
};

function findYPixel( inst ) {
	if ( topLevel === null )
		return 0;
	return topLevel.yPixel( inst );
};


var UNKNOWN_EVENT  = 0;
var MOUSE_PUSH     = 1;
var MOUSE_RELEASE  = 2;
var MOUSE_LEAVE    = 3;
var MOUSE_ENTER    = 4;
var MOUSE_MOVE     = 5;     //  Move when the mouse has no buttons pushed
var MOUSE_DRAG     = 6;     //  Move when the mouse has a button pushed
var MOUSE_WHEEL    = 7;     //  The mouse wheel was spun
var MOUSE_CLICK    = 8;     //  Mouse was pushed and released in the same position
var MOUSE_HOVER    = 9;     //  Mouse was left in a position for a defined interval
var KEY_DOWN       = 10;    //  A key was pressed - occurs for almost all keys
var KEY_UP         = 11;    //  A key was released - occurs for almost all keys
var KEY_PRESS      = 12;    //  A key was pressed - occurs for most "typeable" keys
var NEW_FOCUS      = 13;    //  I created this event - it means a component has grabbed
var TIMEOUT_EVENT  = 14;    //  Throw a "timeout" through the event handler.
							
var KB_TYPING     = 0;
var KB_BACKSPACE  = 8;
var KB_TAB        = 9;
var KB_UNDEFINED  = 12;   //  This is the center of the numeric keypad when "numlock" is off.
var KB_ENTER      = 13;
var KB_PAUSE      = 19;
var KB_ESCAPE     = 27;
var KB_PAGEUP     = 33;
var KB_PAGEDOWN   = 34;
var KB_END        = 35;
var KB_HOME       = 36;
var KB_ARROWLEFT  = 37;
var KB_ARROWUP    = 38;
var KB_ARROWRIGHT = 39;
var KB_ARROWDOWN  = 40;
var KB_DELETE     = 46;
var KB_F1         = 112;
var KB_F2         = 113;
var KB_F3         = 114;
var KB_F4         = 115;
var KB_F5         = 116;
var KB_F6         = 117;
var KB_F7         = 118;
var KB_F8         = 119;
var KB_F9         = 120;
var KB_F10        = 121;
var KB_F11        = 122;
var KB_F12        = 123;

pasteBuffer = null;

function getPasteBuffer() {
	return pasteBuffer;
};
function setPasteBuffer( newText ) {
	pasteBuffer = newText;
};

function cutEvent( event, bufferText ) {
	if ( ( event.e.key === 'x' || event.e.key === 'X' ) && event.e.ctrlKey ) {
		if ( bufferText !== undefined ) {
			setPasteBuffer( bufferText );
		}
		return true;
	}
	return false;
};

function copyEvent( event, bufferText ) {
	if ( ( event.e.key === 'c' || event.e.key === 'C' ) && event.e.ctrlKey ) {
		if ( bufferText !== undefined ) {
			setPasteBuffer( bufferText );
		}
		return true;
	}
	return false;
};

function pasteEvent( event ) {
	if ( ( event.e.key === 'v' || event.e.key === 'V' ) && event.e.ctrlKey ) {
		return true;
	}
	return false;
};

function EventInfo( e ) {
	obj = {};
	obj.e = e;          //  data from JavaScript
	obj.type;           //  this is my type (see list above)
	obj.dragStartX;     //  position where a drag started
	obj.dragStartY;
	obj.dragX;          //  pixels dragged from start
	obj.dragY;
	obj.delta;          //  mousewheel direction - might have other uses?
	obj.component;      //  target component - used for timeouts
	return obj;
};

JDHDrawing.prototype.initEventHandlers = function() {
	if ( window.JDHevents === undefined ) {
		window.JDHevents = {};
		window.addEventListener( 'mousedown', handleMouseDown );
		window.addEventListener( 'mouseup', handleMouseRelease );
		window.addEventListener( 'mouseout', handleMouseLeave );
		window.addEventListener( 'mouseover', handleMouseEnter );
		window.addEventListener( 'mouseenter', handleMouseEnter );  // redundant? does nothing?
		window.addEventListener( 'mousemove', handleMouseMove );
		window.addEventListener( "mousewheel", handleMouseWheel );      //  This for Safari, MS, Chrome, etc.
		window.addEventListener( "DOMMouseScroll", handleMouseWheel );  //  This for Firefox
		window.addEventListener( 'keypress', handleKeyPress );
		window.addEventListener( 'keyup', handleKeyUp );
		window.addEventListener( 'keydown', handleKeyDown );
		window.JDHevents.mousePushed = false;
		window.JDHevents.mousePushedX = 0;
		window.JDHevents.mousePushedY = 0;
		window.JDHevents.lastMoveX = 0;
		window.JDHevents.lastMoveY = 0;
		window.JDHevents.hoverInterval = 500;//1500;
		window.JDHevents.hoverEvent = null;
		window.JDHevents.hoverTimeoutID = null;
		window.JDHevents.overlayRedrawTrigger = false;
	}
	this.redrawTrigger = false;
};



JDHDrawing.prototype.doRedraw = function() {
	this.redrawTrigger = true;
};

function doOverlayRedraw() {
	window.JDHevents.overlayRedrawTrigger = true;
};

JDHDrawing.prototype.processEvent = function( event ) {
	this.redrawTrigger = false;
	return this.topLevel.tryHandle( event );
}

JDHDrawing.prototype.checkForRedraw = function() {
	if ( this.redrawTrigger ) {
		this.redrawTrigger = false;
		this.redraw();
	}
};

function processEvent( event ) {
	window.JDHevents.overlayRedrawTrigger = false;
	var shared = SharedMemory( "JDHShared" );
	var ret = false;
	if ( shared.overlayComponent !== undefined && shared.drawings.overlay !== undefined ) {
		event.drawing = shared.drawings.overlay;
		event.px = event.e.clientX - event.drawing.x;
		event.py = event.e.clientY - event.drawing.y;
		ret = shared.overlayComponent.tryHandle( event );
		if ( shared.drawings.overlay.redrawTrigger )
			doOverlayRedraw();
	}
	for ( var i = shared.drawings.length; i > 0 && !ret; --i ) {
		event.drawing = shared.drawings[i-1];
		event.px = event.e.clientX - event.drawing.x;
		event.py = event.e.clientY - event.drawing.y;
		ret = shared.drawings[i-1].processEvent( event );
	}
	if ( window.JDHevents.overlayRedrawTrigger )
		redrawOverlay();
	for ( var i = 0; i < shared.drawings.length; ++i )
		shared.drawings[i].checkForRedraw();
};

function getLastEventComponent() {
	if ( window.lastEventComponent === undefined )
		return null;
	else
		return window.lastEventComponent;
};

function setLastEventComponent( newComponent ) {
	window.lastEventComponent = newComponent;
};

function handleMouseDown( e ) {
	clearTimeout( window.JDHevents.hoverTimeoutID );
    window.JDHevents.mousePushed = true;
    window.JDHevents.mousePushedX = e.clientX;
    window.JDHevents.mousePushedY = e.clientY;
	var event = EventInfo( e );
	event.type = MOUSE_PUSH;
	window.processEvent( event );
};

function setHoverInterval( newVal ) {
	window.JDHevents.hoverInterval = newVal;
}

function handleMouseMove( e ) {
	var event = EventInfo( e );
	clearTimeout( window.JDHevents.hoverTimeoutID );
	if ( window.JDHevents.mousePushed ) {
		event.type = MOUSE_DRAG;
		event.dragStartX = window.JDHevents.mousePushedX;
		event.dragStartY = window.JDHevents.mousePushedY;
		event.dragX = e.clientX - window.JDHevents.mousePushedX;
		event.dragY = e.clientY - window.JDHevents.mousePushedY;
		event.component = getLastEventComponent();
	}
	else {
		event.type = MOUSE_MOVE;
		window.JDHevents.hoverEvent = EventInfo( e );
		window.JDHevents.hoverTimeoutID = setTimeout( hoverEventTimeout, window.JDHevents.hoverInterval );
	}
	window.JDHevents.lastMoveX = e.clientX;
	window.JDHevents.lastMoveY = e.clientY;
	processEvent( event );
};

function hoverEventTimeout() {
	window.JDHevents.hoverEvent.type = MOUSE_HOVER;
	processEvent( window.JDHevents.hoverEvent );
	if ( window.JDHevents.hoverEvent.drawing.redrawTrigger )
		window.JDHevents.hoverEvent.drawing.resize();
		if ( window.JDHevents.overlayRedrawTrigger ) {
			var shared = SharedMemory( "JDHShared" );
			if ( shared.drawings[shared.drawings.length-1] !== window.JDHevents.hoverEvent.drawing )
				shared.drawings[shared.drawings.length-1].resize();
		}
	}

function handleMouseRelease( e ) {
	clearTimeout( window.JDHevents.hoverTimeoutID );
    window.JDHevents.mousePushed = false;
	var event = EventInfo( e );
	event.type = MOUSE_RELEASE;
	processEvent( event );
	if ( e.clientX === window.JDHevents.mousePushedX && e.clientY === window.JDHevents.mousePushedY ) {
		var event = EventInfo( e );
		event.type = MOUSE_CLICK;
		processEvent( event );
	}
};

function handleMouseWheel( e ) {
	clearTimeout( window.JDHevents.hoverTimeoutID );
	var event = EventInfo( e );
	event.type = MOUSE_WHEEL;
    event.delta = Math.max(-1, Math.min( 1, ( e.wheelDelta || -e.detail ) ) );
	processEvent( event );
};

function handleMouseEnter( e ) {
	clearTimeout( window.JDHevents.hoverTimeoutID );
	var event = EventInfo( e );
	window.JDHevents.mousePushed = false;
	event.type = MOUSE_ENTER;
	processEvent( event );
};

function handleMouseLeave( e ) {
	clearTimeout( window.JDHevents.hoverTimeoutID );
	var event = EventInfo( e );
	window.JDHevents.mousePushed = false;
	event.type = MOUSE_LEAVE;
	processEvent( event );
};

function handleKeyDown( e ) {
	clearTimeout( window.JDHevents.hoverTimeoutID );
	if ( e.which === 8 ) {
		e.preventDefault();
		handleKeyPress( e );
	}
	var event = EventInfo( e );
	event.type = KEY_DOWN;
	event.e.clientX = window.JDHevents.lastMoveX;
	event.e.clientY = window.JDHevents.lastMoveY;
	this.keyDownProcessed = false;
	if ( event.e.key.length === 1 ) {
		event.e.JDHKeyCode = KB_TYPING;
	}
	else
		event.e.JDHKeyCode = event.e.keyCode;
	processEvent( event );
}

function handleKeyPress( e ) {
	clearTimeout( window.JDHevents.hoverTimeoutID );
	var event = EventInfo( e );
	event.type = KEY_PRESS;
	event.e.clientX = window.JDHevents.lastMoveX;
	event.e.clientY = window.JDHevents.lastMoveY;
	this.keyDownProcessed = true;
	if ( event.e.key.length === 1 ) {
		event.e.JDHKeyCode = KB_TYPING;
	}
	else
		event.e.JDHKeyCode = event.e.keyCode;
	processEvent( event );
}

function handleKeyUp( e ) {
	clearTimeout( window.JDHevents.hoverTimeoutID );
	var event = EventInfo( e );
	event.type = KEY_UP;
	event.e.clientX = window.JDHevents.lastMoveX;
	event.e.clientY = window.JDHevents.lastMoveY;
	if ( !this.keyDownProcessed && event.e.keyCode !== KB_BACKSPACE )
		handleKeyPress( e );
	this.keyDownProcessed = true;
	processEvent( event );
}

function newFocus( e, comp ) {
	var event = EventInfo( e );
	event.type = NEW_FOCUS;
	event.focusComponent = comp;
	processEvent( event );
}

var UNKNOWN_BROWSER                = 0;
var EXPLORER                       = 1;
var CHROME                         = 2;
var FIREFOX                        = 3;
var SAFARI                         = 4;
var OPERA                          = 5;

function browserType() {
	var shared = SharedMemory( "JDHShared" );
	if ( shared.browser === undefined ) {
		if (navigator.userAgent.search("MSIE") >= 0) {
			shared.browser = EXPLORER;
		}
		else if (navigator.userAgent.search("Chrome") >= 0) {
			shared.browser = CHROME;
		}
		else if (navigator.userAgent.search("Firefox") >= 0) {
			shared.browser = FIREFOX;
		}
		else if (navigator.userAgent.search( "Safari" ) >= 0 && navigator.userAgent.search("Chrome") < 0) {
			shared.browser = SAFARI;
		}
		else if (navigator.userAgent.search( "Opera ") >= 0) {
			shared.browser = OPERA;
		}
		else
			shared.browser = UNKNOWN_BROWSER;
	}	
	return shared.browser;
}

function stringsEqual( str1, str2 ) {
	if ( str1.length !== str2.length )
		return false;
	for ( var i = 0; i < str1.length; ++i ) {
		if ( str1.charAt( i ) != str2.charAt( i ) )
			return false;
	}
	return true;
}
function Browser( x, y, w, h, label ) {
	Component.call( this, x, y, w, h, label );
	this.horizontal = false;
	this.talk = false;
};

Browser.prototype = Object.create( Component.prototype );
Browser.prototype.constructor = Browser;

Browser.prototype.getHorizontal = function() {
	return this.horizontal;
};
Browser.prototype.setHorizontal = function( newScroll ) {
	this.horizontal = newScroll;
};

Browser.prototype.getH = function() {
	if ( this.horizontal )
		return Component.prototype.getH.call( this );
	else {
		if ( this.physicalChange ) {
			this.newH = 0;
			if ( this.children !== null ) {
				var child = this.children;
				while( child !== null ) {
					var childH = child.getH();
					child.resize( this.getX(), this.newH, child.getW(), childH );
					this.newH = this.newH + childH;
					child = child.next;
				}
			}
			this.resize( this.getX(), this.getY(), this.getW(), this.newH );
			this.setPhysicalChange( false );
		}
		return this.newH;
	}
};

Browser.prototype.predraw = function( ins ) {
	if ( this.horizontal )
		this.getW();
	else
		this.getH();
};

function DrawPath( x, y, w, h, label ) {
	Component.call( this, x, y, w, h, label );
	this.instructions = [];
	this.xpts = [];
	this.ypts = [];
	this.pathType = "line";
};

DrawPath.prototype = Object.create( Component.prototype );
DrawPath.prototype.constructor = DrawPath;

DrawPath.prototype.addPoint = function( newX, newY ) {
	var i = this.instructions.length;
	this.instructions[i] = "point";
	this.xpts[i] = newX;
	this.ypts[i] = newY;
};

DrawPath.prototype.setFill = function() {
	this.pathType = "fill";
};

DrawPath.prototype.setLine = function() {
	this.pathType = "line";
};

DrawPath.prototype.setLoop = function() {
	this.pathType = "loop";
};

DrawPath.prototype.setLoop = function() {
	this.pathType = "clip";
};

DrawPath.prototype.draw = function( ins ) {
	ins.ctx.beginPath();
	var i = 0;
	if ( this.instructions[0] === "point" ) {
		ins.ctx.moveTo( this.drawX + this.xpts[0], this.drawY + this.ypts[0] );
		i = i + 1;
	}
	else
		ins.ctx.moveTo( 0, 0 );
	for ( i; i < this.instructions.length; ++i ) {
		if ( this.instructions[i] === "point" ) 
			ins.ctx.lineTo( this.drawX + this.xpts[i], this.drawY + this.ypts[i] );
	}
	if ( this.pathType === "line" ) {
		ins.ctx.stroke();
	}
	else if ( this.pathType === "loop" ) {
		ins.ctx.closePath();
		ins.ctx.stroke();
	}
	else if ( this.pathType === "fill" ) {
		ins.ctx.closePath();
		ins.ctx.fill();
	}
	else if ( this.pathType === "clip" ) {
		ins.ctx.closePath();
		ins.ctx.clip();
	}
};

function ShapeButton( x, y, w, h, label ) {
	Button.call( this, x, y, w, h, label );
	this.setBackground( new Component( 0, 0, 1, 1 ) );
	this.upperLeft = new Component( 0, 0, 1, 1 );
	this.add( this.upperLeft );
	this.lowerRight = new Component( 0, 0, 1, 1 );
	this.add( this.lowerRight );
	this.offPaint = null;
	this.onPaint = null;
	this.pushedPaint = null;
	this.hoverPaint = null;
	this.illuminatedPaint = null;
	this.shadowedPaint = null;
};

ShapeButton.prototype = Object.create( Button.prototype );
ShapeButton.prototype.constructor = ShapeButton;

ShapeButton.prototype.setColor = function( r, g, b ) {
	this.offPaint = rgb( r, g, b );
	this.illuminatedPaint = rgb( 255, 255, 255 );
	this.shadowedPaint = rgb( r * .65, g * .65, b * .65 );
}

ShapeButton.prototype.getUpperLeft = function() {
	return this.upperLeft;
};

ShapeButton.prototype.getLowerRight = function() {
	return this.lowerRight;
}

ShapeButton.prototype.setIlluminatedPaint = function( newPaint ) {
	this.illuminatedPaint = newPaint;
};
ShapeButton.prototype.getIlluminatedPaint = function() {
	return this.illuminatedPaint;
}

ShapeButton.prototype.setShadowedPaint = function( newPaint ) {
	this.shadowedPaint = newPaint;
};
ShapeButton.prototype.getShadowedPaint = function() {
	return this.shadowedPaint;
}

ShapeButton.prototype.setHoverPaint = function( newPaint ) {
	this.hoverPaint = newPaint;
};
ShapeButton.prototype.getHoverPaint = function() {
	return this.hoverPaint;
}

ShapeButton.prototype.setOnPaint = function( newPaint ) {
	this.onPaint = newPaint;
};
ShapeButton.prototype.getOnPaint = function() {
	return this.onPaint;
}

ShapeButton.prototype.setOffPaint = function( newPaint ) {
	this.offPaint = newPaint;
};
ShapeButton.prototype.getOffPaint = function() {
	return this.offPaint;
}

ShapeButton.prototype.setPushedPaint = function( newPaint ) {
	this.pushedPaint = newPaint;
};
ShapeButton.prototype.getPushedPaint = function() {
	return this.pushedePaint;
}

ShapeButton.prototype.preSettings = function( ins ) {
	if ( this.buttonOn && this.onPaint !== null )
		this.getBackground().setFillPaint( this.onPaint );
	else if ( this.offPaint !== null )
		this.getBackground().setFillPaint( this.offPaint );
	if ( this.buttonPushed && this.pushedPaint !== null )
		this.getBackground().setFillPaint( this.pushedPaint );
	if ( this.buttonHover && this.hoverPaint !== null )
		this.getBackground().setFillPaint( this.hoverPaint );
	if ( this.buttonPushed ) {
		if ( this.illuminatedPaint !== null )
			this.getLowerRight().setCombinedPaint( this.illuminatedPaint );
		if ( this.shadowedPaint !== null )
			this.getUpperLeft().setCombinedPaint( this.shadowedPaint );
	}
	else {
		if ( this.illuminatedPaint !== null )
			this.getUpperLeft().setCombinedPaint( this.illuminatedPaint );
		if ( this.shadowedPaint !== null )
			this.getLowerRight().setCombinedPaint( this.shadowedPaint );
	}
}

function BoxButton( x, y, w, h, label ) {
	ShapeButton.call( this, x, y, w, h, label );
	this.getBackground( ).add( new FillRectangle( 0, 0, 1, 1 ) );//( 1, 1, -1, -1 ) );
	this.offPaint = rgb( 200, 200, 200 );
	this.illuminatedPaint = rgb( 255, 255, 255 );
	this.shadowedPaint = rgb( 100, 100, 100 );
	this.lr = new LinePath( 0, 0, 1, 1 );
	this.lr.setScaledDrawing( true );
	this.lr.moveTo( 0, 1 );
	this.lr.lineTo( 1, 1 );
	this.lr.lineTo( 1, 0 );
	this.getLowerRight().add( this.lr );
	this.ul = new LinePath( 0, 0, 1, 1 );
	this.ul.setScaledDrawing( true );
	this.ul.moveTo( 1, 0 );
	this.ul.lineTo( 0, 0 );
	this.ul.lineTo( 0, 1 );
	this.getUpperLeft().add( this.ul );
};

BoxButton.prototype = Object.create( ShapeButton.prototype );
BoxButton.prototype.constructor = BoxButton;


function BrowserItem( x, y, w, h, label ) {
	Frame.call( this, x, y, w, h, label );
	this.open = false;
	this.indent = 0;
	this.headerW = w;
	this.headerH = h;
	var sz = h / 2.5;
	var wd1 = h / 2 - sz / 2;
	var wd2 = h / 2;
	var wd3 = wd1 + sz;
	var ht = ( sz / 2 ) * 1.732;
	var ht1 = ( h - ht ) / 2;
	var ht2 = ht1 + ht;
	var ht3 = ht1;
	this.openIcon = new FillPath( x, y, h, h );
	this.openIcon.moveto( wd1, ht1 );
	this.openIcon.lineto( wd2, ht2 );
	this.openIcon.lineto( wd3, ht3 );
	this.closedIcon = new FillPath( x, y, h, h );
	this.closedIcon.moveto( ht1, wd1 );
	this.closedIcon.lineto( ht2, wd2 );
	this.closedIcon.lineto( ht3, wd3 );
	this.headerContainer = new Component( 0, 0, w, this.headerH );
	this.add( this.headerContainer );
	this.headerBox = new Component( 0, 0, w, this.headerH );
	this.headerContainer.add( this.headerBox );
	this.header = new Text( 0, this.headerH / 2, label );
	this.header.setAlignment( ALIGN_CENTERED_RIGHT );
	this.headerBox.add( this.header );
	this.editableLabel = false;
	this.browserLevel = 0;
	this.browser = null;
	this.controlArea = null;
	this.indentStep = h / 2;
	this.indentOpenClose = true;
	this.picText = null;
	this.openCloseButton = new Button( 2, 2, 20, 20 );
	this.openCloseButton.setCombinedPaint( rgb( 1, 0, 0 ) );
	this.openCloseButton.setCallback( this.openCloseCB, this );
	this.headerContainer.add( this.openCloseButton );
};

BrowserItem.prototype = Object.create( Component.prototype );
BrowserItem.prototype.constructor = BrowserItem;

BrowserItem.prototype.setLevel = function( newLevel ) {
	this.browserLevel = newLevel;
}

BrowserItem.prototype.setIndentStep = function( newVal ) {
	this.indentStep = newVal;
}

BrowserItem.prototype.setIndentOpenClose = function( newVal ) {
	this.indentOpenClose = newVal;
}

BrowserItem.prototype.addBrowser = function() {
	this.browser = new Browser( 0, this.getH(), 1, this.getH() );
	this.add( this.browser );
}

BrowserItem.prototype.getBrowser = function() {
	return this.browser;
}

BrowserItem.prototype.addControlArea = function( h ) {
	this.controlArea = new Frame( 0, this.getH(), 1, h );
	this.add( this.controlArea );
}

BrowserItem.prototype.getControlArea = function() {
	return this.controlArea;
}

BrowserItem.prototype.addPicText = function( newText ) {
	if ( this.picText !== null )
		this.headerContainer.removeChild( this.picTextComp );
	this.picText = null;
	if ( newText !== null ) {
		this.picText = newText;
		this.picTextComp = new Text( 0, .5, newText );
		this.picTextComp.setAlignment( ALIGN_CENTERED_RIGHT );
		this.headerContainer.add( this.picTextComp );
	}
}

BrowserItem.prototype.addBrowserItem = function( newItem, first ) {
	if ( this.browser === null )
		this.addBrowser();
	if ( first !== undefined && first )
		this.browser.addFirst( newItem );
	else
		this.browser.add( newItem );
	newItem.setLevel( this.browserLevel + 1 );
}

BrowserItem.prototype.addControl = function( newItem ) {
	if ( this.controlArea === null )
		this.addControlArea( 100 );  // might want to be cute about the height of this?
	this.controlArea.add( newItem );
}


BrowserItem.prototype.addCloseButton = function( tooltipStr ) {
	if ( this.buttonOffset === undefined )
		this.buttonOffset = this.headerH;
	else
		this.buttonOffset = this.buttonOffset + this.headerH - 8;
	this.closeButton = new Button( -this.buttonOffset, 3, this.headerH - 6, this.headerH - 6 );
	if ( tooltipStr !== undefined && tooltipStr !== null )
		this.closeButton.setTooltip( tooltipStr );
	this.closeButton.setCallback( this.closeButtonCB, this );
	this.closeButton.setCombinedPaint( rgb( 200, 200, 200 ) );
	this.closeButton.setLineWidth( 2 );
	this.closeButton.line1 = new LinePath( 0, 0, 1, 1 );
	this.closeButton.line1.setScaledDrawing( true );
	this.closeButton.line1.moveTo( 0.2, 0.2 );
	this.closeButton.line1.lineTo( 0.8, 0.8 );
	this.closeButton.add( this.closeButton.line1 );
	this.closeButton.line2 = new LinePath( 0, 0, 1, 1 );
	this.closeButton.line2.setScaledDrawing( true );
	this.closeButton.line2.moveTo( 0.2, 0.8 );
	this.closeButton.line2.lineTo( 0.8, 0.2 );
	this.closeButton.add( this.closeButton.line2 );
	this.headerContainer.add( this.closeButton );
}

BrowserItem.prototype.showCloseButton = function( isVisible ) {
	if ( isVisible ) {
		this.closeButton.forceVisible( true );
		this.closeButton.forceHandleEvents( true );
		this.closeButton.setVisible( true );
	}
	else {
		this.closeButton.forceVisible( false );
		this.closeButton.forceHandleEvents( false );
		this.closeButton.setVisible( false );
	}
}

BrowserItem.prototype.closeButtonCB = function( thisInstance ) {
	thisInstance.closeItem();
}

BrowserItem.prototype.closeItem = function() {
	if ( this.parent !== null )
		this.parent.remove( this );
	forceRedraw();
}

BrowserItem.prototype.addUpDownButtons = function( upTooltipStr, downTooltipStr ) {
	if ( this.buttonOffset === undefined )
		this.buttonOffset = this.headerH;
	else
		this.buttonOffset = this.buttonOffset + this.headerH - 8;
	this.upButton = new Button( -this.buttonOffset, 3, this.headerH - 6, this.headerH / 2 - 3 );
	this.upButton.setCombinedPaint( rgb( 200, 200, 200 ) );
	if ( upTooltipStr !== undefined && upTooltipStr !== null )
		this.upButton.setTooltip( upTooltipStr );
	this.upButton.setCallback( this.upButtonCB, this );
	this.upButton.tri = new FillPath( 0, 0, 1, 1 );
	this.upButton.tri.setScaledDrawing( true );
	this.upButton.tri.moveTo( 0.2, .9 );
	this.upButton.tri.lineTo( 0.5, 0.2 );
	this.upButton.tri.lineTo( 0.8, 0.9 );
	this.upButton.add( this.upButton.tri );
	this.headerContainer.add( this.upButton );
	this.downButton = new Button( -this.buttonOffset, this.headerH / 2, this.headerH - 6, this.headerH / 2 - 3 );
	this.downButton.setCombinedPaint( rgb( 200, 200, 200 ) );
	if ( downTooltipStr !== undefined && downTooltipStr !== null )
		this.downButton.setTooltip( downTooltipStr );
	this.downButton.setCallback( this.downButtonCB, this );
	this.downButton.tri = new FillPath( 0, 0, 1, 1 );
	this.downButton.tri.setScaledDrawing( true );
	this.downButton.tri.moveTo( 0.2, .1);
	this.downButton.tri.lineTo( 0.5, 0.8 );
	this.downButton.tri.lineTo( 0.8, 0.1 );
	this.downButton.add( this.downButton.tri );
	this.headerContainer.add( this.downButton );
}

BrowserItem.prototype.upButtonCB = function( thisInstance ) {
	thisInstance.moveItemUp();
}

BrowserItem.prototype.downButtonCB = function( thisInstance ) {
	thisInstance.moveItemDown();
}

BrowserItem.prototype.moveItemUp = function() {
	console.info( "move " + this.label + " up" );
}

BrowserItem.prototype.moveItemDown = function() {
	console.info( "move " + this.label + " down" );
}

BrowserItem.prototype.addHideButton = function( tooltipStr1, tooltipStr2 ) {
	if ( this.buttonOffset === undefined )
		this.buttonOffset = this.headerH;
	else
		this.buttonOffset = this.buttonOffset + this.headerH - 8;
	this.hideButton = new Button( -this.buttonOffset, 3, this.headerH - 6, this.headerH - 6 );
	this.hideTooltip = tooltipStr1;
	this.showTooltip = tooltipStr2;
	if ( tooltipStr1 !== undefined && tooltipStr1 !== null )
		this.hideButton.setTooltip( tooltipStr1 );
	this.hideButton.setCallback( this.hideButtonCB, this );
	this.hideButton.setCombinedPaint( rgb( 200, 200, 200 ) );
	this.hideButton.setLineWidth( 2 );
	this.hideButton.box = new FillPath( 0, 0, 1, 1 );
	this.hideButton.box.setScaledDrawing( true );
	this.hideButton.box.moveTo( 0.2, 0.2 );
	this.hideButton.box.lineTo( 0.8, 0.2 );
	this.hideButton.box.lineTo( 0.8, 0.8 );
	this.hideButton.box.lineTo( 0.2, 0.8 );
	this.hideButton.add( this.hideButton.box );
	this.hideButton.box.setVisible( false );
	this.hideButton.outline = new LoopPath( 0, 0, 1, 1 );
	this.hideButton.outline.setScaledDrawing( true );
	this.hideButton.outline.moveTo( 0.2, 0.2 );
	this.hideButton.outline.lineTo( 0.8, 0.2 );
	this.hideButton.outline.lineTo( 0.8, 0.8 );
	this.hideButton.outline.lineTo( 0.2, 0.8 );
	this.hideButton.add( this.hideButton.outline );
	this.headerContainer.add( this.hideButton );
	this.hiddenItem = false;
}

BrowserItem.prototype.hideButtonCB = function( thisInstance ) {
	if ( thisInstance.hiddenItem ) {
		thisInstance.hideButton.box.setVisible( false );
		if ( thisInstance.hideTooltip !== undefined && thisInstance.hideTooltip !== null )
			thisInstance.hideButton.setTooltip( thisInstance.hideTooltip );
	}
	else {
		thisInstance.hideButton.box.setVisible( true );
		if ( thisInstance.showTooltip !== undefined && thisInstance.showTooltip !== null )
			thisInstance.hideButton.setTooltip( thisInstance.showTooltip );
	}
	thisInstance.hiddenItem = !thisInstance.hiddenItem;
	thisInstance.hideItem( thisInstance.hiddenItem );
}

BrowserItem.prototype.hideItem = function( newVal ) {
	console.info( "hide " + this.label + " is " + newVal );
}

BrowserItem.prototype.setEditableLabel = function( newVal ) {
	if ( newVal ) {
		this.header = new TextInput( 0, 0, this.getW() - this.getH(), this.getH() );
		this.header.setText( this.label );
		this.header.getBackground().setFillPaint( rgba( 0, 0, 0, 0 ) );  //  transparent background
		this.header.setChangedValuePaint( rgba( 0, 0, 0, 0 ) );
	}
	else {
		this.header = new Text( 0, 0, label );
		this.header.setAlignment( ALIGN_CENTERED_RIGHT );
		this.header.setFillPaint( rgb( 0, 0, 0 ) );
	}
	this.headerBox.clear();
	this.headerBox.add( this.header );
	this.editableLabel = newVal;
};

BrowserItem.prototype.setLabel = function( newVal ) {
	this.label = newVal;
	this.header.setText( newVal );
	this.header.doRedraw();
};

BrowserItem.prototype.getLabel = function() {
	return this.header.getText();
}

BrowserItem.prototype.setHeader = function( newVal ) {
	var oldAlign = this.header.getAlignment();
	var oldPaint = this.header.getFillPaint();
	this.header = newVal;
	this.header.setAlignment( oldAlign );
	this.header.setFillPaint( oldPaint );
	this.headerBox.clear();
	this.headerBox.add( this.header );
};

BrowserItem.prototype.getHeader = function( newVal ) {
	return this.headerBox;
};


BrowserItem.prototype.draw = function( ins ) {
	this.iconWidth = 0;
	this.iconHeight = 0;
	this.indent = this.indentStep * this.browserLevel;
	if ( this.indentOpenClose )
		var buttonIndent = this.indent;
	else
		var buttonIndent = 0;
	if ( this.open ) {
		this.openIcon.resize( this.useDrawX + buttonIndent, this.useDrawY, this.openIcon.getW(), this.openIcon.getH() );
		this.iconWidth = this.openIcon.getW();
		this.iconHeight = this.openIcon.getH();
		this.openIcon.setVisible( true );
		this.closedIcon.setVisible( false );
	}
	else {
		this.closedIcon.resize( this.useDrawX + buttonIndent, this.useDrawY, this.closedIcon.getW(), this.closedIcon.getH() );
		this.iconWidth = this.closedIcon.getW();
		this.iconHeight = this.closedIcon.getH();
		this.openIcon.setVisible( false );
		this.closedIcon.setVisible( true );
	}
	if ( this.headerContainer.next !== null ) {
		this.openIcon.redraw( ins );
		this.closedIcon.redraw( ins );
	}
	var picWidth = 0;
	if ( this.picText !== null ) {
		picWidth = this.measureText( ins, this.picText ).width;
		this.picTextComp.setXY( this.indent + this.iconWidth, 0.5 );
	}
	if ( this.editableLabel )
		this.headerBox.resize( this.indent + picWidth + this.iconWidth - 10, 0, this.headerW, this.headerH );
	else
		this.headerBox.resize( this.indent + picWidth + this.iconWidth, 0, this.headerW, this.headerH );
	this.headerBox.redraw( ins );
	if ( this.children !== null ) {
		var child = this.children;
		while ( child !== null ) {
			child.setVisible( this.open );
			child.setHandleEvents( this.open );
			child = child.next;
		}
	}
	this.headerContainer.setVisible( true );
	this.headerContainer.setHandleEvents( true );
};

BrowserItem.prototype.getH = function() {
	if ( this.physicalChange ) {
		this.newH = this.headerH;
		if ( this.open ) {
			if ( this.children !== null ) {
				var child = this.children;
				while ( child !== null ) {
					var testH = child.getY() + child.getH();
					if ( testH > this.newH )
						this.newH = testH;
					child = child.next;
				}
			}
		}
		this.setPhysicalChange( false );
	}
	return this.newH;
}

BrowserItem.prototype.openCloseCB = function( thisInstance ) {
	thisInstance.changeOpen();
	thisInstance.openChange( null );
}

BrowserItem.prototype.openChange = function( event ) {
};

BrowserItem.prototype.changeOpen = function() {
	this.open = !this.open;
	this.setPhysicalChange( true );
};


BrowserItem.prototype.eventInside = function( event ) {
	if ( event.px < this.useDrawX )
		return false;
	if ( event.px > this.useDrawX + this.drawW )
		return false;
	if ( event.py < this.useDrawY )
		return false;
	if ( event.py > this.useDrawY + this.getH() )
		return false;
	return true;
};

BrowserItem.prototype.clear = function() {
	if ( this.headerContainer.next !== null ) {
		var child = this.headerContainer.next;
		while ( child !== null ) {
			child.previous = null;
			child.parent = null;
			tchild = child.next;
			child.next = null;
			child = tchild;
		}
	}
	this.headerContainer.next = null;
	this.lastChild = this.headerContainer;
};


function ScrollBar( x, y, w, h, label ) {
	Component.call( this, x, y, w, h, label );
	this.visible = false;
	this.horizontal = false;
	this.barWidth = 15;
	this.setLineWidth( 0.5 );
	this.setFillPaint( rgba( 1, 1, 1, 0.25 ) );
	this.verticalWidth = 0;
	this.range = 30;
	this.view = 10;
	this.offset = 0;
	this.inside = true;
	this.wheelMultiplier = 5;
	this.startBarPosition = null;
	this.barStart = null;
};

ScrollBar.prototype = Object.create( Component.prototype );
ScrollBar.prototype.constructor = ScrollBar;

ScrollBar.prototype.setHorizontal = function( newVal ) {
	this.horizontal = newVal;
};

ScrollBar.prototype.setBarWidth = function( newVal ) {
	this.barWidth = newVal;
};
ScrollBar.prototype.getBarWidth = function() {
	return this.barWidth;
};

ScrollBar.prototype.setPosition = function( newRange, newView, newOffset ) {
	this.range = newRange;
	this.offset = newOffset;
	this.view = newView;
	this.checkPosition();
};

ScrollBar.prototype.getOffset = function() {
	if ( this.barStart === null )
		return 0;
	if ( this.horizontal )
		return this.barStart * this.range / ( this.drawW - this.verticalWidth );
	else
		return this.barStart * this.range / this.drawH;
};

ScrollBar.prototype.checkPosition = function() {
	if ( this.barStart < 0 )
		this.barStart = 0;
	if ( this.horizontal ) {
		if ( this.barStart + this.barSize > this.drawW - this.verticalWidth )
			this.barStart = this.drawW - this.barSize - this.verticalWidth;
	}
	else {
		if ( this.barStart + this.barSize > this.drawH )
			this.barStart = this.drawH - this.barSize;
	}
};

ScrollBar.prototype.setVerticalWidth = function( newVal ) {
	this.verticalWidth = newVal;
} ;

ScrollBar.prototype.findSize = function() {	
	if ( this.horizontal ) {
		this.barStart = ( this.drawW - this.verticalWidth ) * this.offset / this.range;
		this.barSize = ( this.drawW - this.verticalWidth ) * this.view / this.range;
	}
	else {
		this.barStart = this.drawH * this.offset / this.range;
		this.barSize = this.drawH * this.view / this.range;
	}
}

ScrollBar.prototype.draw = function( ins ) {
	this.findSize();
	if ( this.horizontal ) {
		ins.ctx.beginPath();
		ins.ctx.moveTo( this.drawX, this.drawY + this.drawH - this.barWidth );
		ins.ctx.lineTo( this.drawX + this.drawW - this.verticalWidth, this.drawY + this.drawH - this.barWidth );
		ins.ctx.stroke();
		ins.ctx.beginPath();
		ins.ctx.moveTo( this.drawX + this.barStart, this.drawY + this.drawH - this.barWidth );
		ins.ctx.lineTo( this.drawX + this.barStart + this.barSize, this.drawY + this.drawH - this.barWidth );
		ins.ctx.lineTo( this.drawX + this.barStart + this.barSize, this.drawY + this.drawH );
		ins.ctx.lineTo( this.drawX + this.barStart, this.drawY + this.drawH );
		ins.ctx.closePath();
		ins.ctx.fill();
	}
	else {
		ins.ctx.beginPath();
		ins.ctx.moveTo( this.drawX + this.drawW - this.barWidth, this.drawY );
		ins.ctx.lineTo( this.drawX + this.drawW - this.barWidth, this.drawY + this.drawH );
		ins.ctx.stroke();
		ins.ctx.beginPath();
		ins.ctx.moveTo( this.drawX + this.drawW - this.barWidth, this.drawY + this.barStart );
		ins.ctx.lineTo( this.drawX + this.drawW - this.barWidth, this.drawY + this.barStart + this.barSize );
		ins.ctx.lineTo( this.drawX + this.drawW, this.drawY + this.barStart + this.barSize );
		ins.ctx.lineTo( this.drawX + this.drawW, this.drawY + this.barStart );
		ins.ctx.closePath();
		ins.ctx.fill();
	}
};

ScrollBar.prototype.moveInside = function( isInside ) {
	if ( isInside && this.inside === false ) {
		this.inside = true;
		this.setFillPaint( rgba( 1, 1, 1, 0.50 ) );
		this.doRedraw();
	}
	else if ( !isInside && this.inside === true ) {
		this.inside = false;
		this.startBarPosition = null;
		this.setFillPaint( rgba( 1, 1, 1, 0.25 ) );
		this.doRedraw();
	}
}

ScrollBar.prototype.isInside = function( x, y ) {
	if ( this.horizontal ) {
		if ( ( x > this.drawX + this.barStart ) &&
			 ( x < this.drawX + this.barStart + this.barSize ) &&
			 ( y > this.drawY + this.drawH - this.barWidth ) &&
			 ( y < this.drawY + this.drawH ) )
			 return true;
		else
			return false;
	}
	else {
		if ( ( x > this.drawX + this.drawW - this.barWidth ) &&
			 ( x < this.drawX + this.drawW ) &&
			 ( y > this.drawY + this.barStart ) &&
			 ( y < this.drawY + this.barStart + this.barSize ) )
			 return true;
		else
			return false;
	}
}

ScrollBar.prototype.handle = function( event ) {
	switch ( event.type ) {
		case MOUSE_PUSH:
			if ( this.isInside( event.px, event.py ) ) {
				this.startBarPosition = this.barStart;
				return true;
			}
			else
				this.startBarPosition = null;
			break;
		case MOUSE_MOVE:
			if ( this.isInside( event.px, event.py ) ) {
				this.moveInside( true );
			}
			else
				this.moveInside( false );
			break;
		case MOUSE_RELEASE:
			if ( !this.isInside( event.px, event.py ) )
				this.moveInside( false );
			break;
		case MOUSE_DRAG:
			if ( getLastEventComponent() === this ) {
				if ( this.startBarPosition !== null ) {
					if ( this.horizontal )
						this.barStart = this.startBarPosition + event.dragX;
					else
						this.barStart = this.startBarPosition + event.dragY;
					this.checkPosition();
					this.doCallback();
					event.drawing.doRedraw();
					return true;
				}
			}
			break;
		case MOUSE_WHEEL:
			if ( this.inside ) {
				if ( this.wheelMultiplier > 0 ) {
					this.barStart = this.barStart + this.wheelMultiplier * event.delta;
					this.checkPosition();
					this.doCallback();
					event.drawing.doRedraw();
					return true;
				}
			}
			break;
	}
	return false;
};
	
function ScrollArea( x, y, w, h, label ) {
	Component.call( this, x, y, w, h, label );
	this.setClip( true );
	this.drawArea = new Component( x, y, w, h );
	Component.prototype.add.call( this, this.drawArea );
	this.horizontalScroll = new ScrollBar( 0, 0, 1, 1 );
	this.horizontalScroll.setHorizontal( true );
	this.horizontalScroll.setCallback( this.horizontalCallback, this );
	Component.prototype.add.call( this, this.horizontalScroll );  // avoid our override of add()!
	this.verticalScroll = new ScrollBar( 0, 0, 1, 1 );
	this.verticalScroll.setCallback( this.verticalCallback, this );
	Component.prototype.add.call( this, this.verticalScroll );    // ditto above
	this.areaW = 0;
	this.areaH = 0;
	this.topOffset = 0;
	this.leftOffset = 0;
};

ScrollArea.prototype = Object.create( Component.prototype );
ScrollArea.prototype.constructor = ScrollArea;

ScrollArea.prototype.setArea = function( newW, newH ) {
	this.areaW = newW;
	this.areaH = newH;
};

ScrollArea.prototype.add = function( newComp ) {
	this.drawArea.add( newComp );
};

ScrollArea.prototype.clear = function() {
	this.areaW = 0;
	this.areaH = 0;
	this.drawArea.clear();
};

ScrollArea.prototype.getVerticalScroll = function() {
	return this.verticalScroll;
};
ScrollArea.prototype.setVerticalScroll = function( newScroll ) {
	this.verticalScroll = newScroll;
};
ScrollArea.prototype.getHorizontalScroll = function() {
	return this.horizontalScroll;
};
ScrollArea.prototype.setHorizontalScroll = function( newScroll ) {
	this.horizontalScroll = newScroll;
};

ScrollArea.prototype.verticalCallback = function( callObject ) {
	callObject.topOffset = callObject.verticalScroll.getOffset();
	callObject.drawArea.resize( -callObject.leftOffset - callObject.drawW, -callObject.topOffset - callObject.drawH,
		 callObject.areaW, callObject.areaH );
	callObject.doCallback();
};

ScrollArea.prototype.horizontalCallback = function( callObject ) {
	callObject.leftOffset = callObject.horizontalScroll.getOffset();
	callObject.drawArea.resize( -callObject.leftOffset - callObject.drawW, -callObject.topOffset - callObject.drawH,
		callObject.areaW, callObject.areaH );
	callObject.doCallback();
};

ScrollArea.prototype.findArea = function() {
	this.areaW = 0;
	this.areaH = 0;
	if ( this.drawArea.children !== null ) {
		var child = this.drawArea.children;
		while( child !== null ) {
			if ( child.getX() + child.getW() > this.areaW )
				this.areaW = child.getX() + child.getW();
			if ( child.getY() + child.getH() > this.areaH )
				this.areaH = child.getY() + child.getH();
			child = child.next;
		}
	}
}

ScrollArea.prototype.resizeHandler = function() {
	this.predraw( null );
	this.horizontalScroll.findSize();
	this.horizontalScroll.checkPosition();
	this.leftOffset = this.horizontalScroll.getOffset();
	this.drawArea.resize( -this.leftOffset - this.drawW, -this.topOffset - this.drawH, this.getW(), this.getH() );//this.areaW, this.areaH );
};

ScrollArea.prototype.predraw = function( ins ) {
	this.findArea();
	if ( this.areaW > this.drawW ) {
		this.horizontalScroll.setVisible( true );
		this.horizontalScroll.setPosition( this.areaW, this.drawW, this.leftOffset );
	}
	else
		this.horizontalScroll.setVisible( false );
	if ( Math.round( this.areaH ) > Math.round( this.drawH ) ) {
		this.verticalScroll.setVisible( true );
		this.horizontalScroll.setVerticalWidth( this.verticalScroll.getBarWidth() );
		this.verticalScroll.setPosition( this.areaH, this.drawH, this.topOffset );
	}
	else {
		this.verticalScroll.setVisible( false );
		this.horizontalScroll.setVerticalWidth( 0 );
		this.topOffset = 0;
	}
};

ScrollArea.prototype.rejectEvent = function( event ) {
	switch ( event.type ) {
	}
	return false;
};


testDrawing = new JDHDrawing( "testDraw" );
browserArea = new Component( 0, 0, 250, 1 );
testDrawing.add( browserArea );
browserArea.setClip( true );
browserArea.setFontSize( 14 );
browserTree = new Browser( 0, 0, 1, 1 );
browserArea.add( browserTree );
theTop = new BrowserItem( 0, 0, 1, 24, "top" );
theTop.addBrowser();
browserTree.add( theTop );
items = [];
for ( var i = 0; i < 10; ++i ) {
    items[i] = new BrowserItem( 0, 0, 1, 24, ( "Item " + i ) );
    theTop.addBrowserItem( items[i] );
}
items[2].addBrowser();
for ( var i = 0; i < 5; ++i )
    items[2].addBrowserItem( new BrowserItem( 0, 0, 1, 24, ( "Subitem " + i ) ) );
items[4].addControlArea( 100 );
button = new BoxButton( 25, 25, 200, 40, "Button" );
items[4].addControl( button );
browserTree.add( new BrowserItem( 0, 0, 1, 24, "another" ) );

resize();