/* semanticAnalysis.js */

var b = 0;

var scopeCounter = 0;

var foundInST = false;

var declaringAnId = false;
var initializingAnId = false;
var idIsBeingUsed = false;

function traverseAST() { //Builds ST and does scope checking
	
	document.getElementById("taOutput").value += "\n\n*****SCOPE CHECKING*****\n\n";
	
	var tempNode = _ASTRoot;
	expandAst(tempNode); 
	
	checkForUnusedIdentifiers(_SymbolTableRoot);
	
	document.getElementById("taOutput").value += "\n\n*****END SCOPE CHECKING*****\n\n";
	
	console.log(_SymbolTableRoot);
	//console.log("Scope Counter: " + scopeCounter);
}

function Scope(scopeNumber, parent, children, parrallelScope) {
	this.scopeNumber = scopeNumber;
	this.parent = parent;
	this.children = [];
	this.scopeSymbolTable = [];
	this.parrallelScope = parrallelScope;
}

function Id(id, type, lineNumber, initialized, scope, used) {
	this.id = id;
	this.type = type;
	this.lineNumber = lineNumber;
	this.initialized = initialized;
	this.scope = scope;
	this.used = used;
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------
//Scope Checking Below
//---------------------------------------------------------------------------------------------------------------------------------------------------------

function expandAst(tempNode) { 
	//Goes through the AST (DFIO) 
	for (var i = 0; i < tempNode.children.length; i++) {
						 
		//Manage verbose output, shows root node of ast
	 	if(_Verbose && _JustASTVerbose && b === 0) {
	 		//document.getElementById("taOutput").value += tempNode.type + "\n";
	 		b++;
	 		
	 		console.log("Initializing scope " + scopeCounter);
	 		var scopeBlock = new Scope(scopeCounter, null, null, null);
	 		_SymbolTableRoot = scopeBlock;
	 		_CurrentScopePointer = scopeBlock;
	 		scopeCounter++;
	 	}
	 	
	 	if (tempNode.children[i].type === "block") {
	 		console.log("Initializing scope " + scopeCounter);
	 		var scopeBlock = new Scope(scopeCounter, _CurrentScopePointer, null);
	 		_CurrentScopePointer.children.push(scopeBlock);
	 		console.log("Adding child");
	 		_CurrentScopePointer = scopeBlock;
	 		scopeCounter++;
	 	}
	 	else if (tempNode.children[i].type === "varDecl") {
	 		var varDeclNode = tempNode.children[i];
	 		var varDeclNodeLC = varDeclNode.children[0];
	 		var varDeclNodeRC = varDeclNode.children[1];
	 		var id = new Id(varDeclNodeRC.type, varDeclNodeLC.type, varDeclNodeLC.lineNumber, false, _CurrentScopePointer.scopeNumber, false);
	 		_CurrentScopePointer.scopeSymbolTable.push(id);
	 		document.getElementById("taOutput").value += "\tAdded id " + id.id + " to the Symbol Table at scope level " + id.scope + "\n\n";
	 		
	 		varDeclNodeLC.pointerToSymbolTable = id; //Point to ST
	 		
	 		console.log(_CurrentScopePointer.scopeSymbolTable);
	 	}
	 	else if (tempNode.children[i].type === "print") {
	 		var printNode = tempNode.children[i];
	 		
	 		if (printNode.children.length === 1) {
		 		var printChild = printNode.children[0];
		 		console.log("Print child: " + printChild.type);
		 		//console.log( _CurrentScopePointer.scopeSymbolTable);
		 		
		 		//Checks for String Expression
		 		if (printChild.type[0] != "\"") {
		 			idIsBeingUsed = true;
		 			checkScopeForId(_CurrentScopePointer, printChild);
		 			idIsBeingUsed = false;	
		 		}	 			
	 		}
	 		else if(printNode.children.length > 1) { //If print has more than one child (1+a)...
	 			console.log("Print has multiple children"); 
	 			
	 			//Loops through the children of print and checks for identifiers
	 			for (var q = 0; q < printNode.children.length; q++) {
	 				var printChild = printNode.children[q];
	 				console.log("Type of print's child " + printChild.type);
	 				//Checks that the child is a letter, is not a string (prevents strings from processing here) **Add check for length 1 here??
	 				if (printChild.type.match(/['a-z']/) && printChild.type[0] != "\"") {
			 			idIsBeingUsed = true;
			 			checkScopeForId(_CurrentScopePointer, printChild);
			 			idIsBeingUsed = false;	 					
	 				}
	 			}
	 		}	
	 	}
	 	else if (tempNode.children[i].type === "assign") {
	 		var assignNode = tempNode.children[i];
	 		var childOfAssignBeingInitialized = assignNode.children[0];
	 		
	 		//Handles first child of assign, which is the identifier being initialized
	 		console.log("Assign child being initialized: " + childOfAssignBeingInitialized.type);
	 		initializingAnId = true;
	 		checkScopeForId(_CurrentScopePointer, childOfAssignBeingInitialized);
	 		initializingAnId = false;
	 		
	 		//Checks for other identifiers being used in the assign statement
	 		for (var q = 1; q < assignNode.children.length; q++) {
	 			var childOfAssign = assignNode.children[q];
	 			console.log("Assign child: " + childOfAssign.type);
	 			
	 			//Checks that the child is a letter, is not a string, and is of length 1 (prevents strings and bool values from processing here)
	 			if (childOfAssign.type.match(/['a-z']/) && childOfAssign.type[0] != "\"" && childOfAssign.type.length === 1) {
			 		idIsBeingUsed = true;
			 		checkScopeForId(_CurrentScopePointer, childOfAssign);
			 		idIsBeingUsed = false;	 				
	 			}
	 			else if (childOfAssign.type === "==" || childOfAssign.type === "!=") {
	 				for (var p = 0; p < childOfAssign.children.length; p++) {
	 					var childOfBoolOp = childOfAssign.children[p];
	 					console.log("Child of bool op: " + childOfBoolOp.type);
	 					
	 					//Checks that the child is a letter, is not a string, and is of length 1 (prevents strings and bool values from processing here)
	 					if (childOfBoolOp.type.match(/['a-z']/) && childOfBoolOp.type[0] != "\"" && childOfBoolOp.type.length === 1) {
			 			idIsBeingUsed = true;
			 			checkScopeForId(_CurrentScopePointer, childOfBoolOp);
			 			idIsBeingUsed = false;	 				
	 					}
	 				}
	 			}
	 		}
	 	}
	 	else if (tempNode.children[i].type === "while") {
	 		var whileNode = tempNode.children[i];
	 		if (whileNode.children[0].type != "==" && whileNode.children[0].type != "!=") {
		 		var childOfwhile = whileNode.children[0];
		 		console.log("While child: " + childOfwhile.type);
		 		
		 		idIsBeingUsed = true;
		 		checkScopeForId(_CurrentScopePointer, childOfwhile);
		 		idIsBeingUsed = false;	 			
	 		}
	 		else if (whileNode.children[0].type === "==" || whileNode.children[0].type === "!=") {
		 		var boolOp = whileNode.children[0];
		 		var leftChildOfBoolOp = boolOp.children[0];
		 		var rightChildOfBoolOp = boolOp.children[1];
		 		console.log("Left BoolOp Child: " + leftChildOfBoolOp.type);
		 		console.log("Right BoolOp Child: " + rightChildOfBoolOp.type);
		 		
		 		if (leftChildOfBoolOp.type[0] != "\"") {
			 		idIsBeingUsed = true;
		 			checkScopeForId(_CurrentScopePointer, leftChildOfBoolOp);
		 			idIsBeingUsed = false;		 			
		 		}

		 		//Allows for conditions containing digits and boolean values a==1 a==true, etc.
		 		if (rightChildOfBoolOp.type.match(/[a-z]/) && rightChildOfBoolOp.type.length === 1) {
		 			idIsBeingUsed = true;
		 			checkScopeForId(_CurrentScopePointer, rightChildOfBoolOp);
		 			idIsBeingUsed = false;
		 		}		 			
	 		}	
	 	}
	 	else if (tempNode.children[i].type === "if") {
	 		var ifNode = tempNode.children[i];
	 		if (ifNode.children[0].type != "==" && ifNode.children[0].type != "!=") {
	 			var childOfIf = ifNode.children[0];
	 			console.log("If child: " + childOfIf.type);
		 		
		 		idIsBeingUsed = true;
		 		checkScopeForId(_CurrentScopePointer, childOfIf);
		 		idIsBeingUsed = false;
	 		}
	 		else if (ifNode.children[0].type === "==" || ifNode.children[0].type === "!=") {
		 		var boolOp = ifNode.children[0];
		 		var leftChildOfBoolOp = boolOp.children[0];
		 		var rightChildOfBoolOp = boolOp.children[1];
		 		console.log("Left BoolOp Child: " + leftChildOfBoolOp.type);
		 		console.log("Right BoolOp Child: " + rightChildOfBoolOp.type);
		 		
		 		idIsBeingUsed = true;
		 		checkScopeForId(_CurrentScopePointer, leftChildOfBoolOp);
		 		idIsBeingUsed = false;
		 		
		 		//Allows for conditions containing digits and boolean values a==1 a==true, etc.
		 		if (rightChildOfBoolOp.type.match(/[a-z]/) && rightChildOfBoolOp.type.length === 1) {
		 			
		 			idIsBeingUsed = true;
		 			checkScopeForId(_CurrentScopePointer, rightChildOfBoolOp);
		 			idIsBeingUsed = false;
		 		}	 			
	 		}	 	
	 	}	 		
	 							
		expandAst(tempNode.children[i]);
	}
	//when a block ends move pointer to parent scope and continue
	if (_CurrentScopePointer.parent != null && tempNode.type === "block") {
		console.log("Moving scope back to scope: " + _CurrentScopePointer.parent.scopeNumber + " from scope: " + _CurrentScopePointer.scopeNumber);
		_CurrentScopePointer = _CurrentScopePointer.parent;
	}
}

function checkScopeForId(scope, identifier) {
	 		console.log("ST len: " + scope.scopeSymbolTable.length + " of current scope " + scope.scopeNumber);
	 		var scopeNumber = scope.scopeNumber;
	 		
	 		document.getElementById("taOutput").value += "\t\tChecking Symbol Table for id " + identifier.type + " on line " + identifier.lineNumber + "\n\n";
	 		
	 		//while the id has not be found in ST and while there are still scopes to check, continue searching
	 		while (scopeNumber >= 0 && foundInST === false) {
		 		//Searches current scope for the identifier
		 		for (var j = 0; j < scope.scopeSymbolTable.length; j++) {
		 			console.log("Compare " + identifier.type.toString() + " with " + scope.scopeSymbolTable[j].id);
					if (($.inArray(identifier.type.toString(), scope.scopeSymbolTable[j].id) != -1 )) {
						
						if (scope.scopeSymbolTable[j].initialized == true) {
		 					console.log("Found " + identifier.type + " in ST");
		 					document.getElementById("taOutput").value += "\t\t\tFound id " + identifier.type + " in symbol table\n\n";							
						}
						else if (initializingAnId === false) {
							document.getElementById("taOutput").value += "\t\t\tWARNING: Found id " + identifier.type + " in symbol table, but it has not been intialized yet\n\n";
						}

		 				foundInST = true;
		 				
		 				identifier.pointerToSymbolTable = scope.scopeSymbolTable[j]; //identifier in AST points to ST
		 				
		 				//If we are assigning a value to an id, mark the id as initialized
		 				if (initializingAnId === true) {
		 					scope.scopeSymbolTable[j].initialized = true;
		 					document.getElementById("taOutput").value += "\t\t\tFound and initializing identifier " + scope.scopeSymbolTable[j].id + " from scope " + scope.scopeNumber +"\n\n";
		 				}
		 				if (idIsBeingUsed === true) {
		 					scope.scopeSymbolTable[j].used = true;
		 				}
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
	 		//Did not find id in ST
	 		if (scopeNumber < 0 && foundInST === false) {
		 		console.log("Did not find " + identifier.type + " in ST.");
		 		document.getElementById("taOutput").value += "\n\tERROR: ID " + identifier.type + " on line " + identifier.lineNumber 
		 			+ " is NOT in symbol table. Please declare and initialize this variable before using it\n\n";
		 		
		 		_ErrorCount++;
		 		//break;	 			
	 		}
			//Reset to false
			foundInST = false;	
}

//Search for unused identifiers
function checkForUnusedIdentifiers(symbolTableRoot) {
	var scope = symbolTableRoot;
	var sentinal = 0;
	while (sentinal < scopeCounter) {
		//console.log("Scope Counter: " + scopeCounter);
		for (var x = 0; x < scope.scopeSymbolTable.length; x++) {
		    //Throws a warning if an id is declared but never used
			if (scope.scopeSymbolTable[x].used === false) {
				document.getElementById("taOutput").value += "\n\tWARNING: ID " + scope.scopeSymbolTable[x].id + " on line " + scope.scopeSymbolTable[x].lineNumber 
					+ " is declared but never used\n";
			}
			//Throws a warning if an id is declared but never initialized 
			if (scope.scopeSymbolTable[x].initialized === false) {
				document.getElementById("taOutput").value += "\n\tWARNING: ID " + scope.scopeSymbolTable[x].id + " on line " + scope.scopeSymbolTable[x].lineNumber 
					+ " is declared but never initialized\n";
			}
			//Throws a error if an id is used but was never initialized
			if (scope.scopeSymbolTable[x].initialized === false && scope.scopeSymbolTable[x].used === true) {
				document.getElementById("taOutput").value += "\n\tWARNING: ID " + scope.scopeSymbolTable[x].id + " on line " + scope.scopeSymbolTable[x].lineNumber 
					+ " is used but was never initialized\n";
			}			
		}
			//Move to next scope block
			scope = scope.children[0];	
			sentinal++;
	}
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------
//Type Checking Below
//---------------------------------------------------------------------------------------------------------------------------------------------------------

//Second pass over AST
function traverseASTForTypeChecking() {
	console.log("\n\nType Checking console messages are below \n\n");
	
	var tempNode = _ASTRoot;
	secondExpandOfAST(tempNode);
}

function secondExpandOfAST(tempNode) {

}


