/* semanticAnalysis.js */

var astLevel = "";
var treeLevel = 1;
var b = 0;

function traverseAST() {
	
	var tempNode = _ASTRoot;
	expandAst(tempNode);
}
function expandAst(tempNode) {
	astLevel = "";
	treeLevel += 1; 
	//Goes through the AST (DFIO) 
	for (var i = 0; i < tempNode.children.length; i++) {
				
		 for (var j = 1; j < treeLevel; j++) {
			 astLevel += "|----";	
		 }
		 
		//Manage verbose output, shows root node of ast
	 	if(_Verbose && _JustASTVerbose && b === 0) {
	 		document.getElementById("taOutput").value += tempNode.type + "\n";
	 		b++;	
	 	}
	 				
		printASTVerboseOutput(astLevel, tempNode.children[i].type);	
				
		expandAst(tempNode.children[i]);
	}
	//astLevel -= "-";
	treeLevel -= 1;
}



