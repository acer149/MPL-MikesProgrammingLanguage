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
		if (tempPointer.children.length > 0) {
			printNextLevelOfTree(tempPointer);	
		}	
	for (var i = 0; i < 20; i++) {

		
		for (var j = 0; j < tempPointer.children.length; j++) {
			tempPointer = tempPointer.children[j];	
			printNextLevelOfTree(tempPointer);
		}
			
	}
	//assign temppointer to next child and run printNextLevel
	//If there are no children jump back and run on next child and so forth	
	

	// for (var i = 0; i < tempPointer.children.length; i++) {
		// console.log(tempPointer.children[i].type);
		// tempPointer = tempPointer.children[i];
		// for (var i = 0; i < tempPointer.children.length; i++ ) {
			// console.log(tempPointer.children[i].type);
		// }
	// }
	//console.log(_CSTRoot);
}

function printNextLevelOfTree(tempPointer) {
	if (tempPointer.children.length > 0) {
		for (var i = 0; i < tempPointer.children.length; i++) {
			console.log(tempPointer.children[i].type);
		}
		printNextLevelOfTree(tempPointer);
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
