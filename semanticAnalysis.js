/* semanticAnalysis.js */

var b = 0;

var scopeCounter = 0;

var foundInST = false;

/* These are used when checking ST for identifiers. If an identifier is being initialized or used, initializingAnId or idIsBeingUsed will be set to true.
 * Then in checkScopeForId if either of these is true the function will set the initialized or used property of the id to true allowing me to keep track of what 
 * identifiers have been initialized and used. This is then helpful when checking for warnings and errors, i.e. if the user tries to use an uninitialized id or declares 
 * an id and does not use it.
 */
var declaringAnId = false;
var initializingAnId = false;
var idIsBeingUsed = false;

function traverseAST() { //Builds ST and does scope checking
	
	document.getElementById("taOutput").value += "\n\n*****SCOPE CHECKING*****\n\n";
	
	var tempNode = _ASTRoot;
	expandAst(tempNode); 
	
	if (_ErrorCount === 0) {
		checkForUnusedIdentifiers(_SymbolTableRoot);
	}
	
	
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
		
		if (_ErrorCount === 0) {				 
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
		 	
		 	if (tempNode.children[i].value === "block") {
		 		console.log("Initializing scope " + scopeCounter);
		 		var scopeBlock = new Scope(scopeCounter, _CurrentScopePointer, null);
		 		_CurrentScopePointer.children.push(scopeBlock);
		 		console.log("Adding child");
		 		_CurrentScopePointer = scopeBlock;
		 		scopeCounter++;
		 	}
		 	else if (tempNode.children[i].value === "varDecl") {
		 		var varDeclNode = tempNode.children[i];
		 		var varDeclNodeLC = varDeclNode.children[0];
		 		var varDeclNodeRC = varDeclNode.children[1];
		 		
		 		//If there are no ids in the ST
		 		if(_CurrentScopePointer.scopeSymbolTable.length === 0) {
		 			console.log(varDeclNodeLC);
			 		var id = new Id(varDeclNodeRC.value, varDeclNodeLC.value, varDeclNodeLC.lineNumber, false, _CurrentScopePointer.scopeNumber, false);
			 		_CurrentScopePointer.scopeSymbolTable.push(id);
			 		document.getElementById("taOutput").value += "\tAdded id " + id.id + " to the Symbol Table at scope level " + id.scope + "\n\n";
			 		
			 		varDeclNodeLC.pointerToSymbolTable = id; //Point to ST
			 		
			 		console.log(_CurrentScopePointer.scopeSymbolTable);	 			
		 		}
		 		else {
		 			var tempArray = [];
		 			//Populate a temp array with the current ids in the current scope's ST
		 			for (var d = 0; d < _CurrentScopePointer.scopeSymbolTable.length; d++ ) {
		 				tempArray.push(_CurrentScopePointer.scopeSymbolTable[d].id);
		 			}
		 			
		 			//If the newly declared id IS NOT in the current scope's ST then add it	
		 			if (($.inArray(varDeclNodeRC.value.toString(), tempArray) === -1 )) {
						var id = new Id(varDeclNodeRC.value, varDeclNodeLC.value, varDeclNodeLC.lineNumber, false, _CurrentScopePointer.scopeNumber, false);
				 		_CurrentScopePointer.scopeSymbolTable.push(id);
				 		document.getElementById("taOutput").value += "\tAdded id " + id.id + " to the Symbol Table at scope level " + id.scope + "\n\n";
					 		
				 		varDeclNodeLC.pointerToSymbolTable = id; //Point to ST
					 		
				 		console.log(_CurrentScopePointer.scopeSymbolTable);		 					
		 			}
		 			//If the newly declared id IS in the current scope's ST then do not add it and throw an error
		 			else {
		 				document.getElementById("taWarnError").value += "ERROR: ID " + varDeclNodeRC.value + " on line " + varDeclNodeRC.lineNumber 
							+ " has already been declared in this scope\n\n";
							_ErrorCount++;
					}	 			
		 		} 		
		 	}
		 	else if (tempNode.children[i].value === "print") {
		 		var printNode = tempNode.children[i];
		 		
		 		if (printNode.children.length === 1) {
			 		var printChild = printNode.children[0];
			 		console.log("Print child: " + printChild.value);
			 		//console.log( _CurrentScopePointer.scopeSymbolTable);
			 		
			 		//Checks for String Expression
			 		if (printChild.value[0] != "\"") {
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
		 				console.log("Type of print's child " + printChild.value);
		 				//Checks that the child is a letter, is not a string (prevents strings from processing here) **Add check for length 1 here??
		 				if (printChild.value.match(/['a-z']/) && printChild.value[0] != "\"") {
				 			idIsBeingUsed = true;
				 			checkScopeForId(_CurrentScopePointer, printChild);
				 			idIsBeingUsed = false;	 					
		 				}
		 			}
		 		}	
		 	}
		 	else if (tempNode.children[i].value === "assign") {
		 		var assignNode = tempNode.children[i];
		 		var childOfAssignBeingInitialized = assignNode.children[0];
		 		
		 		//Handles first child of assign, which is the identifier being initialized
		 		console.log("Assign child being initialized: " + childOfAssignBeingInitialized.value);
		 		initializingAnId = true;
		 		checkScopeForId(_CurrentScopePointer, childOfAssignBeingInitialized);
		 		initializingAnId = false;
		 		
		 		//Checks for other identifiers being used in the assign statement
		 		for (var q = 1; q < assignNode.children.length; q++) {
		 			var childOfAssign = assignNode.children[q];
		 			console.log("Assign child: " + childOfAssign.value);
		 			
		 			//Checks that the child is a letter, is not a string, and is of length 1 (prevents strings and bool values from processing here)
		 			if (childOfAssign.value.match(/['a-z']/) && childOfAssign.value[0] != "\"" && childOfAssign.value.length === 1) {
				 		idIsBeingUsed = true;
				 		checkScopeForId(_CurrentScopePointer, childOfAssign);
				 		idIsBeingUsed = false;	 				
		 			}
		 			else if (childOfAssign.value === "==" || childOfAssign.value === "!=") {
		 				for (var p = 0; p < childOfAssign.children.length; p++) {
		 					var childOfBoolOp = childOfAssign.children[p];
		 					console.log("Child of bool op: " + childOfBoolOp.value);
		 					
		 					//Checks that the child is a letter, is not a string, and is of length 1 (prevents strings and bool values from processing here)
		 					if (childOfBoolOp.value.match(/['a-z']/) && childOfBoolOp.value[0] != "\"" && childOfBoolOp.value.length === 1) {
				 			idIsBeingUsed = true;
				 			checkScopeForId(_CurrentScopePointer, childOfBoolOp);
				 			idIsBeingUsed = false;	 				
		 					}
		 				}
		 			}
		 			else if (childOfAssign.value === "+") {
		 				for (var y = 0; y < childOfAssign.children.length; y++) {
		 					var childOfIntOp = childOfAssign.children[y];
		 					console.log("Child of int op: " + childOfIntOp.value);
		 					
		 					//Checks that the child is a letter, is not a string, and is of length 1 (prevents strings and bool values from processing here)
		 					if (childOfIntOp.value.match(/['a-z']/) && childOfIntOp.value[0] != "\"" && childOfIntOp.value.length === 1) {
				 			idIsBeingUsed = true;
				 			checkScopeForId(_CurrentScopePointer, childOfIntOp);
				 			idIsBeingUsed = false;	 				
		 					}
		 				}		 				
		 			}
		 		}
		 	}
		 	else if (tempNode.children[i].value === "while") {
		 		var whileNode = tempNode.children[i];
		 		if (whileNode.children[0].value != "==" && whileNode.children[0].value != "!=") {
			 		var childOfwhile = whileNode.children[0];
			 		console.log("While child: " + childOfwhile.value);
			 		
			 		idIsBeingUsed = true;
			 		checkScopeForId(_CurrentScopePointer, childOfwhile);
			 		idIsBeingUsed = false;	 			
		 		}
		 		else if (whileNode.children[0].value === "==" || whileNode.children[0].value === "!=") {
			 		var boolOp = whileNode.children[0];
			 		var leftChildOfBoolOp = boolOp.children[0];
			 		var rightChildOfBoolOp = boolOp.children[1];
			 		console.log("Left BoolOp Child: " + leftChildOfBoolOp.value);
			 		console.log("Right BoolOp Child: " + rightChildOfBoolOp.value);
			 		
			 		if (leftChildOfBoolOp.value[0] != "\"") {
				 		idIsBeingUsed = true;
			 			checkScopeForId(_CurrentScopePointer, leftChildOfBoolOp);
			 			idIsBeingUsed = false;		 			
			 		}
	
			 		//Allows for conditions containing digits and boolean values a==1 a==true, etc.
			 		if (rightChildOfBoolOp.value.match(/[a-z]/) && rightChildOfBoolOp.value.length === 1) {
			 			idIsBeingUsed = true;
			 			checkScopeForId(_CurrentScopePointer, rightChildOfBoolOp);
			 			idIsBeingUsed = false;
			 		}		 			
		 		}	
		 	}
		 	else if (tempNode.children[i].value === "if") {
		 		var ifNode = tempNode.children[i];
		 		if (ifNode.children[0].value != "==" && ifNode.children[0].value != "!=") {
		 			var childOfIf = ifNode.children[0];
		 			console.log("If child: " + childOfIf.value);
			 		
			 		idIsBeingUsed = true;
			 		checkScopeForId(_CurrentScopePointer, childOfIf);
			 		idIsBeingUsed = false;
		 		}
		 		else if (ifNode.children[0].value === "==" || ifNode.children[0].value === "!=") {
			 		var boolOp = ifNode.children[0];
			 		var leftChildOfBoolOp = boolOp.children[0];
			 		var rightChildOfBoolOp = boolOp.children[1];
			 		console.log("Left BoolOp Child: " + leftChildOfBoolOp.value);
			 		console.log("Right BoolOp Child: " + rightChildOfBoolOp.value);
			 		
			 		idIsBeingUsed = true;
			 		checkScopeForId(_CurrentScopePointer, leftChildOfBoolOp);
			 		idIsBeingUsed = false;
			 		
			 		//Allows for conditions containing digits and boolean values a==1 a==true, etc.
			 		if (rightChildOfBoolOp.value.match(/[a-z]/) && rightChildOfBoolOp.value.length === 1) {
			 			
			 			idIsBeingUsed = true;
			 			checkScopeForId(_CurrentScopePointer, rightChildOfBoolOp);
			 			idIsBeingUsed = false;
			 		}	 			
		 		}	 	
		 	}	 		
	 	}						
		expandAst(tempNode.children[i]);
	}
	//when a block ends move pointer to parent scope and continue
	if (_CurrentScopePointer.parent != null && tempNode.value === "block") {
		console.log("Moving scope back to scope: " + _CurrentScopePointer.parent.scopeNumber + " from scope: " + _CurrentScopePointer.scopeNumber);
		_CurrentScopePointer = _CurrentScopePointer.parent;
	}
}

function checkScopeForId(scope, identifier) {
	 		console.log("ST len: " + scope.scopeSymbolTable.length + " of current scope " + scope.scopeNumber);
	 		var scopeNumber = scope.scopeNumber;
	 		
	 		document.getElementById("taOutput").value += "\t\tChecking Symbol Table for id " + identifier.value + " on line " + identifier.lineNumber + "\n\n";
	 		
	 		//while the id has not be found in ST and while there are still scopes to check, continue searching
	 		while (scopeNumber >= 0 && foundInST === false) {
		 		//Searches current scope for the identifier
		 		for (var j = 0; j < scope.scopeSymbolTable.length; j++) {
		 			console.log("Compare " + identifier.value.toString() + " with " + scope.scopeSymbolTable[j].id);
					if (($.inArray(identifier.value.toString(), scope.scopeSymbolTable[j].id) != -1 )) {
						
						if (scope.scopeSymbolTable[j].initialized == true) {
		 					console.log("Found " + identifier.value + " in ST");
		 					document.getElementById("taOutput").value += "\t\t\tFound id " + identifier.value + " in symbol table\n\n";							
						}
						else if (initializingAnId === false) {
							document.getElementById("taWarnError").value += "WARNING: Found id " + identifier.value + " on line " + identifier.lineNumber + " in symbol table, but it has not been intialized yet\n\n";
						}

		 				foundInST = true;
		 				
		 				identifier.pointerToSymbolTable = scope.scopeSymbolTable[j]; //identifier in AST points to ST
		 				console.log("Assigned pointer " + identifier.value + " on line" + identifier.lineNumber + " to ST");
		 				
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
		 			console.log("Did not find " + identifier.value + " in ST. the current scope is " + scope.scopeNumber 
		 				+ " checking parent scope " + scope.scopeNumber -1);
		 				
		 			//Did not find id in current scope, check parent scope...
		 			scope = scope.parent;
		 			scopeNumber--;
		 		}	 			
	 		}
	 		//Did not find id in ST
	 		if (scopeNumber < 0 && foundInST === false) {
		 		console.log("Did not find " + identifier.value + " in ST.");
		 		document.getElementById("taWarnError").value += "ERROR: ID " + identifier.value + " on line " + identifier.lineNumber 
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
		    //Throws a warning if an id is declared and initialized but never used
			if (scope.scopeSymbolTable[x].used === false && scope.scopeSymbolTable[x].initialized === true) {
				console.log(scope.scopeSymbolTable[x]);
				document.getElementById("taWarnError").value += "WARNING: ID " + scope.scopeSymbolTable[x].id + " on line " + scope.scopeSymbolTable[x].lineNumber 
					+ " is declared and initialized but never used\n\n";
			}
			//Throws a warning if an id is declared but never initialized 
			if (scope.scopeSymbolTable[x].initialized === false) {
				document.getElementById("taWarnError").value += "WARNING: ID " + scope.scopeSymbolTable[x].id + " on line " + scope.scopeSymbolTable[x].lineNumber 
					+ " is declared but never initialized\n\n";
			}
			//Throws a error if an id is used but was never initialized
			if (scope.scopeSymbolTable[x].initialized === false && scope.scopeSymbolTable[x].used === true) {
				document.getElementById("taWarnError").value += "WARNING: ID " + scope.scopeSymbolTable[x].id + " on line " + scope.scopeSymbolTable[x].lineNumber 
					+ " is used but was never initialized\n\n";
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
	
	document.getElementById("taOutput").value += "\n\n*****TYPE CHECKING*****\n\n";
	
	var tempNode = _ASTRoot;
	secondExpandOfAST(tempNode);
	
	document.getElementById("taOutput").value += "\n\n*****END TYPE CHECKING*****\n\n";
}

function secondExpandOfAST(tempNode) {
		//Goes through the AST (DFIO) 
	for (var i = 0; i < tempNode.children.length; i++) {
		if (_ErrorCount === 0) {
			if (tempNode.children[i].value === "assign" ) {
				var assignNode = tempNode.children[i];
		
				var typeOfTheIdBeingAssignedTo = assignNode.children[0].pointerToSymbolTable.type;
				
				var typeOfTheSecondChild; //= assignNode.children[1].type;
				
				for (var w = 1; w < assignNode.children.length; w++) {
					var typeOfCurrentChild = assignNode.children[w].type;
					console.log("Type of current assign node child " + typeOfCurrentChild);
					if (typeOfCurrentChild === "intOp") {
						checkTypesForIntOp(assignNode.children[w]); //assignNode.children[w] is a +
					}
					else if (typeOfCurrentChild === "TypeDependsOnVarDecl") { //Then the current child is an id and I must look to ST pointer
						typeOfId = assignNode.children[w].pointerToSymbolTable.type;
						if (typeOfTheIdBeingAssignedTo != typeOfId) {
						document.getElementById("taWarnError").value += "ERROR: Cannot assign type " + typeOfId + " to type " + typeOfTheIdBeingAssignedTo + " on line " + assignNode.children[w].lineNumber + "\n\n";
						_ErrorCount++;							
						}
					}
					else if (typeOfCurrentChild === "string") {
						if (typeOfTheIdBeingAssignedTo != typeOfCurrentChild) {
						document.getElementById("taWarnError").value += "ERROR: Cannot assign type " + typeOfCurrentChild + " to type " + typeOfTheIdBeingAssignedTo + " on line " + assignNode.children[w].lineNumber + "\n\n";
						_ErrorCount++;							
						}						
					}
					else if (typeOfCurrentChild === "int") {
						if (typeOfTheIdBeingAssignedTo != typeOfCurrentChild) {
						document.getElementById("taWarnError").value += "ERROR: Cannot assign type " + typeOfCurrentChild + " to type " + typeOfTheIdBeingAssignedTo + " on line " + assignNode.children[w].lineNumber + "\n\n";
						_ErrorCount++;							
						}	
					}	
				}
			}
					
		}
		secondExpandOfAST(tempNode.children[i]);
	}

}


function checkTypesForIntOp(node) {
	var intOp = node;
	//+
	var leftChildType;
	var rightChildType;
	if (intOp.children[0].value.match(/[a-z]/)) {
		leftChildType = intOp.children[0].pointerToSymbolTable.type;
	} 
	else {
		leftChildType = intOp.children[0].type;
	}

	if (intOp.children[1].value.match(/[a-z]/) && intOp.children[1].value[0] != "\"" ) {
		rightChildType = intOp.children[1].pointerToSymbolTable.type;
	} 
	else {
		rightChildType = intOp.children[1].type;
	}

	console.log("Type of current intOp node children " + leftChildType + " and " + rightChildType);
	if (leftChildType != rightChildType) {
		document.getElementById("taWarnError").value += "ERROR: Cannot add type " + leftChildType + " to type " + rightChildType + " on line " + intOp.lineNumber + "\n\n";
		_ErrorCount++;
	}
}



