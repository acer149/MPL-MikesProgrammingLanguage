/* codeGen.js */

var opCodeArray = [];
var staticDataTempIndex = 0;

var staticDataTable = [];


function StaticTableEntry(temp, variable, address) {
	this.temp = temp;
	this.variable = variable;
	this.address = address;
}

function traverseASTForCodeGen() { //Builds ST and does scope checking
	
	document.getElementById("taOutput").value += "\n\n*****CODE GENERATION*****\n\n";
	console.log("\nCode Generation Console Messages...");
	var tempNode = _ASTRoot;
	expandAstForCodeGen(tempNode); 
	
	backPatch();
	printOpCodes();
	
	console.log(staticDataTable);
	
	document.getElementById("taOutput").value += "\n\n*****END CODE GENERATION*****\n\n";
	
}

function expandAstForCodeGen(tempNode) { 
	
	var lengthOfPreviousTemp = 0;
	
	//Goes through the AST (DFIO) 
	for (var i = 0; i < tempNode.children.length; i++) {
		
		if (_ErrorCount === 0) {
			console.log("Current Node: " + tempNode.children[i].value);
			
			if (tempNode.children[i].value === "varDecl") {
				console.log("Found a Variable Declaration");
				opCodeArray.push("A9");
				opCodeArray.push("00");
				
				opCodeArray.push("8D");
				opCodeArray.push("T" + staticDataTempIndex);
				opCodeArray.push("XX");
				
				var tableEntry = new StaticTableEntry("T" + staticDataTempIndex + "XX", tempNode.children[i].children[1].value, lengthOfPreviousTemp);
				lengthOfPreviousTemp++; 
				staticDataTable.push(tableEntry);
				staticDataTempIndex++;
			
			}
			
			if (tempNode.children[i].value === "assign") {
				var tempMemAddress;
				console.log("Found an Assign Statement");
				opCodeArray.push("A9");
				opCodeArray.push("0" + tempNode.children[i].children[1].value.toString());	
				
				for (var t = 0; t < staticDataTable.length; t++) {
					if (tempNode.children[i].children[0].value === staticDataTable[t].variable) {
						tempMemAddress = staticDataTable[t].temp.slice(0,2);
					}
				}

				
				opCodeArray.push("8D");
				opCodeArray.push(tempMemAddress);
				opCodeArray.push("XX");			
			}
			
			if (tempNode.children[i].value === "print") {
				var tempMemAddress;
				console.log("Found an Print Statement");
				opCodeArray.push("AC");	
				
				for (var y = 0; y < staticDataTable.length; y++) {
					if (tempNode.children[i].children[0].value === staticDataTable[y].variable) {
						tempMemAddress = staticDataTable[y].temp.slice(0,2);
					}
				}
				opCodeArray.push(tempMemAddress);
				opCodeArray.push("XX");

				
				opCodeArray.push("A2");
				opCodeArray.push("01");
				opCodeArray.push("FF");			
			}
		}
	}
}

function backPatch() {
	for (var z = 0; z < opCodeArray.length; z++) {
		if (opCodeArray[z] === "T0") {
			opCodeArray[z] = "2F";
		}
		else if (opCodeArray[z] === "T1") {
			opCodeArray[z] = "30";
		}
		else if (opCodeArray[z] === "XX") {
			opCodeArray[z] = "00";
		}
	}
}

function printOpCodes() {
	var newlineLimit = 0;
	for (var index = 0; index < opCodeArray.length; index++) {
		document.getElementById("taOutput").value += (opCodeArray[index] + " ");
		if (newlineLimit > 6) {
			document.getElementById("taOutput").value += "\n";
			newlineLimit = -1;
		}
		newlineLimit++;
	}
}