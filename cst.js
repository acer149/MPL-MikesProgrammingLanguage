/* cst.js */

function displayConcreteSyntaxTree() {
	
	// for (var i = 0; i < _TokenArray.length; i++) {
		// document.getElementById("taOutput").value += "\n\t" + _TokenArray[i].cstType + "\n";	
	// }	
	// document.getElementById("taOutput").value += "\n\t\t Program\n";
	// document.getElementById("taOutput").value += "\n\t\t Block\n";
	// document.getElementById("taOutput").value += "\nStatementList\n";
	
	//console.dir("The tree: " + _CSTRoot.children[0].children[2].type);
	 var tempPointer = _CSTRoot;
	 
	 expandNode(tempPointer);

}


function expandNode(tempNode) {
	for (var i = 0; i < tempNode.children.length; i++) {
		console.log(tempNode.children[i].type);
		expandNode(tempNode.children[i]);
	}
}

var children = [];

function Node(type, parent, children) {

	this.type = type;
	this.parent = parent;
	this.children = [];
	
}
	//_CSTRoot = null;
	//_CurrentCstPointer = null;
function addBranchNode(type, parent, children) {

	var node = new Node(type, _CurrentCstPointer, children);
	
	if (_CurrentCstPointer === null) {
		_CSTRoot = node; 
		_CurrentCstPointer = node;
	}
	else {
		_CurrentCstPointer.children.push(node);
		_CurrentCstPointer = node;
	}
}

function addLeafNode(type, parent) {
	var node = new Node(type, _CurrentCstPointer);
	
	if (_CurrentCstPointer === _CSTRoot) {
		//error
	}
	else {
		_CurrentCstPointer.children.push(node);
		//_CurrentCstPointer = node;		
	}
}

function movePointerUpTree() {
	_CurrentCstPointer = _CurrentCstPointer.parent;
}
