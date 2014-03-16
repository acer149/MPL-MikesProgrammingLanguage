/* lexer.js  */

function lex() {
	// Grab the "raw" source code.
	var sourceCode = document.getElementById("taSourceCode").value;
	// Trim the leading and trailing spaces.
	sourceCode = trim(sourceCode);
	// TODO: remove all spaces in the middle; remove line breaks too.
	return sourceCode;
}

var unrecognizedSymbol = false;
var endOfFileReached = false;
var thereIsStuffAfterEOF = false;
var openQuote = false;
//var openParen = false;
//var openBracket = false;
var isEqualityOperator = false;
var duplicateToken = false;
var whiteSpacesInARowCount = 0; //Keeps track of extra spaces that are in a row
var newLinesInARowCount = 0; //Keeps track of extra newLines that are consecutive

//RegEx
var character = /[a-z]/;
var alphaNumeric = /[a-z]+[a-z0-9]*/;
var digit = /[0-9]+/;
var space = /[\s]/;
var newLine = /[\n]/;
var endOfFile = /[\$]/;
var brackets = /[\{\}]/;
var parens = /[\(\)]/;
var openBracket = /[\{]/;
var closeBracket = /[\}]/;
var openParen = /[\(]/;
var closeParen = /[\)]/;
var equalsSign = /[\=]/;
var quote = /[\"]/;
var stringExpr = /[\"character*\"]/;
var notEqual = /[\!]/;
var plusSign = /[\+]/;

var token = "";

function lexer() {
	document.getElementById("taOutput").value = "";
	document.getElementById("taOutput").value += "*****LEXER*****\n\n";
	document.getElementById("taOutput").value += "Lexing in Process: \n\n";
	if (!_Verbose || !_JustLexVerbose) {
		document.getElementById("taOutput").value += "\tLexing Output Hidden \n\n";	
	}

	_Code = document.getElementById("taSourceCode").value;
	//_Code += " ";
	//code.trim();
	_Code = _Code.split("");
	//console.log("Source Code: " + code);

	//**************
	//code = code.match(/[^\s]+/g);
	console.log("Source Code: " + _Code);
	var sourceCodeLengthMinusOne = _Code.length - 1;
	//console.log("Source Code Length minus 1 = " + sourceCodeLengthMinusOne);

	//var q = 0;
	while (_Index < _Code.length) {
		//console.log("i = " + i);
		
		//If _Verbose is true print to console message with the current symbol being processed
		//Check for spaces and new lines separately to avoid printing a message with a black symbol 
		//(because spaces and newlines don't have visible representations)
		if (_Verbose && _JustLexVerbose) {
			if (_Code[_Index].match(space) && !_Code[_Index].match(newLine)) {
				document.getElementById("taOutput").value += "\tProcessing Symbol \\s \n\n";
			}
			else if(_Code[_Index].match(space) && _Code[_Index].match(newLine)) {
				document.getElementById("taOutput").value += "\tProcessing Symbol \\n \n\n";
			}
			else {
				document.getElementById("taOutput").value += "\tProcessing Symbol " + _Code[_Index] + "\n\n";
			}	
		}
		//console.log("Processing Symbol " + _Code[_Index]);
		//Checks char for character match
		if (_Code[_Index].match(character)) {
			token = _Code[_Index];
			checkTokenType(token);
			//console.log("Token = " + token);
		}
		//Checks char for brackets match
		else if (_Code[_Index].match(brackets)) {
			token = _Code[_Index];
			checkTokenType(token);
		}
		//Checks for digit
		else if (_Code[_Index].match(digit)) {
			token = _Code[_Index];
			checkTokenType(token);
		}
		//Checks char for paren match
		else if (_Code[_Index].match(parens)) {		
			token = _Code[_Index];
			checkTokenType(token);

		} 
		//Checks for equal sign
		else if (_Code[_Index].match(equalsSign)) {
			//peek ahead to check for double equal
			if (_Code[_Index + 1].match(equalsSign)) {
				isEqualityOperator = true;
				token = _Code[_Index] + _Code[_Index + 1];
				checkTokenType(token);
				_Index++; //prevents processing the second equal sign a second time
			} 
			else {
				token = _Code[_Index];
				checkTokenType(token);
			}
		} 
		//Checks for quote, if found creates a string expression token
		else if (_Code[_Index].match(quote)) {
			openQuote = true;
			token = _Code[_Index];
			_Index += 1;
			while (!_Code[_Index].match(quote) && !(_Index === sourceCodeLengthMinusOne)) {
				if (_Verbose && _JustLexVerbose) {
					document.getElementById("taOutput").value += "\tProcessing Symbol " + _Code[_Index] + "\n\n";
				}
				//Checks for digit in string error
				if (_Code[_Index].match(digit)) {
					document.getElementById("taOutput").value += "\tERROR: Strings cannot contain digits \n\n";
					_Index += _Code.length;//Kills lexer
				}
				token += _Code[_Index++];
				//console.log("Building token " + token);
				//_Index +=1;
			}
			//Matches end quote so set openQuote to false
			if (_Code[_Index].match(quote)) {
				openQuote = false;
			}
			if (_Verbose && _JustLexVerbose && !openQuote) {
				document.getElementById("taOutput").value += "\tProcessing Symbol \"\n\n";
			}
			//Only do this if there is a closing quote
			if (!openQuote) {
				token += "\"";
				checkTokenType(token);	
			}
		} 
		//Checks for not equal
		else if (_Code[_Index].match(notEqual)) {
			//peek ahead to check for equal sign
			if (_Code[_Index + 1].match(equalsSign)) {
				checkTokenType(token);
				token = _Code[_Index] + _Code[_Index + 1];
				_Index++; //prevents processing the equal sign a second time
			} 
			//Throw a syntax error if a ! is processed without a trailing = 
			else {
				unrecognizedSymbol = true;
				errors();
			}
		} 
		//Checks for plus sign
		else if (_Code[_Index].match(plusSign)) {
			token = _Code[_Index];
			checkTokenType(token);

		} 
		//Checks for EOF marker
		else if (_Code[_Index].match(endOfFile)) {
			token = _Code[_Index];
			checkTokenType(token);
			endOfFileReached = true;
		}
		//Checks for newline
		else if (_Code[_Index].match(newLine)) {
			_LineNumber++;
			newLinesInARowCount = 0; //Reset
			var tmpIndexHolder = _Index;
			//console.log("tmpIndexHolder before while loop: " + tmpIndexHolder);
			
			//While a newline is matched, continue looping. Then add the new line count to the index to skip over them
			while (_Code[tmpIndexHolder].match(newLine)) { //&& !(tmpIndexHolder === sourceCodeLengthMinusOne)) {
				newLinesInARowCount +=1;
				tmpIndexHolder++;
			}
			_Index += (newLinesInARowCount - 1); //Subtract one to avoid off by one error. Main while loop will increment _Index as well
		}
		//Checks for EOF
		else if (_Code[_Index].match(endOfFile)) {
			endOfFileReached = true;
		}
		//Checks for whitespace
		else if (_Code[_Index].match(space)) {
			var tmpIndexHolder = _Index;
			whiteSpacesInARowCount = 0; //Reset
			//console.log("tmpIndexHolder before while loop: " + tmpIndexHolder);
			
			//While a space is matched, continue looping. Then add the white space count to the index to skip over them
			while (_Code[tmpIndexHolder].match(space)) { //&& !(tmpIndexHolder === sourceCodeLengthMinusOne)) {
				whiteSpacesInARowCount +=1;
				tmpIndexHolder++;
			}
			_Index += (whiteSpacesInARowCount - 1); //Subtract one to avoid off by one error. Main while loop will increment _Index as well
			//console.log("tmpIndexHolder after while loop: " + tmpIndexHolder);
			//console.log("Index after while loop: " + _Index);	
		} 
		//Unrecognized symbol, throw error
		else {
			console.log("Unrecognized");
			token = _Code[_Index];
			unrecognizedSymbol = true;
			errors();
		}
		_Index++;
	}
	
	if (!endOfFileReached) {
		_TokenArray.push(new tokenObject("T_EOF", "$"));
	}
	
	printTokenArray();
	token = "";
	//warnings();

	if (!unrecognizedSymbol && !endOfFileReached) {
		warnings();
	}
	if (openQuote) {
		errors();
	}

	//**************
}


//Checks if the token is a keyword, if not move to describeToken
function checkTokenType(token) {
	var keywordArray = ["print", "while", "if", "int", "string", "boolean", "true", "false"];
	var firstLetterOfkeywordsArray = ["p", "w", "i", "s", "b", "t", "f"];
	var charLookAhead = 0;

	//If token matches the first letter of any keywords, look ahead based on length of the keyword
	//to determine if it is one
	if ($.inArray(token.toString(), firstLetterOfkeywordsArray) != -1) {
		if (token === "p" || token === "w" || token === "f") {
			charLookAhead = 4;
		} 
		else if (token === "i") {
			if (_Code[_Index + 1] === "n") {
				charLookAhead = 2;
			} 
			else {
				charLookAhead = 1;
			}
		} 
		else if (token === "s") {
			charLookAhead = 5;
		} 
		else if (token === "b") {
			charLookAhead = 6;
		} 
		else if (token === "t") {
			charLookAhead = 3;
		}

		for (var y = 1; y <= charLookAhead; y++) {
			if (_Verbose && _JustLexVerbose) {
				document.getElementById("taOutput").value += "\tProcessing Symbol " + _Code[_Index + y] + "\n\n";
			}
			token += _Code[_Index + y];
			//console.log("Building potential keyword: " + token);
		}
		
		var keywordType = token;
		
		//jQuery to see if token is in keywordArray
		if ($.inArray(token.toString(), keywordArray) != -1) {
			//console.log("The token " + token + " is a keyword");
			if (_Verbose && _JustLexVerbose) {
				document.getElementById("taOutput").value += "\t\tToken created: " + token + "\n\n";
			}
			//Switch assigns a specific type to each keyword
			switch(keywordType) {
				case "print": {
					_TokenArray.push(new tokenObject("T_Print", token));
					break;
				}
				case "while": {
					_TokenArray.push(new tokenObject("T_While", token));
					break;
				}
				case "if": {
					_TokenArray.push(new tokenObject("T_If", token));
					break;
				}
				case "int": {
					_TokenArray.push(new tokenObject("T_Int", token));
					break;
				}
				case "string": {
					_TokenArray.push(new tokenObject("T_String", token));
					break;
				}
				case "boolean": {
					_TokenArray.push(new tokenObject("T_Boolean", token));
					break;
				}
				case "true": {
					_TokenArray.push(new tokenObject("T_True", token));
					break;
				}
				case "false": {
					_TokenArray.push(new tokenObject("T_False", token));
					break;
				}
				default: {
					break;
				}
			}
			//_TokenArray.push(new tokenObject("T_Keyword", token));
			token = "";
			//console.log("Token value " + token);
			_Index += charLookAhead;
		}
	} 
	else {//If token is not a keyword
		//console.log("Token " + token + " is not a keyword");
		describeType(token);
		token = "";

	}

}

//If token is not a keyword, describe what it is
function describeType(token) {
	//Check for identifier
	if (token.match(character) && !token.match(quote)) {//add \g ?
		//console.log("Token " + token + " is an identifier");
		
		if (_Verbose && _JustLexVerbose) {
			document.getElementById("taOutput").value += "\t\tToken created: " + token + "\n\n";
		}
			
		_TokenArray.push(new tokenObject("T_Id", token));
		token = "";
		//console.log("Index: " + _Index);
	}
	//Check for bracket
	else if (token.match(brackets)) {
		if (token.match(openBracket)) {
			//console.log("Token " + token + " is an open bracket");
			
			if (_Verbose && _JustLexVerbose) {
				document.getElementById("taOutput").value += "\t\tToken created: " + token + "\n\n";
			}
			
			_TokenArray.push(new tokenObject("T_OpenBracket", token));
			token = "";
			//openBracket = true;
		} 
		else {
			//console.log("Token " + token + " is a closing bracket");
			
			if (_Verbose && _JustLexVerbose) {
				document.getElementById("taOutput").value += "\t\tToken created: " + token + "\n\n";
			}
			
			_TokenArray.push(new tokenObject("T_CloseBracket" ,token));
			token = "";
			openBracket = false;
		}

	} 
	else if (token.match(digit)) {
		//console.log("Token " + token + " is a digit");
		
		if (_Verbose && _JustLexVerbose) {
			document.getElementById("taOutput").value += "\t\tToken created: " + token + "\n\n";
		}
		
		_TokenArray.push(new tokenObject("T_Digit", token));
		token = "";
	} 
	else if (token.match(parens)) {
		if (token.match(openParen)) {
			//console.log("Token " + token + " is an open paren");
			
			if (_Verbose && _JustLexVerbose) {
				document.getElementById("taOutput").value += "\t\tToken created: " + token + "\n\n";
			}
			
			_TokenArray.push(new tokenObject("T_OpenParen", token));
			token = "";
			//openParen = true;
		} 
		else {
			//console.log("Token " + token + " is a closing paren");
			
			if (_Verbose && _JustLexVerbose) {
				document.getElementById("taOutput").value += "\t\tToken created: " + token + "\n\n";
			}
			
			_TokenArray.push(new tokenObject("T_CloseParen", token));
			token = "";
			openParen = false;
		}
	} 
	else if (token.match(equalsSign) && !token.match(notEqual)) {

		if (!isEqualityOperator) {
			//console.log("Token " + token + " is an assignment operator");
			
			if (_Verbose && _JustLexVerbose) {
				document.getElementById("taOutput").value += "\t\tToken created: " + token + "\n\n";
			}
			
			_TokenArray.push(new tokenObject("T_Assign", token));
			token = "";
		} 
		else {
			//console.log("Token " + token + " is an equality operator");
			
			if (_Verbose && _JustLexVerbose) {
				document.getElementById("taOutput").value += "\t\tToken created: " + token + "\n\n";
			}
			
			_TokenArray.push(new tokenObject("T_Equality", token));
			token = "";
			isEqualityOperator = false;
		}

	} 
	else if (token.match(stringExpr)) {
		//console.log("Token " + token + " is an string expression");
		
		if (_Verbose && _JustLexVerbose) {
			document.getElementById("taOutput").value += "\t\tToken created: " + token + "\n\n";
		}
		
		_TokenArray.push(new tokenObject("T_StrExpr", token));
	} 
	else if (token.match(notEqual)) {
		//console.log("Token " + token + " is a not equal sign");
		
		if (_Verbose && _JustLexVerbose) {
			document.getElementById("taOutput").value += "\t\tToken created: " + token + "\n\n";
		}
		
		_TokenArray.push(new tokenObject("T_NotEqual", token));
	} 
	else if (token.match(plusSign)) {
		//console.log("Token " + token + " is a plus sign");
		
		if (_Verbose && _JustLexVerbose) {
			document.getElementById("taOutput").value += "\t\tToken created: " + token + "\n\n";
		}
		
		_TokenArray.push(new tokenObject("T_Plus", token));
	} 
	else if (token.match(endOfFile)) {
		//console.log("Token " + token + " is the EOF marker");
		
		if (_Verbose && _JustLexVerbose) {
			document.getElementById("taOutput").value += "\t\tToken created: " + token + "\n\n";
		}
		document.getElementById("taOutput").value += "Lexing Complete \n\n";
		document.getElementById("taOutput").value += "*****END LEXER*****\n\n";
		_TokenArray.push(new tokenObject("T_EOF", token));
		token = "";
		endOfFileReached = true;
		
		//Peak ahead to see if there is anything past the $
		if (_Index < _Code.length -1) {
			thereIsStuffAfterEOF = true;
			warnings();
		}
		
		_Index += _Code.length; //Kills while loop if $ is reached 
	}

}

function warnings() {

	//Warns of excess code after EOF marker
	if (endOfFileReached && thereIsStuffAfterEOF) {
		//console.log("WARNING: There is stuff after the EOF marker, this will be ignored.");
		document.getElementById("taOutput").value += "\n\n\tWARNING: There is/are symbol(s) after the EOF marker, this/they will be ignored.";
	}

	//Warns if EOF was reached without reading a $. Inserts $
	if (!endOfFileReached) {
		//console.log("WARNING: EOF was reached without the use of '$'. I have inserted this symbol for you.");
		document.getElementById("taOutput").value += "\n\n\tWARNING: EOF was reached without the use of '$'. I have inserted this symbol for you.";

		var code2 = document.getElementById("taSourceCode").value;
		code2 += "\n$";
		document.getElementById("taSourceCode").value = code2;
	}
}

function errors() {
	//Syntax Error
	if (unrecognizedSymbol) {
		//console.log("ERROR: Syntax error on line " + _LineNumber + " There was an unrecognized symbol  " + token);
		//_Code[i]);
		document.getElementById("taOutput").value += "\n\tSyntax error on line " + _LineNumber + " There was an unrecognized symbol  " + token;

		_Index = _Code.length + 1;
		//Stops loop
	}

	if (openQuote) {
		//console.log("Unended String");
		document.getElementById("taOutput").value += "\n\tERROR: Unended String";
	}

	if (openParen) {
		//console.log("Unended expression");
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
//}
