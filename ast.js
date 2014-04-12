/* ast.js */

function astNode(type, parent, children) {

	this.type = type;
	this.parent = parent;
	this.children = [];
	
}

function addAstBranchNode(type, parent, children) {

	//Creates a new node object with properties: type, parent(the node _CurrentAstPointer points to), and a children array
	var node = new astNode(type, _CurrentAstPointer, children);
	
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


function findLeavesOfCurrentSubTree(currentSubTree) {
	console.log("Looking for leaves under " + currentSubTree.type);
	for (var j = 0; j < currentSubTree.children.length; j++) {
		//console.log("Is this a leaf: " + currentSubTree.children[j].type + " It has children: " + currentSubTree.children[j].children );
		if (currentSubTree.children[j].children < 1) {
			//console.log("Found Leaf: " + currentSubTree.children[j].type);
			if (!currentSubTree.children[j].type.match(exclude)) {
				addAstLeafNode(currentSubTree.children[j].type);
			}
		}
	findLeavesOfCurrentSubTree(currentSubTree.children[j]);
	}
}


function addAstLeafNode(type, parent) {
	//Creates a new node object with properties: type, parent(the node _CurrentAstPointer points to). No child array because it is a leaf node
	var node = new astNode(type, _CurrentAstPointer);
	
	if (_CurrentAstPointer === _CSTRoot) {
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
	_CurrentAstPointer = _CurrentAstPointer.parent;
}

function displayAbstractSyntaxTree() {
	//Assigns the tree to a temporary pointer and maintains a reference to the root
	 var tempPointer = _ASTRoot;
	 console.log(_ASTRoot);
	 document.getElementById("taOutput").value += "\n\n*****ABSTRACT SYNTAX TREE*****\n\n";
	 
	 if(_Verbose && _JustASTVerbose) {
	 	document.getElementById("taOutput").value += astLevel + tempPointer.type + "\n";	
	 }
	 expandAstNode(tempPointer);
	 
	 if (!_Verbose || !_JustASTVerbose) {
	 	document.getElementById("taOutput").value += "\tAST Hidden\n";
	 }
	 
	 
	 document.getElementById("taOutput").value += "\n\n*****END ABSTRACT SYNTAX TREE*****\n\n";
}

var astLevel = "";
var treeLevel = 1;
function expandAstNode(tempNode) {
	astLevel = "";
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
		
		//document.getElementById("taOutput").value += astLevel + tempNode.children[i].type + "\n"; // " at tree level " + treeLevel + "\n";			
		printASTVerboseOutput(astLevel, tempNode.children[i].type);	
				
		expandAstNode(tempNode.children[i]);
	}
	//astLevel -= "-";
	treeLevel -= 1;
}



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
