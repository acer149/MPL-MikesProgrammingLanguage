/* ast.js */

function buildAst() {
	//Assigns the tree to a temporary pointer and maintains a reference to the root
	var tempPointer = _CSTRoot;
	
	traverseConcreteSyntaxTree(tempPointer);
}

function traverseConcreteSyntaxTree(tempNode) {
	
	//Goes through the CST (DFIO Traversal) and searches for patterns to include in the AST 
	for (var i = 0; i < tempNode.children.length; i++) {
		
		//console.log(tempNode.children[i].type);
		document.getElementById("taOutput").value += level + tempNode.children[i].type + "\n";			
		
		//TODO: Add if statement here to check for patterns
		addAstBranchNode(tempNode.children[i].type);
				
		traverseConcreteSyntaxTree(tempNode.children[i]);
	}
}

function astNode(type, parent, children) {

	this.type = type;
	this.parent = parent;
	this.children = [];
	
}

function addAstBranchNode(type, parent, children) {

	//Creates a new node object with properties: type, parent(the node _CurrentAstPointer points to), and a children array
	var node = new Node(type, _CurrentCstPointer, children);
	
	if (_CurrentAstPointer === null) {
		//First node is root
		_CSTRoot = node; 
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

function addAstLeafNode(type, parent) {
	//Creates a new node object with properties: type, parent(the node _CurrentAstPointer points to). No child array because it is a leaf node
	var node = new Node(type, _CurrentAstPointer);
	
	if (_CurrentAstPointer === _CSTRoot) {
		//error
	}
	else {
		//Adds the new node to its parents children array
		_CurrentAstPointer.children.push(node);
		//_CurrentAstPointer = node;		
	}
}