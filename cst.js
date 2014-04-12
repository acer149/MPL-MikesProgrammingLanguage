/* cst.js */

function displayConcreteSyntaxTree() {
	
	// for (var i = 0; i < _TokenArray.length; i++) {
		// document.getElementById("taOutput").value += "\n\t" + _TokenArray[i].cstType + "\n";	
	// }	
	// document.getElementById("taOutput").value += "\n\t\t Program\n";
	// document.getElementById("taOutput").value += "\n\t\t Block\n";
	// document.getElementById("taOutput").value += "\nStatementList\n";
	
	//console.dir("The tree: " + _CSTRoot.children[0].children[2].type);
	//Assigns the tree to a temporary pointer and maintains a reference to the root
	 var tempPointer = _CSTRoot;
	 console.log(_CSTRoot);
	 document.getElementById("taOutput").value += "\n\n*****CONCRETE SYNTAX TREE*****\n\n";
	 expandCstNode(tempPointer);
	 document.getElementById("taOutput").value += "\n\n*****END CONCRETE SYNTAX TREE*****\n\n";

}

var cstLevel = "";
var cstTreeLevel = 1;
function expandCstNode(tempNode) {
	cstLevel = "";
	cstTreeLevel += 1; 
	//Goes through the AST (DFIO) and prints out the nodes 
	for (var i = 0; i < tempNode.children.length; i++) {
		//console.log("In expandAstNode"); 
		//console.log(tempNode.children[i].type);
		
		// for (var j = 0; j < cstTreeLevel; j++) {
			// cstLevel += "----";	
		// }
		
		for (var j = 1; j < cstTreeLevel; j++) {
			
			if (j === 1) {
				cstLevel += "";
			}
			else {
				cstLevel += "|----";
			}
			 	
		 }
		
		document.getElementById("taOutput").value += cstLevel + tempNode.children[i].type + "\n"; // " at tree level " + cstTreeLevel + "\n";			
				
		expandCstNode(tempNode.children[i]);
	}
	cstTreeLevel -= 1;
}



// function expandBlockNode() {
// 	
// }

var children = [];

function Node(type, parent, children) {

	this.type = type;
	this.parent = parent;
	this.children = [];
	
}
	//_CSTRoot = null;
	//_CurrentCstPointer = null;
function addBranchNode(type, parent, children) {

	//Creates a new node object with properties: type, parent(the node _CurrentCSTPointer points to), and a children array
	var node = new Node(type, _CurrentCstPointer, children);
	
	if (_CurrentCstPointer === null) {
		//First node is root
		_CSTRoot = node; 
		//Assign new node to the current pointer
		_CurrentCstPointer = node;
	}
	else {
		//Adds the new node to its parents children array
		_CurrentCstPointer.children.push(node);
		//Assign new node to the current pointer
		_CurrentCstPointer = node;
	}
}

function addLeafNode(type, parent) {
	//Creates a new node object with properties: type, parent(the node _CurrentCSTPointer points to). No child array because it is a leaf node
	var node = new Node(type, _CurrentCstPointer);
	
	if (_CurrentCstPointer === _CSTRoot) {
		//error
	}
	else {
		//Adds the new node to its parents children array
		_CurrentCstPointer.children.push(node);
		//_CurrentCstPointer = node;		
	}
}

function movePointerUpTree() {
	//Steps back up the tree
	_CurrentCstPointer = _CurrentCstPointer.parent;
}
