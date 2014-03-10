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
var openQuote = false;
var openParen = false;
var openBracket = false;
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
var equalsSign = /[\=]/;
var quote = /[\"]/;
var stringExpr = /[\"alphaNumeric\"]/;
var notEqual = /[\!]/;
var plusSign = /[\+]/;

var token = "";

function test() {
	document.getElementById("taOutput").value = "";
	document.getElementById("taOutput").value += "Lexing in Process:";

	_Code = document.getElementById("taSourceCode").value;
	//_Code += " ";
	//code.trim();
	_Code = _Code.split("");
	//console.log("Source Code: " + code);

	//**************
	//code = code.match(/[^\s]+/g);
	console.log("Source Code: " + _Code);
	var sourceCodeLengthMinusOne = _Code.length - 1;
	console.log("Source Code Length minus 1 = " + sourceCodeLengthMinusOne);

	//var q = 0;
	while (_Index < _Code.length) {
		//console.log("i = " + i);
		if (_Verbose) {
			document.getElementById("taOutput").value += "Processing Symbol " + _Code[_Index] + "\n";	
		}
		console.log("Processing Symbol " + _Code[_Index]);
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
			token = _Code[_Index];
			_Index += 1;
			while (!_Code[_Index].match(quote) && !(_Index === sourceCodeLengthMinusOne)) {
				token += _Code[_Index++];
				console.log("Building token " + token);
				//_Index +=1;
			}
			token += "\"";
			checkTokenType(token);
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
			var tmpIndexHolder = _Index;
			//console.log("tmpIndexHolder before while loop: " + tmpIndexHolder);
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
			//console.log("tmpIndexHolder before while loop: " + tmpIndexHolder);
			while (_Code[tmpIndexHolder].match(space)) { //&& !(tmpIndexHolder === sourceCodeLengthMinusOne)) {
				whiteSpacesInARowCount +=1;
				tmpIndexHolder++;
			}
			_Index += (whiteSpacesInARowCount - 1); //Subtract one to avoid off by one error. Main while loop will increment _Index as well
			//console.log("tmpIndexHolder after while loop: " + tmpIndexHolder);
			//console.log("Index after while loop: " + _Index);	
		} 
		else {
			console.log("Unrecognized");
			token = _Code[_Index];
			unrecognizedSymbol = true;
			errors();
		}
		_Index++;
	}
	console.log("Token Array: " + _TokenArray);
	token = "";
	warnings();

	//**************
}

//Checks if the token is a keyword, if not move to describeToken
function checkTokenType(token) {
	var keywordArray = ["print", "while", "if", "int", "string", "boolean", "true", "false"];
	var firstLetterOfkeywordsArray = ["p", "w", "i", "s", "b", "t", "f"];
	var charLookAhead = 0;
	//TODO:Store in _TokenArray as T_ID, T_PRINT, etc

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
			token += _Code[_Index + y];
			console.log("Building potential keyword: " + token);
		}

		//jQuery to see if token is in keywordArray
		if ($.inArray(token.toString(), keywordArray) != -1) {
			console.log("The token " + token + " is a keyword");
			_TokenArray.push(token);
			token = "";
			console.log("Token value " + token);
			_Index += charLookAhead;
		}
	} 
	else {//If token is not a keyword
		console.log("Token " + token + " is not a keyword");
		describeType(token);
		token = "";

	}

}

//If token is not a keyword, describe what it is
function describeType(token) {
	//Check for identifier
	if (token.match(character) && !token.match(quote)) {//add \g ?
		console.log("Token " + token + " is an identifier");
		_TokenArray.push(token);
		token = "";
		console.log("Index: " + _Index);
	}
	//Check for bracket
	else if (token.match(brackets)) {
		if (!openBracket) {
			console.log("Token " + token + " is an open bracket");
			_TokenArray.push(token);
			token = "";
			openBracket = true;
		} 
		else {
			console.log("Token " + token + " is a closing bracket");
			_TokenArray.push(token);
			token = "";
			openBracket = false;
		}

	} 
	else if (token.match(digit)) {
		console.log("Token " + token + " is a digit");
		_TokenArray.push(token);
		token = "";
	} 
	else if (token.match(parens)) {
		if (!openParen) {
			console.log("Token " + token + " is an open paren");
			_TokenArray.push(token);
			token = "";
			openParen = true;
		} 
		else {
			console.log("Token " + token + " is a closing paren");
			_TokenArray.push(token);
			token = "";
			openParen = false;
		}
	} 
	else if (token.match(equalsSign) && !token.match(notEqual)) {

		if (!isEqualityOperator) {
			console.log("Token " + token + " is an assignment operator");
			_TokenArray.push(token);
			token = "";
		} 
		else {
			console.log("Token " + token + " is an equality operator");
			_TokenArray.push(token);
			token = "";
			isEqualityOperator = false;
		}

	} 
	else if (token.match(stringExpr)) {
		console.log("Token " + token + " is an string expression");
		_TokenArray.push(token);
	} 
	else if (token.match(notEqual)) {
		console.log("Token " + token + " is a not equal sign");
		_TokenArray.push(token);
	} 
	else if (token.match(plusSign)) {
		console.log("Token " + token + " is a plus sign");
		_TokenArray.push(token);
	} 
	else if (token.match(endOfFile)) {
		console.log("Token " + token + " is the EOF marker");
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
		console.log("ERROR: Syntax error on line " + _LineNumber + " There was an unrecognized symbol  " + token);
		//_Code[i]);
		document.getElementById("taOutput").value += "\n\tSyntax error on line " + _LineNumber + " There was an unrecognized symbol  " + token;

		_Index = _Code.length + 1;
		//Stops loop
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

