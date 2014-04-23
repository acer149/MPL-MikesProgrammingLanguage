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
	 		
	 		checkScopeForId(_CurrentScopePointer, printChild);
	 		
	 		// console.log("ST len: " + _CurrentScopePointer.scopeSymbolTable.length + " of current scope " + _CurrentScopePointer.scopeNumber);
	 		// //Searches current scope for the identifier
	 		// for (var j = 0; j < _CurrentScopePointer.scopeSymbolTable.length; j++) {
	 			// console.log("Compare " + printChild.type.toString() + " with " + _CurrentScopePointer.scopeSymbolTable[j].id);
				// if (($.inArray(printChild.type.toString(), _CurrentScopePointer.scopeSymbolTable[j].id) != -1 )) {
	 				// console.log("Found " + printChild.type + " in ST");
	 				// document.getElementById("taOutput").value += "id " + printChild.type + " is in symbol table\n";
	 				// foundInST = true;
	 			// }
	 			// else if(foundInST === false) {
	 				// console.log("Did not find " + printChild.type + " in ST. the current scope is " + _CurrentScopePointer.scopeNumber);
	 				// document.getElementById("taOutput").value += "id " + printChild.type + " is NOT in symbol table. Please delcare and initialize this variable\n";
	 				// //break;
	 			// }	 			
	 		// }
			// foundInST = false;
	 	}
	 	else if (tempNode.children[i].type === "assign") {
	 		console.log("Assign");
	 	
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
	 		//Searches current scope for the identifier
	 		for (var j = 0; j < scope.scopeSymbolTable.length; j++) {
	 			console.log("Compare " + identifier.type.toString() + " with " + scope.scopeSymbolTable[j].id);
				if (($.inArray(identifier.type.toString(), scope.scopeSymbolTable[j].id) != -1 )) {
	 				console.log("Found " + identifier.type + " in ST");
	 				document.getElementById("taOutput").value += "id " + identifier.type + " is in symbol table\n";
	 				foundInST = true;
	 			}
	 			else if(foundInST === false) {
	 				console.log("Did not find " + identifier.type + " in ST. the current scope is " + scope.scopeNumber);
	 				document.getElementById("taOutput").value += "id " + identifier.type + " is NOT in symbol table. Please delcare and initialize this variable\n";
	 				//break;
	 			}	 			
	 		}
			foundInST = false;	
}

function Scope(scopeNumber, parent, children, parrallelScope) {
	this.scopeNumber = scopeNumber;
	this.parent = parent;
	this.children = children;
	this.scopeSymbolTable = [];
	this.parrallelScope = parrallelScope;
}

function Id(id, type, line, initialized, scope) {
	this.id = id;
	this.type = type;
	this.line = line;
	this.initialized = initialized;
	this.scope = scope;
}
