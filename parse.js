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
	document.getElementById("taOutput").value += "\n\tParsing token " + tokenToParse.index + " Value: " + tokenToParse.value + "\n";
	console.log("Token in parseBlock is: " + tokenToParse.value);
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
		parseStatementList();
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
		parseVarDecl();
	}
	else if (tokenToParse.type === "T_While") {
		match("T_While");
		parseWhileStatement();
	}
	else if (tokenToParse.type === "T_If") {
		match("T_If");
		parseIfStatement();
	}
	else if (tokenToParse.type === "T_OpenBracket") {
		parseBlock();
	}
	
}

function parsePrintStatement() {
	document.getElementById("taOutput").value += "\n\t\tParsing Print Statement\n";
	match("T_OpenParen");
	parseExpr();
	match("T_CloseParen");
	
}

function parseAssignmentStatement() {
	document.getElementById("taOutput").value += "\n\t\tParsing Assignment Statement\n";
	match("T_Equal");
	parseExpr();
}

function parseVarDecl() {
	document.getElementById("taOutput").value += "\n\t\tParsing VarDecl\n";
	match("T_Id");	
}

function parseWhileStatement() {
	document.getElementById("taOutput").value += "\n\t\tParsing While Statement\n";
	parseBooleanExpr();
	parseBlock();
}

function parseIfStatement() {
	document.getElementById("taOutput").value += "\n\t\tParsing If Statement\n";
	parseBooleanExpr();
	parseBlock();	
}

function parseExpr() {
	if (tokenToParse.type === "T_Digit") {
		//match() here?
		parseIntExpr();
	}
	//Would be T_Quote, but I used a holistic approach. Also, why is 'holistic spelled without a 'w'??
	else if (tokenToParse.type === "T_StringExpr") {  
		//match() here?
		parseStringExpr();
	}
	else if (tokenToParse.type === "(") {  
		//match() here?
		parseBooleanExpr();
	}
	else if (tokenToParse.type === "T_Id") {  
		match("T_Id");
	}
}

function parseIntExpr() {
	
	
	
	if (tokenToParse.type === "T_Digit") {
		match("T_Digit");
		parseDigit();
		
		if (tokenToParse.type === "T_Plus") {
			match("T_Plus");
			parseIntop();
		
			if (tokenToParse.type === "T_Id") {
				match("T_Id");
			}					
		}
	}
	
	// if (tokenToParse.type === "T_Plus") {
		// match("T_Plus");
		// parseIntop();
	// }
	// else if (tokenToParse.type === "T_Digit") {
		// match("T_Digit");
		// parseDigit();
// 		
	// }
	// else if (tokenToParse.type === "T_Id") {
		// match("T_Id");
	// }

	
}

function parseStringExpr() {
	match("T_StringExpr");
	
}

function parseBooleanExpr() {
	if (tokenToParse.value === "(") {
		match("T_OpenParen");
		parseExpr();
		parseBoolOp();
		match("T_CloseParen");	
	}
	else {
		parseBoolval();
	}
	
}

function parseId() {
	match(T_Id);
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
	if (tokenToParse.value.match(digit)) {
		match("T_Digit");
	}
	
}

function parseBoolop() {
	if (tokenToParse.value === "==" || tokenToParse.value === "!=") {
		match("T_BoolOp");
	}
	
}

function parseBoolval() {
	if (tokenToParse.value === "true" || tokenToParse.value === "false") {
		match("T_Boolval");
	}	
}

function parseIntop() {
	if (tokenToParse.value === "+") {
		match("T_IntOp");
	}	
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
			}
			break;
			
		case "T_Id": document.getElementById("taOutput").value += "\n\t\t\tExpecting an identifier\n";
			if (tokenToParse.value.match(character)) {
				document.getElementById("taOutput").value += "\n\t\tFound an identifier\n";
			}
			break;
		
		case "T_VarDeclType":
			if (tokenToParse.value.match(character)) {
				//document.getElementById("taOutput").value += "\n\t\t\tParsing\n";
			}
			break;
		
		case "T_While":
			if (tokenToParse.value === "while") {
			}
			break;
		case "T_If":
			if (tokenToParse.value === "if") {
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
			
		case "T_Plus": document.getElementById("taOutput").value += "\n\t\tExpecting an Plus Sign\n";
			if (tokenToParse.value === "+") {
				document.getElementById("taOutput").value += "\n\t\tFound an Plus Sign\n";
			}
			break;	
			
		case "T_Digit": document.getElementById("taOutput").value += "\n\t\tExpecting a Digit\n";
			if (tokenToParse.value.match(digit)) {
				document.getElementById("taOutput").value += "\n\t\tFound a Digit\n";
			}
			break;
		
		case "T_StringExpr": document.getElementById("taOutput").value += "\n\t\tExpecting a String Expression\n";
			if (tokenToParse.type === "T_StringExpr") {
				document.getElementById("taOutput").value += "\n\t\tFound a String Expression\n";
			}			
			break;
			
		case "T_BoolOp": document.getElementById("taOutput").value += "\n\t\tExpecting a Boolean Op\n";
			if (tokenToParse.value === "==" || tokenToParse.value === "!=") {
				document.getElementById("taOutput").value += "\n\t\tFound a Boolean Op\n";
			}			
			break;
			
		case "T_Boolval": document.getElementById("taOutput").value += "\n\t\tExpecting a Boolean Val\n";
			if (tokenToParse.value === "true" || tokenToParse.value === "false") {
				document.getElementById("taOutput").value += "\n\t\tFound a Boolean Val\n";
			}			
			break;
			
		case "T_IntOp": document.getElementById("taOutput").value += "\n\t\tExpecting an Int Op\n";
			if (tokenToParse.value === "+") {
				document.getElementById("taOutput").value += "\n\t\tFound an Int Op\n";
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
