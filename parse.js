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
	addBranchNode("program");
	parseBlock();
	if (_Verbose && _JustParseVerbose && tokenToParse.type === "T_EOF") {
		document.getElementById("taOutput").value += "\n\tParsing token " + tokenToParse.index + " Value: " + tokenToParse.value + "\n";
	}
	match("T_EOF");
	
	movePointerUpTree();
	
	if (_ErrorCount === 0) {
		document.getElementById("taOutput").value += "\nParsing Complete \n";
		document.getElementById("taOutput").value += "\nParsing Completed with " + _ErrorCount + " errors\n";
		document.getElementById("taOutput").value += "\n\n*****END PARSE*****\n\n";		
	}
	else if(_ErrorCount > 0 && tokenToParse.lineNumber != undefined) {
		console.log("LIneNum: " + _LineNumber);
		document.getElementById("taOutput").value += "\n\nPARSING FAILED with an error on line " + tokenToParse.lineNumber + "\n";	
	}
	else {
		document.getElementById("taOutput").value += "\n\nPARSING FAILED with an error on line " + _LineNumber + "\n";
	}

}

function parseBlock() {
	if (_Verbose && _JustParseVerbose) {
		document.getElementById("taOutput").value += "\n\tParsing token " + tokenToParse.index + " Value: " + tokenToParse.value + "\n";
	}
	
	addBranchNode("block");
	
	//console.log("Token in parseBlock is: " + tokenToParse.value);
	match("T_OpenBracket");
	if (_ErrorCount === 0) {
		parseStatementList();	
	}
	
	if (_Verbose && _JustParseVerbose && _ErrorCount === 0) {
		document.getElementById("taOutput").value += "\n\tParsing token " + tokenToParse.index + " Value: " + tokenToParse.value + "\n";
	}
	match("T_CloseBracket");
	
	movePointerUpTree();	
	
}

function parseStatementList() {
	if (_Verbose && _JustParseVerbose && _ErrorCount === 0) {
		document.getElementById("taOutput").value += "\n\tParsing StatementList";
		//document.getElementById("taOutput").value += "\n\n\tParsing token " + tokenToParse.index + " Value: " + tokenToParse.value + "\n";
	}
		
	addBranchNode("statementList");
		
	//console.log("Token in parseStatementList is: " + tokenToParse.value);
	//Check ahead for a closing bracket. If found, the block is empty
	if (tokenToParse.value === "}") {
		//document.getElementById("taOutput").value += "\n\t\tFound Empty Block\n";
	}
	else {
		if (_ErrorCount === 0) {
			parseStatement();	
		}
		if (_ErrorCount === 0 && tokenToParse.type != "T_EOF") {
			parseStatementList();	
		}
		

	}	
	movePointerUpTree();
}

function parseStatement() {
	
	addBranchNode("statement");
	
	//console.log("Token in parseStatement is: " + tokenToParse.type);
	if (tokenToParse.type === "T_Print") {
		match("T_Print");
		if (_ErrorCount === 0) {
			parsePrintStatement();	
		}	
	}
	else if (tokenToParse.type === "T_Id") {
		match("T_Id");
		if (_ErrorCount === 0) {
			parseAssignmentStatement();	
		}	
	}
	else if (tokenToParse.type === "T_Int" || tokenToParse.type === "T_String" || tokenToParse.type === "T_Boolean") {
		match("T_VarDeclType");
		if (_ErrorCount === 0) {
			parseVarDecl();	
		}
	}
	else if (tokenToParse.type === "T_While") {
		match("T_While");
		if (_ErrorCount === 0) {
			parseWhileStatement();	
		}
	}
	else if (tokenToParse.type === "T_If") {
		match("T_If");
		if (_ErrorCount === 0) {
			parseIfStatement();	
		}
	}
	else if (tokenToParse.type === "T_OpenBracket") {
		if (_ErrorCount === 0) {
			parseBlock();	
		}
	}
	movePointerUpTree();
}

function parsePrintStatement() {
	
	addBranchNode("print statement");
	
	if (_Verbose && _JustParseVerbose) {
		document.getElementById("taOutput").value += "\n\tParsing Print Statement\n";
		document.getElementById("taOutput").value += "\n\tParsing token " + tokenToParse.index + " Value: " + tokenToParse.value + "\n";
	}
	
	match("T_OpenParen");
	if (_ErrorCount === 0) {
		parseExpr();	
	}
	
	if (_Verbose && _JustParseVerbose) {
		document.getElementById("taOutput").value += "\n\tParsing token " + tokenToParse.index + " Value: " + tokenToParse.value + "\n";
	}
	
	match("T_CloseParen");
	movePointerUpTree();
}

function parseAssignmentStatement() {
	
	addBranchNode("assignment statement");
	
	document.getElementById("taOutput").value += "\n\t\tParsing Assignment Statement\n";
	match("T_Equal");
	if (_ErrorCount === 0) {
		parseExpr();	
	}
	movePointerUpTree();
}

function parseVarDecl() {
	
	addBranchNode("varDecl");
	
	document.getElementById("taOutput").value += "\n\t\tParsing VarDecl\n";
	match("T_Id");	
}

function parseWhileStatement() {
	
	addBranchNode("while statement");
	
	document.getElementById("taOutput").value += "\n\t\tParsing While Statement\n";
	if (_ErrorCount === 0) {
		parseBooleanExpr();	
	}
	if (_ErrorCount === 0) {
		parseBlock();	
	}
	movePointerUpTree();
}

function parseIfStatement() {
	
	addBranchNode("if statement");
	
	document.getElementById("taOutput").value += "\n\t\tParsing If Statement\n";
	if (_ErrorCount === 0) {
		parseBooleanExpr();	
	}
	if (_ErrorCount === 0) {
		parseBlock();	
	}	
	movePointerUpTree();
}

function parseExpr() {
	
	addBranchNode("expr");
	
	if (_Verbose && _JustParseVerbose) {
		document.getElementById("taOutput").value += "\n\tParsing Expr\n";
		document.getElementById("taOutput").value += "\n\tParsing token " + tokenToParse.index + " Value: " + tokenToParse.value + "\n";
	}
	
	if (tokenToParse.type === "T_Digit") {
		match("T_Digit");
		if (_ErrorCount === 0) {
			parseIntExpr();	
		}
	}
	//Would be T_Quote, but I used a holistic approach. Also, why is 'holistic spelled without a 'w'??
	else if (tokenToParse.type === "T_StringExpr") {  
		//match() here?
		if (_ErrorCount === 0) {
			parseStringExpr();	
		}
	}
	else if (tokenToParse.type === "T_True" || tokenToParse.type === "T_False" || tokenToParse.value === "(") {  
		//match() here?
		if (_ErrorCount === 0) {
			parseBooleanExpr();	
		}
	}
	else if (tokenToParse.type === "T_Id") {  
		match("T_Id");
	}
	movePointerUpTree();
}

function parseIntExpr() {
	
	addBranchNode("intExpr");
	
	if (tokenToParse.value === ")") {
		//match close paren in parseBoolExpr
	}
	else {
	 	if (tokenToParse.type === "T_Plus") {
			 match("T_Plus");
			if (_ErrorCount === 0) {
				parseIntop();
			}
			if (_ErrorCount === 0) {
				parseExpr();
			}			 
		 }
		 else if (tokenToParse.type === "T_Digit") {
			 match("T_Digit");
			if (_ErrorCount === 0) {
				parseDigit();
			}
 		
		 }
		 else if (tokenToParse.type === "T_Id") {
			 match("T_Id");
		 }		
	}
	movePointerUpTree();
}

function parseStringExpr() {
	
	addBranchNode("stringExpr");
	
	match("T_StringExpr");
	movePointerUpTree();
}

function parseBooleanExpr() {
	
	addBranchNode("booleanExpr");
	
	if (tokenToParse.value === "(") {
		match("T_OpenParen");
		if (_ErrorCount === 0) {
			parseExpr();
		}
		if (_ErrorCount === 0) {
			parseBoolop();
		}
		if (_ErrorCount === 0) {
			parseExpr();
		}
		match("T_CloseParen");	
	}
	else {
		if (_ErrorCount === 0) {
			parseBoolval();
		}
	}
	movePointerUpTree();
}

function parseId() {
	
	addBranchNode("id");
	
	match("T_Id");
	movePointerUpTree();
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
	
	addBranchNode("digit");
	
	if (tokenToParse.value.match(digit)) {
		match("T_Digit");
	}
	movePointerUpTree();
}

function parseBoolop() {
	
	addBranchNode("boolOp");
	
	if (tokenToParse.value === "==" || tokenToParse.value === "!=") {
		match("T_BoolOp");
	}
	movePointerUpTree();
}

function parseBoolval() {
	
	addBranchNode("boolVal");
	
	if (tokenToParse.value === "true" || tokenToParse.value === "false") {
		match("T_Boolval");
	}
	movePointerUpTree();	
}

function parseIntop() {
	
	addBranchNode("intOp");
	
	if (tokenToParse.value === "+") {
		match("T_IntOp");
	}	
	movePointerUpTree();
}


function match(expectedToken) {
	if (_ErrorCount === 0) {
		switch(expectedToken) {
			case "T_OpenBracket": matchVerboseOutput("Expecting", "an", "Open Bracket");
				//console.log("Current Token is: " + tokenToParse);
				if (tokenToParse.value === "{") {
					tokenToParse.cstType = "Block";
					matchVerboseOutput("Found", "an", "Open Bracket");
				}
				else {
					matchVerboseOutput("Did NOT find", "an", "Open Bracket");
					_ErrorCount+=1;
				}
				break;
				
			case "T_CloseBracket": matchVerboseOutput("Expecting", "a", "Closing Bracket");
				if (tokenToParse.value === "}") {
					tokenToParse.cstType = "CloseBrace";
					matchVerboseOutput("Found", "a", "Closing Bracket");
				}
				else {
					matchVerboseOutput("Did NOT find", "a", "Closing Bracket");
					_ErrorCount+=1;
				}
				break;
			
			case "T_Print": matchVerboseOutput("Expecting", "a", "Print Keyword");
				if (tokenToParse.value === "print") {
					tokenToParse.cstType = "Statement";
					matchVerboseOutput("Found", "a", "Print Keyword");
				}
				else {
					matchVerboseOutput("Did NOT find", "a", "Print Keyword");
					_ErrorCount+=1;
				}
				break;
				
			case "T_Id": matchVerboseOutput("Expecting", "an", "Identifier");
				if (tokenToParse.value.match(character)) {
					tokenToParse.cstType = "ID";
					matchVerboseOutput("Found", "an", "Identifier");
				}
				else {
					matchVerboseOutput("Did NOT find", "an", "Identifier");
					_ErrorCount+=1;
				}
				break;
			
			case "T_VarDeclType": matchVerboseOutput("Expecting", "an", "int, string, or boolean keyword");
				if (tokenToParse.type === "T_Int") {
					tokenToParse.cstType = "VarDecl";
					matchVerboseOutput("Found", "an", "int keyword");
					//document.getElementById("taOutput").value += "\n\t\t\tParsing\n";
				}
				else if (tokenToParse.type === "T_String") {
					tokenToParse.cstType = "VarDecl";
					matchVerboseOutput("Found", "a", "string keyword");
					//document.getElementById("taOutput").value += "\n\t\t\tParsing\n";
				}
				else if (tokenToParse.type === "T_Boolean") {
					tokenToParse.cstType = "VarDecl";
					matchVerboseOutput("Found", "a", "boolean keyword");
					//document.getElementById("taOutput").value += "\n\t\t\tParsing\n";
				}
				else {
					matchVerboseOutput("Did NOT find", "an", "int, string, or boolean keyword");
					_ErrorCount+=1;
				}
				break;
			
			case "T_While":
				if (tokenToParse.value === "while") {
					tokenToParse.cstType = "Statement";
				}
				break;
			case "T_If":
				if (tokenToParse.value === "if") {
					tokenToParse.cstType = "Statement";
				}
				break;	
				
			case "T_OpenParen": matchVerboseOutput("Expecting", "an", "Open Paren");
				if (tokenToParse.value === "(") {
					tokenToParse.cstType = "OpenParen";
					matchVerboseOutput("Found", "an", "Open Paren");
				}
				else {
					matchVerboseOutput("Did NOT find", "an", "Open Paren");
					_ErrorCount+=1;
				}
				break;
				
			case "T_CloseParen": matchVerboseOutput("Expecting", "a", "Closing Paren");
				if (tokenToParse.value === ")") {
					tokenToParse.cstType = "CloseParen";
					matchVerboseOutput("Found", "a", "Closing Paren");
				}
				else {
					matchVerboseOutput("Did NOT find", "a", "Closing Paren");
					_ErrorCount+=1;
				}
				break;
				
			case "T_Equal": matchVerboseOutput("Expecting", "an", "Equal Sign");
				if (tokenToParse.value === "=") {
					tokenToParse.cstType = "Assign";
					matchVerboseOutput("Found", "an", "Equal Sign");
				}
				else {
					matchVerboseOutput("Did NOT find", "an", "Equal Sign");
					_ErrorCount+=1;
				}
				break;	
				
			case "T_Plus": matchVerboseOutput("Expecting", "a", "Plus Sign");
				if (tokenToParse.value === "+") {
					tokenToParse.cstType = "Plus";
					matchVerboseOutput("Found", "a", "Plus Sign");
				}
				else {
					matchVerboseOutput("Did NOT find", "a", "Plus Sign");
					_ErrorCount+=1;
				}
				break;	
				
			case "T_Digit": matchVerboseOutput("Expecting", "a", "Digit");
				if (tokenToParse.value.match(digit)) {
					tokenToParse.cstType = "Digit";
					matchVerboseOutput("Found", "a", "Digit");
				}
				else {
					matchVerboseOutput("Did NOT find", "a", "Digit");
					_ErrorCount+=1;
				}
				break;
			
			case "T_StringExpr": matchVerboseOutput("Expecting", "a", "String Expression");
				if (tokenToParse.type === "T_StringExpr") {
					tokenToParse.cstType = "StringExpr";
					matchVerboseOutput("Found", "a", "String Expression");
				}
				else {
					matchVerboseOutput("Did NOT find", "a", "String Expression");
					_ErrorCount+=1;
				}			
				break;
				
			case "T_BoolOp": matchVerboseOutput("Expecting", "a", "Boolean Op");
				if (tokenToParse.value === "==" || tokenToParse.value === "!=") {
					tokenToParse.cstType = "EqualityOp";
					matchVerboseOutput("Found", "a", "Boolean Op");
				}			
				else {
					matchVerboseOutput("Did NOT find", "a", "Boolean Op");
					_ErrorCount+=1;
				}
				break;
				
			case "T_Boolval": matchVerboseOutput("Expecting", "a", "Boolean Val");
				if (tokenToParse.value === "true" || tokenToParse.value === "false") {
					tokenToParse.cstType = "BooleanVal";
					matchVerboseOutput("Found", "a", "Boolean Val");
				}	
				else {
					matchVerboseOutput("Did NOT find", "a", "Boolean Val");
					_ErrorCount+=1;
				}		
				break;
				
			case "T_IntOp": matchVerboseOutput("Expecting", "an", "Int Op");
				if (tokenToParse.value === "+") {
					matchVerboseOutput("Found", "an", "Int Op");
				}
				else {
					matchVerboseOutput("Did NOT find", "an", "Int Op");
					_ErrorCount+=1;
				}			
				break;
				
			case "T_EOF": matchVerboseOutput("Expecting", "an", "EOF Marker");
				if (tokenToParse.value === "$") {
					tokenToParse.cstType = "EOF";
					matchVerboseOutput("Found", "an", "EOF Marker");
				}
				else {
					matchVerboseOutput("Did NOT find", "an", "EOF Marker");
					_ErrorCount+=1;
				}
				break;
			
			default: document.getElementById("taOutput").value += "Parse Error, Invalid Token Type at position " + _TokenIndex;
				break;
		}
		tokenToParse = getNextToken();		
	}
	console.log("Error Count is: " + _ErrorCount);

}
