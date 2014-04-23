/* ast.js */

function astNode(type, parent, children, pointerToSymbolTable, lineNumber) {

	this.type = type;
	this.parent = parent;
	this.children = [];
	this.pointerToSymbolTable = pointerToSymbolTable;
	this.lineNumber = lineNumber;
	
}

function addAstBranchNode(type, lineNumber) {
	console.log("Adding ast branch Node: " + type);
	//Creates a new node object with properties: type, parent(the node _CurrentAstPointer points to), and a children array
	var node = new astNode(type, _CurrentAstPointer, children, null, lineNumber);
	
	if (_CurrentAstPointer === null) {
		//First node is root
		_ASTRoot = node; 
		//Assign new node to the current pointer
		_CurrentAstPointer = node;
	}
	else {
		//Adds the new node to its parents children array
		_CurrentAstPointer.children.push(node);
		//Assign new node to the current pointer
		_CurrentAstPointer = node;
	}
}

function addAstLeafNode(type, lineNumber) {
	//Creates a new node object with properties: type, parent(the node _CurrentAstPointer points to). No child array because it is a leaf node
	var node = new astNode(type, _CurrentAstPointer, null, null, lineNumber);
	console.log("Adding ast leaf Node: " + type);
	if (_CurrentAstPointer === _ASTRoot) {
		//error
	}
	else {
		//Adds the new node to its parents children array
		_CurrentAstPointer.children.push(node);
		//_CurrentAstPointer = node;		
	}
}

function movePointerUpAST() {
	//Steps back up the tree
	//console.log("Moving pointer up from: " + _CurrentAstPointer.type + " to: " + _CurrentAstPointer.parent.type);
	_CurrentAstPointer = _CurrentAstPointer.parent;
}

function displayAbstractSyntaxTree() {
	//Assigns the tree to a temporary pointer and maintains a reference to the root
	 var tempPointer = _ASTRoot;
	 console.log(_ASTRoot);
	 document.getElementById("taOutput").value += "\n\n*****ABSTRACT SYNTAX TREE*****\n\n";
	 
	 expandAstNode(tempPointer);
	 
	 //Manage verbose output
	 if (!_Verbose || !_JustASTVerbose) {
	 	document.getElementById("taOutput").value += "\tAST Hidden\n";
	 }
	 
	 
	 document.getElementById("taOutput").value += "\n\n*****END ABSTRACT SYNTAX TREE*****\n\n";
}

var astLevel = "";
var treeLevel = 1;
var q = 0;
function expandAstNode(tempNode) {
	astLevel = "|----";
	treeLevel += 1; 
	//Goes through the AST (DFIO) and prints out the nodes 
	for (var i = 0; i < tempNode.children.length; i++) {
		//console.log("In expandAstNode"); 
		//console.log(tempNode.children[i].type);
		
//		for (var j = 0; j < treeLevel; j++) {
//			if (j === 1) {
//				astLevel += "----";
//			}
//			else {
//				astLevel += "|----";
//			}
				
//		}
		
		 for (var j = 1; j < treeLevel; j++) {
			 astLevel += "|----";	
		 }
		 
		//Manage verbose output, prints root node of ast
	 	if(_Verbose && _JustASTVerbose && q === 0) {
	 		document.getElementById("taOutput").value += tempNode.type + "\n";
	 		q++;	
	 	}
	 	
	 	//Assign correct children to while and if
	 	//Checks for a while or if statement and checks the number of children it has.  I did this in order to correct the 
	 	//ast when a boolean expression is used as a condition. ie. while(a==b)
	 	if ((tempNode.children[i].type === "while" || tempNode.children[i].type === "if") && tempNode.children[i].children.length != 2 ) {
	 		
	 		var whileOrIfNode = tempNode.children[i];
	 		
	 		//While and if nodes have 4 children, but should only have 2: the boolop (!= or ==) and a block
	 		//The other two nodes should be children of the boolop
	 		//Below rearranges the tree to correctly implement the above comment
	 		var firstConditional = whileOrIfNode.children[0]; //Should be child if booleanOperand
	 		var booleanOperand = whileOrIfNode.children[1];
	 		var secondConditional = whileOrIfNode.children[2]; //Should be child if booleanOperand
	 		var block = whileOrIfNode.children[3];
	 		
	 		//Sets boolean op children
			booleanOperand.children[0] = firstConditional;
			booleanOperand.children[1] = secondConditional;
			
			//Corrects the while or if node to only have 2 children
			whileOrIfNode.children[0] = booleanOperand;
	 		whileOrIfNode.children[1] = block;
			whileOrIfNode.children.splice(2,2);
			
	 		
	 	}
	 	
	 	//Assign correct children to assign statement
	 	//Checks for an assign statement and checks the number of children it has.  I did this in order to correct the 
	 	//ast when a int expression is used in an assign statement. ie. while(a==b)
	 	if (tempNode.children[i].type === "assign" && tempNode.children[i].children.length != 2 ) {
	 		
	 		var assignNode = tempNode.children[i];
	 		
	 		//Shift children around
	 		var firstChild = assignNode.children[1]; //Should be child of intOperand
	 		var intOperand = assignNode.children[2];
	 		var secondChild = assignNode.children[3]; //Should be child of intOperand
	 		
	 		//Sets int op children
			intOperand.children[0] = firstChild;
			intOperand.children[1] = secondChild;
			
			//Corrects the assign node
			assignNode.children[1] = intOperand;
			assignNode.children.splice(2,2);
			
	 		
	 	}
		
		//document.getElementById("taOutput").value += astLevel + tempNode.children[i].type + "\n"; // " at tree level " + treeLevel + "\n";			
		printASTVerboseOutput(astLevel, tempNode.children[i].type);	
				
		expandAstNode(tempNode.children[i]);
	}
	//astLevel -= "-";
	treeLevel -= 1;
}


//Previous implementation that "sort of worked"

// var patternArray = ["block", "print statement", "if statement", "while statement", "assignment statement", "varDecl"];
// var exclude = /[\(\)\{\}statementList]/;
// 
// function buildAst() {
	// //Assigns the tree to a temporary pointer and maintains a reference to the root
	// var tempPointerToCSTRoot = _CSTRoot;
// 	
	// traverseConcreteSyntaxTree(tempPointerToCSTRoot);
// }
// 
// function traverseConcreteSyntaxTree(tempPointerToCST) {
// 	
	// //Goes through the CST (DFIO) and searches for patterns to include in the AST 
	// for (var i = 0; i < tempPointerToCST.children.length; i++) {
// 		
		// console.log("CHECK THIS: " + tempPointerToCST.type);
		// //document.getElementById("taOutput").value += level + tempNode.children[i].type + "\n";
// 		
// 					
		// if ($.inArray(tempPointerToCST.children[i].type.toString(), patternArray) != -1) {
// 		
			// console.log("Found Pattern: " + tempPointerToCST.children[i].type);
// 			
			// addAstBranchNode(tempPointerToCST.children[i].type.toString());	
// 				
		// }
// 				
		// //traverseConcreteSyntaxTree(tempPointerToCST.children[i]);
		// //traverseConcreteSyntaxTree();
		// //console.log(_ASTRoot);
	// }
	// tempPointerToCST = tempPointerToCST.children[0].children[0];
	// traverseConcreteSyntaxTree(tempPointerToCST);
// }



//******
// function findLeavesOfCurrentSubTree(currentSubTree) {
	// console.log("Looking for leaves under " + currentSubTree.type);
	// for (var j = 0; j < currentSubTree.children.length; j++) {
		// //console.log("Is this a leaf: " + currentSubTree.children[j].type + " It has children: " + currentSubTree.children[j].children );
		// if (currentSubTree.children[j].children < 1) {
			// //console.log("Found Leaf: " + currentSubTree.children[j].type);
			// if (!currentSubTree.children[j].type.match(exclude)) {
				// addAstLeafNode(currentSubTree.children[j].type);
			// }
		// }
	// findLeavesOfCurrentSubTree(currentSubTree.children[j]);
	// }
// }