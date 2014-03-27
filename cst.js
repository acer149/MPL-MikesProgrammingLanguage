/* cst.js */

function createAndDisplayConcreteSyntaxTree() {
	
	for (var i = 0; i < _TokenArray.length; i++) {
		document.getElementById("taOutput").value += "\n\t" + _TokenArray[i].cstType + "\n";	
	}	
	// document.getElementById("taOutput").value += "\n\t\t Program\n";
	// document.getElementById("taOutput").value += "\n\t\t Block\n";
	// document.getElementById("taOutput").value += "\nStatementList\n";
}