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
	console.log("Token in parseBlock is: " + tokenToParse);
	match("T_OpenBracket");
	parseStatementList();
	match("T_CloseBracket");
}

function parseStatementList() {
	console.log("Token in parseStatementList is: " + tokenToParse.value);
	//Check ahead for a closing bracket. If found, the block is empty
	if (tokenToParse.value === "}") {
		document.getElementById("taOutput").value += "\n\t\tFound Empty Block\n";
	}
	else {
		parseStatement();
		//parseStatementList();
	}
}

function parseStatement() {
	console.log("Token in parseStatement is: " + tokenToParse.type);
	if (tokenToParse.type === "T_Print") {
		match("T_Print");
		parsePrintStatement();	
	}
	else if (tokenToParse.type === "T_Id") {
		match("T_Id");
		parseAssignmentStatement();	
	}
	else if (tokenToParse.type === "T_Int" || tokenToParse.type === "T_String" || tokenToParse.type === "T_Boolean") {
		match("T_VarDeclType");
		//parseVarDecl();
	}
	else if (tokenToParse.type === "T_While") {
		match("T_While");
		//parseWhileStatement();
	}
	else if (tokenToParse.type === "T_If") {
		match("T_If");
		//parseIfStatement();
	}
	else if (tokenToParse.type === "T_OpenBracket") {
		//parseBlock();
	}
	
}

function parsePrintStatement() {
	match("T_OpenParen");
	//parseExpr();
	match("T_CloseParen");
	
}

function parseAssignmentStatement() {
	match("T_Equal");
	//parseExpr();
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
		
		case "T_Print": 
			if (tokenToParse.value === "print") {
				document.getElementById("taOutput").value += "\n\t\tParsing Print Statement\n";
			}
			break;
			
		case "T_Id":
			if (tokenToParse.value.match(character)) {
				document.getElementById("taOutput").value += "\n\t\tParsing Assignment Statement\n";
			}
			break;
		
		case "T_VarDeclType":
			if (tokenToParse.value.match(character)) {
				document.getElementById("taOutput").value += "\n\t\tParsing VarDecl\n";
				document.getElementById("taOutput").value += "\n\t\t/tExpecting an identifier\n";
			}
			break;
		
		case "T_While":
			if (tokenToParse.value === "while") {
				document.getElementById("taOutput").value += "\n\t\tParsing While Statement\n";
			}
			break;
		case "T_If":
			if (tokenToParse.value === "if") {
				document.getElementById("taOutput").value += "\n\t\tParsing If Statement\n";
			}
			break;	
			
		case "T_OpenParen": document.getElementById("taOutput").value += "\n\t\tExpecting an Open Paren\n";
			if (tokenToParse.value === "(") {
				document.getElementById("taOutput").value += "\n\t\tFound Open Paren\n";
			}
			break;
		case "T_CloseParen": document.getElementById("taOutput").value += "\n\t\tExpecting a Closing Paren\n";
			if (tokenToParse.value === ")") {
				document.getElementById("taOutput").value += "\n\t\tFound a Closing Paren\n";
			}
			break;
		case "T_Equal": document.getElementById("taOutput").value += "\n\t\tExpecting an Equal Sign\n";
			if (tokenToParse.value === "=") {
				document.getElementById("taOutput").value += "\n\t\tFound an Equal Sign\n";
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
