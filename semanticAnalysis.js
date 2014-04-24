/* semanticAnalysis.js */

var treeLevel = 1;
var b = 0;
var array = [];
//var scopeBlock = null;
var scopeCounter = 0;

var foundInST = false;

//var id = null;

function traverseAST() {
	
	var tempNode = _ASTRoot;
	expandAst(tempNode);
	
	console.log(_SymbolTableRoot);
}
var treeLevel = 0;

function expandAst(tempNode) { 
	treeLevel += 1;
	//Goes through the AST (DFIO) 
	for (var i = 0; i < tempNode.children.length; i++) {
						 
		//Manage verbose output, shows root node of ast
	 	if(_Verbose && _JustASTVerbose && b === 0) {
	 		//document.getElementById("taOutput").value += tempNode.type + "\n";
	 		b++;
	 		
	 		console.log("Initializing scope " + scopeCounter);
	 		var scopeBlock = new Scope(scopeCounter, null, array, null);
	 		_SymbolTableRoot = scopeBlock;
	 		_CurrentScopePointer = scopeBlock;
	 		scopeCounter++;
	 	}
	 	
	 	if (tempNode.children[i].type === "block") {
	 		console.log("Initializing scope " + scopeCounter);
	 		var scopeBlock = new Scope(scopeCounter, _CurrentScopePointer, array, null);
	 		_CurrentScopePointer.children.push(scopeBlock);
	 		_CurrentScopePointer = scopeBlock;
	 		scopeCounter++;
	 	}
	 	else if (tempNode.children[i].type === "varDecl") {
	 		var varDeclNode = tempNode.children[i];
	 		var varDeclNodeLC = varDeclNode.children[0];
	 		var varDeclNodeRC = varDeclNode.children[1];
	 		var id = new Id(varDeclNodeRC.type, varDeclNodeLC.type, varDeclNodeLC.lineNumber, "no", _CurrentScopePointer.scopeNumber);
	 		_CurrentScopePointer.scopeSymbolTable.push(id);
	 		console.log(_CurrentScopePointer.scopeSymbolTable);
	 	}
	 	else if (tempNode.children[i].type === "print") {
	 		var printNode = tempNode.children[i];
	 		var printChild = printNode.children[0];
	 		console.log("Print child: " + printChild.type);
	 		//console.log( _CurrentScopePointer.scopeSymbolTable);
	 		
	 		//Checks for String Expression
	 		if (printChild.type[0] != "\"") {
	 			checkScopeForId(_CurrentScopePointer, printChild);	
	 		}
	 		
	 	}
	 	else if (tempNode.children[i].type === "assign") {
	 		var assignNode = tempNode.children[i];
	 		var childOfAssign = assignNode.children[0];
	 		console.log("Assign child: " + childOfAssign.type);
	 		
	 		checkScopeForId(_CurrentScopePointer, childOfAssign);
	 	
	 	}
	 	else if (tempNode.children[i].type === "while") {
	 		var whileNode = tempNode.children[i];
	 		if (whileNode.children[0].type != "==" && whileNode.children[0].type != "!=") {
		 		var childOfwhile = whileNode.children[0];
		 		console.log("While child: " + childOfwhile.type);
		 		
		 		checkScopeForId(_CurrentScopePointer, childOfwhile);	 			
	 		}
	 		else if (whileNode.children[0].type === "==" || whileNode.children[0].type === "!=") {
		 		var boolOp = whileNode.children[0];
		 		var leftChildOfBoolOp = boolOp.children[0];
		 		var rightChildOfBoolOp = boolOp.children[1];
		 		console.log("Left BoolOp Child: " + leftChildOfBoolOp.type);
		 		console.log("Right BoolOp Child: " + rightChildOfBoolOp.type);
		 		
		 		checkScopeForId(_CurrentScopePointer, leftChildOfBoolOp);
		 		//Allows for conditions containing digits and boolean values a==1 a==true, etc.
		 		if (rightChildOfBoolOp.type.match(/[a-z]/) && rightChildOfBoolOp.type.length === 1) {
		 			checkScopeForId(_CurrentScopePointer, rightChildOfBoolOp);
		 		}		 			
	 		}	
	 	}
	 	else if (tempNode.children[i].type === "if") {
	 		var ifNode = tempNode.children[i];
	 		if (ifNode.children[0].type != "==" && ifNode.children[0].type != "!=") {
	 			var childOfIf = ifNode.children[0];
	 			console.log("If child: " + childOfIf.type);
		 		
		 		checkScopeForId(_CurrentScopePointer, childOfIf);
	 		}
	 		else if (ifNode.children[0].type === "==" || ifNode.children[0].type === "!=") {
		 		var boolOp = ifNode.children[0];
		 		var leftChildOfBoolOp = boolOp.children[0];
		 		var rightChildOfBoolOp = boolOp.children[1];
		 		console.log("Left BoolOp Child: " + leftChildOfBoolOp.type);
		 		console.log("Right BoolOp Child: " + rightChildOfBoolOp.type);
		 		
		 		checkScopeForId(_CurrentScopePointer, leftChildOfBoolOp);
		 		//Allows for conditions containing digits and boolean values a==1 a==true, etc.
		 		if (rightChildOfBoolOp.type.match(/[a-z]/) && rightChildOfBoolOp.type.length === 1) {
		 			checkScopeForId(_CurrentScopePointer, rightChildOfBoolOp);
		 		}	 			
	 		}	 	
	 	}	 		
	 				
		//printASTVerboseOutput(astLevel, tempNode.children[i].type);			
		expandAst(tempNode.children[i]);
	}
	//when a block ends move pointer to parent scope and continue
	if (_CurrentScopePointer.parent != null && tempNode.type === "block") {
		console.log("Moving scope back to scope: " + _CurrentScopePointer.parent.scopeNumber + " from scope: " + _CurrentScopePointer.scopeNumber);
		_CurrentScopePointer = _CurrentScopePointer.parent;
	}
	treeLevel -= 1;
}

function checkScopeForId(scope, identifier) {
	 		console.log("ST len: " + scope.scopeSymbolTable.length + " of current scope " + scope.scopeNumber);
	 		var scopeNumber = scope.scopeNumber;
	 		
	 		//while the id has not be found in ST and while there are still scopes to check, continue searching
	 		while (scopeNumber >= 0 && foundInST === false) {
		 		//Searches current scope for the identifier
		 		for (var j = 0; j < scope.scopeSymbolTable.length; j++) {
		 			console.log("Compare " + identifier.type.toString() + " with " + scope.scopeSymbolTable[j].id);
					if (($.inArray(identifier.type.toString(), scope.scopeSymbolTable[j].id) != -1 )) {
		 				console.log("Found " + identifier.type + " in ST");
		 				document.getElementById("taOutput").value += "id " + identifier.type + " on line " + identifier.lineNumber + " is in symbol table\n";
		 				foundInST = true;
		 			}	 			
		 		}
		 		//If the current scope did not contain the id, then move to the parent scope and check there
		 		if (foundInST === false) {
		 			console.log("Did not find " + identifier.type + " in ST. the current scope is " + scope.scopeNumber 
		 				+ " checking parent scope " + scope.scopeNumber -1);
		 				
		 			//Did not find id in current scope, check parent scope...
		 			scope = scope.parent;
		 			scopeNumber--;
		 		}	 			
	 		}
	 		if (scopeNumber < 0 && foundInST === false) {
		 		console.log("Did not find " + identifier.type + " in ST.");
		 		document.getElementById("taOutput").value += "ERROR: id " + identifier.type + " on line " + identifier.lineNumber 
		 			+ " is NOT in symbol table. Please delcare and initialize this variable\n";
		 		
		 		_ErrorCount++;
		 		//break;	 			
	 		}
			//Reset to false
			foundInST = false;	
}

function Scope(scopeNumber, parent, children, parrallelScope) {
	this.scopeNumber = scopeNumber;
	this.parent = parent;
	this.children = children;
	this.scopeSymbolTable = [];
	this.parrallelScope = parrallelScope;
}

function Id(id, type, lineNumber, initialized, scope) {
	this.id = id;
	this.type = type;
	this.lineNumber = lineNumber;
	this.initialized = initialized;
	this.scope = scope;
}
