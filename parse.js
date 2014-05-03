/* parse.js */

var tokenToParse = "";

function beginParse() {
	tokenToParse = getNextToken();
	//console.log("Current Token is: " + tokenToParse);
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
		//console.log("LIneNum: " + _LineNumber);
		document.getElementById("taWarnError").value += "PARSING FAILED with an error on line " + tokenToParse.lineNumber + "\n\n";	
	}
	else {
		document.getElementById("taWarnError").value += "PARSING FAILED with an error on line " + _LineNumber + "\n\n";
	}

}

function parseBlock() {
	if (_Verbose && _JustParseVerbose) {
		document.getElementById("taOutput").value += "\n\tParsing token " + tokenToParse.index + " Value: " + tokenToParse.value + "\n";
	}
	
	addBranchNode("block");
	addAstBranchNode("block", "noType", tokenToParse.lineNumber);
	
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
	movePointerUpAST();	
	
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
		//match("T_Print");
		if (_ErrorCount === 0) {
			parsePrintStatement();	
		}	
	}
	else if (tokenToParse.type === "T_Id") {
		//match("T_Id");
		if (_ErrorCount === 0) {
			parseAssignmentStatement();	
		}	
	}
	else if (tokenToParse.type === "T_Int" || tokenToParse.type === "T_String" || tokenToParse.type === "T_Boolean") {
		//match("T_VarDeclType");
		if (_ErrorCount === 0) {
			parseVarDecl();	
		}
	}
	else if (tokenToParse.type === "T_While") {
		//match("T_While");
		if (_ErrorCount === 0) {
			parseWhileStatement();	
		}
	}
	else if (tokenToParse.type === "T_If") {
		//match("T_If");
		if (_ErrorCount === 0) {
			parseIfStatement();	
		}
	}
	else if (tokenToParse.type === "T_OpenBracket") {
		if (_ErrorCount === 0) {
			parseBlock();	
		}
	}
	else {
		_ErrorCount++;
	}
	movePointerUpTree();
}

function parsePrintStatement() {
	
	addBranchNode("print statement");
	addAstBranchNode("print", "noType", tokenToParse.lineNumber);
	match("T_Print");
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
	movePointerUpAST();
}

function parseAssignmentStatement() {
	
	addBranchNode("assignment statement");
	addAstBranchNode("assign", "noType", tokenToParse.lineNumber);
	match("T_Id");
	document.getElementById("taOutput").value += "\n\t\tParsing Assignment Statement\n";
	match("T_Equal");
	if (_ErrorCount === 0) {
		parseExpr();	
	}
	movePointerUpTree();
	movePointerUpAST();
}

function parseVarDecl() {
	
	addBranchNode("varDecl");
	addAstBranchNode("varDecl", "noType", tokenToParse.lineNumber);
	match("T_VarDeclType");
	document.getElementById("taOutput").value += "\n\t\tParsing VarDecl\n";
	match("T_Id");
	//TODO:move up cst????
	movePointerUpTree();
	movePointerUpAST();	
}

function parseWhileStatement() {
	
	addBranchNode("while statement");
	addAstBranchNode("while", "noType", tokenToParse.lineNumber);
	match("T_While");
	document.getElementById("taOutput").value += "\n\t\tParsing While Statement\n";
	if (_ErrorCount === 0) {
		parseBooleanExpr();	
	}
	if (_ErrorCount === 0) {
		parseBlock();	
	}
	movePointerUpTree();
	movePointerUpAST();
}

function parseIfStatement() {
	
	addBranchNode("if statement");
	addAstBranchNode("if", "noType", tokenToParse.lineNumber);
	match("T_If");
	document.getElementById("taOutput").value += "\n\t\tParsing If Statement\n";
	if (_ErrorCount === 0) {
		parseBooleanExpr();	
	}
	if (_ErrorCount === 0) {
		parseBlock();	
	}	
	movePointerUpTree();
	movePointerUpAST();
}

function parseExpr() {
	
	//addBranchNode("expr");
	
	if (_Verbose && _JustParseVerbose) {
		document.getElementById("taOutput").value += "\n\tParsing Expr\n";
		document.getElementById("taOutput").value += "\n\tParsing token " + tokenToParse.index + " Value: " + tokenToParse.value + "\n";
	}
	
	if (tokenToParse.type === "T_Digit") {
		//match("T_Digit");
		addBranchNode("expr");
		if (_ErrorCount === 0) {
			parseIntExpr();
			movePointerUpTree();	
		}
	}
	//Would be T_Quote, but I used a holistic approach. Also, why is 'holistic spelled without a 'w'??
	else if (tokenToParse.type === "T_StringExpr") {  
		//match() here?
		addBranchNode("expr");
		if (_ErrorCount === 0) {
			parseStringExpr();
			movePointerUpTree();	
		}
	}
	else if (tokenToParse.type === "T_True" || tokenToParse.type === "T_False" || tokenToParse.value === "(") {  
		//match() here?
		addBranchNode("expr");
		if (_ErrorCount === 0) {
			parseBooleanExpr();	
			movePointerUpTree();
		}
	}
	else if (tokenToParse.type === "T_Id") {
		addBranchNode("expr");  
		match("T_Id");
		if (tokenToParse.type === "T_Plus") { //Catches error where an IntExpr starts with an id
			 console.log("Found a plus");
			 _ErrorCount+=1;
		}
		movePointerUpTree();
	}
	//movePointerUpTree();
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
			 //match("T_Digit");
			if (_ErrorCount === 0) {
				parseDigit();
				if (tokenToParse.type === "T_Plus") {
					if (_ErrorCount === 0) {
						parseIntop();
					}
					if (_ErrorCount === 0) {
						parseExpr();
					}
				}
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
	//console.log("Should have added a digit node");
	if (tokenToParse.type === "T_Digit") {//.value.match(digit)) {
		match("T_Digit");
	}
	movePointerUpTree();
}

function parseBoolop() {
	
	//addBranchNode("boolOp");
	
	if (tokenToParse.value === "==" || tokenToParse.value === "!=") {
		addBranchNode("boolOp");
		addAstBranchNode(tokenToParse.value, "boolOp", tokenToParse.lineNumber);
		match("T_BoolOp");
		movePointerUpTree();
		movePointerUpAST();
	}
	//movePointerUpTree();
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
					addLeafNode("{");
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
					addLeafNode("}");
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
					addLeafNode("print");
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
					addLeafNode(tokenToParse.value);
					addAstLeafNode(tokenToParse.value, "TypeDependsOnVarDecl", tokenToParse.lineNumber);
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
					addLeafNode("int");
					addAstLeafNode("int", "int", tokenToParse.lineNumber);
					tokenToParse.cstType = "VarDecl";
					matchVerboseOutput("Found", "an", "int keyword");
					//document.getElementById("taOutput").value += "\n\t\t\tParsing\n";
				}
				else if (tokenToParse.type === "T_String") {
					addLeafNode("string");
					addAstLeafNode("string", "string", tokenToParse.lineNumber);
					tokenToParse.cstType = "VarDecl";
					matchVerboseOutput("Found", "a", "string keyword");
					//document.getElementById("taOutput").value += "\n\t\t\tParsing\n";
				}
				else if (tokenToParse.type === "T_Boolean") {
					addLeafNode("boolean");
					addAstLeafNode("boolean", "boolean", tokenToParse.lineNumber);
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
					addLeafNode("while");
					tokenToParse.cstType = "Statement";
				}
				break;
			case "T_If":
				if (tokenToParse.value === "if") {
					addLeafNode("if");
					tokenToParse.cstType = "Statement";
				}
				break;	
				
			case "T_OpenParen": matchVerboseOutput("Expecting", "an", "Open Paren");
				if (tokenToParse.value === "(") {
					addLeafNode("(");
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
					addLeafNode(")");
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
					addLeafNode("=");
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
					addLeafNode("+");
					addAstLeafNode("+", "+", tokenToParse.lineNumber);
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
					addLeafNode(tokenToParse.value);
					addAstLeafNode(tokenToParse.value, "int", tokenToParse.lineNumber);
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
					addLeafNode(tokenToParse.value);
					addAstLeafNode(tokenToParse.value, "string", tokenToParse.lineNumber);
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
					addLeafNode(tokenToParse.value);
					addAstLeafNode(tokenToParse.value, "boolOp", tokenToParse.lineNumber);
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
					addLeafNode(tokenToParse.value);
					addAstLeafNode(tokenToParse.value, "boolVal", tokenToParse.lineNumber);
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
					addLeafNode("+");
					addAstLeafNode(tokenToParse.value, "intOp", tokenToParse.lineNumber);
					matchVerboseOutput("Found", "an", "Int Op");
				}
				else {
					matchVerboseOutput("Did NOT find", "an", "Int Op");
					_ErrorCount+=1;
				}			
				break;
				
			case "T_EOF": matchVerboseOutput("Expecting", "an", "EOF Marker");
				if (tokenToParse.value === "$") {
					addLeafNode("$");
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
		console.log("Next token to look at " + tokenToParse.type);	
	}
	//console.log("Error Count is: " + _ErrorCount);

}
