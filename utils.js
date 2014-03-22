/* --------
   Utils.js

   Utility functions.
   -------- */
  
function startCompiler() {
	lexer();
	beginParse();
}

function trim(str)      // Use a regular expression to remove leading and trailing spaces.
{
	return str.replace(/^\s+ | \s+$/g, "");
	/*
	Huh?  Take a breath.  Here we go:
	- The "|" separates this into two expressions, as in A or B.
	- "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
    - "\s+$" is the same thing, but at the end of the string.
    - "g" makes is global, so we get all the whitespace.
    - "" is nothing, which is what we replace the whitespace with.
	*/

}

function rot13(str)     // An easy-to understand implementation of the famous and common Rot13 obfuscator.
{                       // You can do this in three lines with a complex regular experssion, but I'd have
    var retVal = "";    // trouble explaining it in the future.  There's a lot to be said for obvious code.
    for (var i in str)
    {
        var ch = str[i];
        var code = 0;
        if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0)
        {
            code = str.charCodeAt(i) + 13;  // It's okay to use 13.  It's not a magic number, it's called rot13.
            retVal = retVal + String.fromCharCode(code);
        }
        else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0)
        {
            code = str.charCodeAt(i) - 13;  // It's okay to use 13.  See above.
            retVal = retVal + String.fromCharCode(code);
        }
        else
        {
            retVal = retVal + ch;
        }
    }
    return retVal;
}

function getNextChar() {
	if (_Index != _Code.length) {
		return _Code[index + 1];	
	}
}

$(document).ready(function() {

	//JQuery for toggles
	//Overall verbose on and off
	$( "#toggleVerbose" ).change(function() {
		console.log("Hello1");
	  if (_Verbose) {
	  	console.log("Hello");
	  	_Verbose = false;
	  	_JustLexVerbose = false;
	  	_JustParseVerbose = false;
	  	$("#toggleLexVerbose").prop('checked', false);
	  	$("#toggleParseVerbose").prop('checked', false);
	  }
	  else if (!_Verbose) {
	  	_Verbose = true;
	  	_JustLexVerbose = true;
	  	_JustParseVerbose = true;
	  	$("#toggleLexVerbose").prop('checked', true);
	  	$("#toggleParseVerbose").prop('checked', true);
	  }
	});
	
	//Toggle Lex Verbose Output
	$( "#toggleLexVerbose" ).change(function() {
	  if (_JustLexVerbose) {
	  	_JustLexVerbose = false;
	  }
	  else if (!_JustLexVerbose) {
	  	_JustLexVerbose = true;
	  }
	});

});

//Toggle Parse Verbose Output
$( "#toggleParseVerbose" ).change(function() {
  if (_JustParseVerbose) {
  	_JustParseVerbose = false;
  }
  else if (!_JustParseVerbose) {
  	_JustParseVerbose = true;
  }
});

//Creates a new token
function tokenObject (type, value, lineNumber) {
	this.type = type;
	this.value = value;
	this.lineNumber = lineNumber;
	this.index = _TokenArray.length + 1;
}

// function checkForExisitingIdentifier() {
	// for (var i = 0; i < _TokenArray.length; i++) {
		// if ($.inArray(token, _TokenArray[i].value) != -1) {
			// console.log("Identifier- " + token + " -already in array");
			// _IdentifierExists = true;
		// }
	// }
// }

function printTokenArray () {
	console.log("Token Array: " + _TokenArray);
	
	document.getElementById("taOutput").value += "\tAll Tokens:\n";
	_TokenCount = _TokenArray.length; //Sets token count
	console.log("Token Count = " + _TokenCount);
	for (var i = 0; i < _TokenArray.length; i++) {
		document.getElementById("taOutput").value += "\n\tType: " + _TokenArray[i].type + ",  Value: " + _TokenArray[i].value +  "\n";	
	}
	
}

//Used in parse
function getNextToken() {
	var nextTokenToParse = "T_EOF";
	if (_TokenIndex < _TokenArray.length) {
		nextTokenToParse = _TokenArray[_TokenIndex];
		_TokenIndex++;
	}
	console.log("getNextToken is returning: " + nextTokenToParse.value);
	return nextTokenToParse;
}

function test1 () {
	
		document.getElementById("taSourceCode").value = "{\nprint (" + " \"hello\" " + ")\n}" + "\n$";	
}

function test2 () {
	 
		document.getElementById("taSourceCode").value = "{\nprint (" + " \"hello\" " + ")\n}" + "\n$";	
}