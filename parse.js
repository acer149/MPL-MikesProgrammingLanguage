/* parse.js */

var tokenToParse = "";

function beginParse() {
	tokenToParse = getNextToken();
	console.log("Current Token is: " + tokenToParse);
	parseProgram();
}

function parseProgram() {
	document.getElementById("taOutput").value += "\n\n*****PARSE*****\n\n";
	document.getElementById("taOutput").value += "\nParsing in Process: \n\n";
	
	if (!_Verbose || !_JustParseVerbose) {
		document.getElementById("taOutput").value += "\tParse Output Hidden \n";	
	}
	
	parseBlock();
	match("T_EOF");
	
	document.getElementById("taOutput").value += "\nParsing Complete \n";
	document.getElementById("taOutput").value += "\n\n*****END PARSE*****\n\n";
}

function parseBlock() {
	match("T_OpenBracket");
	parseStatementList();
	match("T_CloseBracket");
}

function parseStatementList() {
	
}

function parseStatement() {
	
}

function parsePrintStatement() {
	
}

function parseAssignmentStatement() {
	
}

function parseVarDecl() {
	
}

function parseWhileStatement() {
	
}

function parseIfStatement() {
	
}

function parseExpr() {
	
}

function parseIntExpr() {
	
}

function parseStringExpr() {
	
}

function parseBooleanExpr() {
	
}

function parseId() {
	
}

function parseCharList() {
	
}

function parseType() {
	
}

function parseChar() {
	
}

function parseSpace() {
	
}

function parseDigit() {
	
}

function parseBoolop() {
	
}

function parseBoolval() {
	
}

function parseIntop() {
	
}


function match(expectedToken) {
	switch(expectedToken) {
		case "T_OpenBracket": document.getElementById("taOutput").value += "\n\tExpecting an open bracket\n";
			//console.log("Current Token is: " + tokenToParse);
			if (tokenToParse.value === "{") {
				document.getElementById("taOutput").value += "\n\tFound an open bracket\n";
			}
			else {
				document.getElementById("taOutput").value += "\n\tDid NOT find an open bracket\n";
			}
			break;
			
		case "T_CloseBracket": document.getElementById("taOutput").value += "\n\tExpecting a closing bracket\n";
			if (tokenToParse.value === "}") {
				document.getElementById("taOutput").value += "\n\tFound a closing bracket\n";
			}
			else {
				document.getElementById("taOutput").value += "\n\tDid NOT find a closing bracket\n";
			}
			break;
			
		case "T_EOF": document.getElementById("taOutput").value += "\n\tExpecting an EOF marker\n";
			if (tokenToParse.value === "$") {
				document.getElementById("taOutput").value += "\n\tFound an EOF marker\n";
			}
			else {
				document.getElementById("taOutput").value += "\n\tDid NOT find an EOF marker\n\n";
			}
			break;
		
		default: document.getElementById("taOutput").value += "Parse Error, Invalid Token Type at position " + _TokenIndex;
			break;
	}
	tokenToParse = getNextToken();
}
