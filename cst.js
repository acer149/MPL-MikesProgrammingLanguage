/* cst.js */

function createAndDisplayConcreteSyntaxTree() {
	
	for (var i = 0; i < _TokenArray.length; i++) {
		document.getElementById("taOutput").value += "\n\t" + _TokenArray[i].cstType + "\n";	
	}	
	// document.getElementById("taOutput").value += "\n\t\t Program\n";
	// document.getElementById("taOutput").value += "\n\t\t Block\n";
	// document.getElementById("taOutput").value += "\nStatementList\n";
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
		_CurrentCstPointer = node;		
	}
}

function movePointerUpTree() {
	_CurrentCstPointer = _CurrentCstPointer.parent;
}
