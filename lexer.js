/* lexer.js  */


    function lex()
    {
        // Grab the "raw" source code.
        var sourceCode = document.getElementById("taSourceCode").value;
        // Trim the leading and trailing spaces.
        sourceCode = trim(sourceCode);
        // TODO: remove all spaces in the middle; remove line breaks too.
        return sourceCode;
    }
        
    var unrecognizedSymbol = false;
    var endOfFileReached = false;
    var openQuote = false;
    var openParen = false;
    var openBracket = false;
    var isEqualityOperator = false;
    var duplicateToken = false;
    var whiteSpaceCount = 0; //Keeps track of extra spaces and skips over them
    
    function test() {
    	document.getElementById("taOutput").value = "";
    	document.getElementById("taOutput").value += "Lexing in Process:";
    	
        _Code = document.getElementById("taSourceCode").value;
        //_Code += " ";
        //code.trim();
        //code = code.split("");
        //console.log("Source Code: " + code);
        
        
        //**************
        //code = code.match(/[^\s]+/g);
        console.log("Source Code: " + _Code);
		var token = "";
		var sourceCodeLengthMinusOne = _Code.length - 1;
		console.log("Source Code Length minus 1 = " + sourceCodeLengthMinusOne);
        
        var i = 0;
        for (i = 0; i < _Code.length; i++) {
        	//console.log("i = " + i);
        	
        	//RegEx
        	var character = /[a-z]/;
        	var alphaNumeric = /[a-z]+[a-z0-9]*/;
        	var digit = /[0-9]+/;
        	var space = /[\s]/;
        	var newLine = /[\n]/;
        	var endOfFile = /[\$]/;
        	var brackets = /[\{\}]/;
        	var parens = /[\(\)]/;
        	var equalsSign = /[\=]/;
        	var quote = /[\"]/;
        	var stringExpr = /[\"alphaNumeric\"]/;
        	var notEqual = /[\!]/;
        	var plusSign = /[\+]/;
        	
        	//Checks char for character match
        	if (_Code[i].match(character)) {
        		token += _Code[i];
        		//console.log("Token = " + token);
        	}
        	//Checks char for alphanumeric match
        	else if (_Code[i].match(alphaNumeric)) {
        		token += _Code[i];
        	}
        	//Checks char for brackets match
        	else if (_Code[i].match(brackets)) {
        		token += _Code[i];
        		//Bracket reached, process token before the bracket(there was no space between token and bracket) or bracket
        		checkForKeyword(token);
        		token = _Code[i+1];
        	}
        	//Checks for digit, then checks if token is an alpha numeric or just one or more digits
        	else if (_Code[i].match(digit)) {
        		if (token.match(alphaNumeric)) {
        			token += _Code[i];	
        		}
        		else {
        			token += _Code[i];       			
        		}        		
        	}
        	//Checks char for paren match
        	else if (_Code[i].match(parens)) {
         		//Paren reached, process token before the paren(there was no space between token and paren) or paren
        		checkForKeyword(token);
        		token = _Code[i];       		
        	}
        	else if (_Code[i].match(equalsSign)) {
        		//peek ahead to check for double equal
        		if (_Code[i+1].match(equalsSign)) {
         			isEqualityOperator = true;
         			//= reached, process token before the =(there was no space between token and =) or =
        			checkForKeyword(token);
        			token = _Code[i] + _Code[i+1];
        			i++; //prevents processing the second equal sign a second time       			
        		}
        		else {
         			//= reached, process token before the =(there was no space between token and =) or =
        			checkForKeyword(token);
        			token = _Code[i];       			
        		}
        	}
        	else if (_Code[i].match(quote)) {
        		token += _Code[i];
        		i +=1;
        		while (!_Code[i].match(quote) && !(i === sourceCodeLengthMinusOne)) {
        			token += _Code[i++];
        			console.log("Building token " + token);
        		}
        		token += "\"";
        		checkForKeyword(token);
        	}
        	else if (_Code[i].match(notEqual)) {
        		//peek ahead to check for equal sign
        		if (_Code[i+1].match(equalsSign)) {
         			//= reached, process token before the =(there was no space between token and =) or =
        			checkForKeyword(token);
        			token = _Code[i] + _Code[i+1];
        			i++; //prevents processing the second equal sign a second time       			
        		}
        		else {
					unrecognizedSymbol = true;
					errors();       			
        		}        		
        	}
        	else if (_Code[i].match(plusSign)) {
        		token += _Code[i];
        		checkForKeyword(token);
        		//token = _Code[i]; 
        		       		        		
        	}
        	else if (_Code[i].match(endOfFile)) {
        		//token += _Code[i];
        		checkForKeyword(token);
        		token = _Code[i];
        		endOfFileReached = true;
        	}
        	//If char matches a space, newline, process token
        	else if (_Code[i].match(space || newLine) || i === sourceCodeLengthMinusOne) {
        		checkForKeyword(token);
        		console.log("Token Array: " + _TokenArray);
        		token = "";
        		
        		if (_Code[i].match(newLine)) {
        			_LineNumber++;
        		}
        		if (_Code[i].match(endOfFile)) {
        			endOfFileReached = true;
        		}
        	}
        	else {
        		console.log("Unrecognized");
        		unrecognizedSymbol = true;
				errors();
        		
        	}
        	
        }
        
        warnings();
        
        //Checks if the token is a keyword
        function checkForKeyword(token) {
        	var keywordArray = ["print", "while", "if", "int", "string", "boolean", "true", "false"];
        	
        	//TODO:Store in _TokenArray as T_ID, T_PRINT, etc
        	
        	//jQuery to see if token is in keywordArray
        	if ($.inArray(token.toString(), keywordArray) != -1) {
        		console.log("The token " + token + " is a keyword");
        		_TokenArray.push(token);
        		token = "";
        		console.log("Token value " + token);
        	}
        	else if (token.match(character) && token.length > 1) { //If token is not a keyword
        		unrecognizedSymbol = true;
				errors();
        	}
        	else {
        		console.log("Token " + token + " is not a keyword");
        		describeType(token);
        		token = "";
        		
        	}
        	        	
        }
        //If token is not a keyword, describe what it is
        function describeType(token) {
        	//Check for identifier
        	if (token.match(alphaNumeric) && !token.match(quote)) { //add \g ?
        		console.log ("Token " + token + " is an identifier");
        		_TokenArray.push(token);
        		token = "";        		
        	}
        	//Check for bracket
        	else if (token.match(brackets)) {
        		if (!openBracket) {
        			console.log ("Token " + token + " is an open bracket");
        			_TokenArray.push(token);
        			token = "";   
        			openBracket = true;     			
        		}
        		else {
         			console.log ("Token " + token + " is a closing bracket");
        			_TokenArray.push(token);
        			token = "";   
        			openBracket = false;        			
        		}
          		
        	}
        	else if (token.match(digit)) {
        		console.log ("Token " + token + " is a digit");
        		_TokenArray.push(token);
        		token = "";        		
        	}
        	else if (token.match(parens)) {
        		if (!openParen) {
         			console.log ("Token " + token + " is an open paren");
        			_TokenArray.push(token);
        			token = "";   
        			openParen = true;       			
        		}
        		else {
         			console.log ("Token " + token + " is a closing paren");
        			_TokenArray.push(token);
        			token = "";   
        			openParen = false;        			
        		}
        	}
        	else if (token.match(equalsSign) && !token.match(notEqual)) {
        		
        		if (!isEqualityOperator) {
         			console.log ("Token " + token + " is an assignment operator");
        			_TokenArray.push(token);
        			token = "";       			
        		}
        		else {
          			console.log ("Token " + token + " is an equality operator");
        			_TokenArray.push(token);
        			token = "";   
        			isEqualityOperator = false;     			
        		}
        		
        	}
        	else if (token.match(stringExpr)) {
           		console.log ("Token " + token + " is an string expression");
        		_TokenArray.push(token);       		
        	}
        	else if (token.match(notEqual)) {
            	console.log ("Token " + token + " is a not equal sign");
        		_TokenArray.push(token);       		
        	}
        	else if (token.match(plusSign)) {
            	console.log ("Token " + token + " is a plus sign");
        		_TokenArray.push(token);        		
        	}
        	else if (token.match(endOfFile)) {
        		console.log ("Token " + token + " is the EOF marker");
        		_TokenArray.push(token);
        		token = "";
        		endOfFileReached = true;
        	}

        }
        
	function warnings() {
	
		//Warns of excess code after EOF marker
		if (endOfFileReached) {
			console.log("WARNING: There is stuff after the EOF marker, this will be ignored.");
			document.getElementById("taOutput").value += "\n\n\tWARNING: There is stuff after the EOF marker, this will be ignored.";
		}
	
		//Warns if EOF was reached without reading a $. Inserts $
		if (!endOfFileReached) {
			console.log("WARNING: EOF was reached without the use of '$'. I have inserted this symbol for you.");
			document.getElementById("taOutput").value += "\n\n\tWARNING: EOF was reached without the use of '$'. I have inserted this symbol for you.";
		
			var code2 = document.getElementById("taSourceCode").value;
			code2 += "\n$";
			document.getElementById("taSourceCode").value = code2;
		}	
	}

	function errors() {
		//Syntax Error
		if (unrecognizedSymbol) {
			console.log("ERROR: Syntax error on line " + _LineNumber + " There was an unrecognized symbol  " + token);//_Code[i]);
   		    document.getElementById("taOutput").value += "\n\tSyntax error on line " + _LineNumber + " There was an unrecognized symbol  " + token;
        			
      	    i = _Code.length + 1; //Stops loop
		}
	
		if (openQuote) {
			console.log("Unended String");
    	    document.getElementById("taOutput").value += "\n\tERROR: Unended String";		
		}
	
		if (openParen) {
			console.log("Unended expression");
   	        document.getElementById("taOutput").value += "\n\tERROR: Unended expression";		
		}
	}
        //**************
        
        
        /*    
        
        var matrix = [[{"a":8, "b":30, "c":8, "d":8, "e":8, "f":39, "g":8, "h":8, "i":16, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":3, "q":8, "r":8, "s":24, "t":44, "u":8, "v":8, "w":11, "x":8, "y":8, "z":8, "0":37, "1":37, "2":37, "3":37, "4":37, "5":37, "6":37, "7":37, "8":37, "9":37, "=":9, "+":48, "!":38, "{":1, "}":2, "(":20, ")":21, "\"":18, "$":49}],
        			  [{" ": 'T_LBRACKET', "\n":'T_LBRACKET'}],
        			  [{" ": 'T_RBRACKET', "\n":'T_RBRACKET'}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":4, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":5, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":6, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":7, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8, "(":51, " ":'T_PRINT', "\n":'T_PRINT'}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8, "\"":50, " ":'T_ID', "\n":'T_ID'}],
        			  [{"=":10, " ": 'T_ASSIGN'}],
        			  [{" ": 'T_EQUAL'}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":12, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":13, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":14, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":15, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8, " ":'T_WHILE', "\n":'T_WHILE'}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":17, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":22, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8, " ":'T_IF', "\n":'T_IF'}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8," ": 'T_QUOTE', "\n":'T_QUOTE'}],
        			  ["Placeholder"],
        			  [{" ": 'T_OPENPAREN', "\n":'T_OPENPAREN'}],
        			  [{" ": 'T_CLOSEPAREN', "\n":'T_CLOSEPAREN'}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":23, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8, " ":'T_INT', "\n":'T_INT'}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":25, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":26, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":27, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":28, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":29, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8, " ":'T_STRING', "\n":'T_STRING'}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":31, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":32, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":33, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":34, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":35, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":36, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8, " ":'T_BOOLEAN', "\n":'T_BOOLEAN'}],
					  [{" ":'T_DIGIT', "\n":'T_DIGIT'}],
					  [{"=":10}],
					  [{"a":40, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":41, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":42, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":43, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8, " ":'T_FALSE', "\n":'T_FALSE'}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":45, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":46, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":47, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8, " ":'T_TRUE', "\n":'T_TRUE'}],
					  [{" ":'T_PLUS', "\n":'T_PLUS'}],
					  [{" ":'T_EOF', "\n":'T_EOF', "":'T_EOF'}],
					  [{" ":'T_STRINGEXP', "\n":'T_STRINGEXP'}],
					  [{" ": 'T_PRINT, T_RPAREN'}]
        			 ];
         //T_StringEXP === line 50        
        var token = "";
        var j = 0;
        
        for (var i = 0; i < code.length; i++ ) {
        	var element = code[i];
        	duplicateToken = false;
        	
        	//console.log("i = " + i);
        	console.log("j = " + j);
        	if (element != " " && element != "\n") {
        		//Set whiteSpaceCount back to 0
        		whiteSpaceCount = 0;
        		console.log("Element to check alphabet for " + element);
        		document.getElementById("taOutput").value += "\n\tChecking alphabet for " + element;
        	}
        	
        	//If not white space progress through the matrix
        	if (element != " " && element !="\n" && element != "$" && !endOfFileReached) {
        		console.log("j = " + j);
        		if (element in matrix[j][0]) {
        		
        			var nextState = matrix[j][0][element];
        			console.log("Next State " + nextState);
        		
        			console.log("Element " + element + " is in alphabet and points to the next state " + nextState );
        			document.getElementById("taOutput").value += "\n\t\t" + element + " found ";
        			
        			//Sets j to the next state that the DFA should visit
        			j = nextState;
        			        		
        			//Builds the token
        			token += element;
        			//console.log("Token after processing each element" + token);
        		}
        		//Handles unrecognized symbols
        		else {
        			unrecognizedSymbol = true;
					errors();
        		}
	
        	}
        	//When whitespace or newline is encountered
        	else {
        		whiteSpaceCount ++;
        		
        		//If the whitespace count is higher than one, disregard them
        		if (whiteSpaceCount === 1) {
        			//Set the token type (T_ID, T_PRINT, etc.)
        			//console.log("Element " + j);
					var type = matrix[j][0][element];
					console.log("Type " + type);
				
					//Check if quotation is an open quote or a closing quote using a global boolean variable: openQuote
					if (type == "T_QUOTE" && openQuote) {
						type = "T_CLOSEQUOTE";
						openQuote = false;
					}
					else if (type == "T_QUOTE" && !openQuote) {
						type = "T_OPENQUOTE";
						openQuote = true;
					}
					
					//Keeps track of open and closed parenthesis
					if (type == "T_OPENPAREN" && !openParen) {
						openParen = true;
					}
					else if (type == "T_CLOSEPAREN" && openParen) {
						openParen = false;
					}
				
					//Check if there is ! before = sign, if there is set type to T_NOTEQUAL
					if (type == "T_EQUAL" && token.length > 1) {
						type = "T_NOTEQUAL";
					}
					
					if (type == "T_PRINT" && token === "print(") {
						openParen = true;
						duplicateToken = true;
						var splitToken = token.split("(");
						newToken(type, splitToken[0]);
						newToken("T_OPENPAREN", "(");
					}
				
					//Check for EOF
					if (element === "$") {
						token = element;
						type = "T_EOF";
						endOfFileReached = true;	
					}
						
        			//console.log("Here is your token and type: <" + type + " , " + token + ">");
        			//document.getElementById("taOutput").value += "\n\n\tToken created: <" + type + " , " + token + ">\n";
        		
        			//Type check prevents extra spaces from becoming undefined tokens and stops duplicate tokens from being created
        			if (type != undefined && !duplicateToken) {
        				//TODO:push to token array
        				newToken(type, token);
        				//TODO:increment token count
        				tokenCount++;
        			}
        			
					//Throw warning if there is anything after $
					if (endOfFileReached) {
						i = code.length + 1; //Stops loop
						warnings();
					}
				
					//Throw a warning if EOF was reached without the use of a $
					if (i === code.length-1 && !endOfFileReached) {
						warnings();
					}
					
					//If newline, increment line count
					if (element === "\n") {
						lineNumber++;
					}
        		
        			token = ""; //Clear out previous token
  	    			j = 0; //reset the DFA to state zero       			
        			
        		}
        		//No else, if whiteSpaceCount > 1 just keep moving through the source code until a non whitespace element is reached   	    		
        		
        	}
        } 
        //Check for open strings and expressions
        errors(); 
        document.getElementById("taOutput").value += "\n\nLexing Complete";
        
        console.log(tokenArray); //Prints out token array
    }
    
    
function newToken(type, token) {
	var newToken = "<" + type + " , " + token + ">";
	
	tokenArray.push(newToken);
    console.log("Here is your token and type: <" + type + " , " + token + ">");
    document.getElementById("taOutput").value += "\n\n\tToken created: <" + type + " , " + token + ">\n";
	
}
    

function warnings() {
	
	//Warns of excess code after EOF marker
	if (endOfFileReached) {
		console.log("WARNING: There is stuff after the EOF marker, this will be ignored.");
		document.getElementById("taOutput").value += "\n\n\tWARNING: There is stuff after the EOF marker, this will be ignored.";
	}
	
	//Warns if EOF was reached without reading a $. Inserts $
	if (!endOfFileReached) {
		console.log("WARNING: EOF was reached without the use of '$'. I have inserted this symbol for you.");
		document.getElementById("taOutput").value += "\n\n\tWARNING: EOF was reached without the use of '$'. I have inserted this symbol for you.";
		
		var code2 = document.getElementById("taSourceCode").value;
		code2 += "\n\n$";
		document.getElementById("taSourceCode").value = code2;
	}	
}

function errors() {
	//Syntax Error
	if (unrecognizedSymbol) {
		console.log("ERROR: Syntax error on line " + lineNumber);
        document.getElementById("taOutput").value += "\n\tSyntax error on line " + lineNumber;
        			
        i = code.length + 1; //Stops loop
	}
	
	if (openQuote) {
		console.log("Unended String");
        document.getElementById("taOutput").value += "\n\tERROR: Unended String";		
	}
	
	if (openParen) {
		console.log("Unended expression");
        document.getElementById("taOutput").value += "\n\tERROR: Unended expression";		
	}
	
	*/
}
