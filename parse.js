/* parse.js */

function parseProgram() {
	document.getElementById("taOutput").value += "\n\n*****PARSE*****\n\n";
	document.getElementById("taOutput").value += "\nParsing in Process: \n\n";
	
	if (!_Verbose || !_JustParseVerbose) {
		document.getElementById("taOutput").value += "\tParse Output Hidden \n";	
	}
		
	parseBlock();
	//match();
	document.getElementById("taOutput").value += "\nParsing Complete \n";
	document.getElementById("taOutput").value += "\n\n*****END PARSE*****\n\n";
}

function parseBlock() {
	
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
		//case "T_OpenBracket"
	}
}
