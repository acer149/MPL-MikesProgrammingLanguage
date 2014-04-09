/* ast.js */

var patternArray = ["block", "print statement", "if statement", "while statement", "assignment statement", "varDecl"];

function buildAst() {
	//Assigns the tree to a temporary pointer and maintains a reference to the root
	var tempPointer = _CSTRoot;
	
	traverseConcreteSyntaxTree(tempPointer);
}

function traverseConcreteSyntaxTree(tempNode) {
	
	//Goes through the CST (DFIO Traversal) and searches for patterns to include in the AST 
	for (var i = 0; i < tempNode.children.length; i++) {
		
		//console.log(tempNode.children[i].type);
		//document.getElementById("taOutput").value += level + tempNode.children[i].type + "\n";			
		
		if ($.inArray(tempNode.children[i].type.toString(), patternArray) === 1) {
			//TODO: Add if statement here to check for patterns
			addAstBranchNode(tempNode.children[i].type);	
			
			console.log("Found Pattern");
			findLeavesOfCurrentSubTree(tempNode.children[i]);	
			movePointerUpAST();	
				
		}
				
		traverseConcreteSyntaxTree(tempNode.children[i]);
		//console.log(_ASTRoot);
	}
}

function astNode(type, parent, children) {

	this.type = type;
	this.parent = parent;
	this.children = [];
	
}

function addAstBranchNode(type, parent, children) {

	//Creates a new node object with properties: type, parent(the node _CurrentAstPointer points to), and a children array
	var node = new astNode(type, _CurrentCstPointer, children);
	
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
		console.log("Is this a leaf: " + currentSubTree.children[j].type + " It has children: " + currentSubTree.children[j].children );
		if (currentSubTree.children[j].children < 1) {
			console.log("Found Leaf: " + currentSubTree.children[j].type);
			addAstLeafNode(currentSubTree.children[j].type);
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
	 expandAstNode(tempPointer);
	 document.getElementById("taOutput").value += "\n\n*****END ABSTRACT SYNTAX TREE*****\n\n";
}
var level = "-";
function expandAstNode(tempNode) {
	
	//Goes through the AST (DFIO Traversal) and prints out the nodes 
	for (var i = 0; i < tempNode.children.length; i++) {
		console.log("Hello");
		level = level + "-";
		console.log(tempNode.children[i].type);
		document.getElementById("taOutput").value += level + tempNode.children[i].type + "\n";			
						
		expandAstNode(tempNode.children[i]);
	}
}