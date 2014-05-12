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
	console.log("\nCode Generation Console Messages...\n");
	var tempNode = _ASTRoot;
	expandAstForCodeGen(tempNode); 
	
	if (opCodeArray.length > 255) {
		document.getElementById("taWarnError").value += "ERROR: 6502 program size has exceeded 255 bytes, please shorten your source code\n\n";
		_ErrorCount++;
	}
	
	if (_ErrorCount === 0) {
		backPatch();
		printOpCodes();	
	}
	
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
				document.getElementById("taOutput").value += "\t\tLoad Acc with 0 --> A9 00\n\n";
				//Load Acc with 0
				opCodeArray.push("A9");
				opCodeArray.push("00");
				
				document.getElementById("taOutput").value += "\t\tStore Acc in T"+ staticDataTempIndex + " XX --> 8D T"+ staticDataTempIndex + " XX \n\n";
				//Store Acc is Temp
				opCodeArray.push("8D");
				opCodeArray.push("T" + staticDataTempIndex);
				opCodeArray.push("XX");
				
				document.getElementById("taOutput").value += "\t\tNew Static Table Entry: TEMP: T"+ staticDataTempIndex 
								+ " XX, VARIABLE: " + tempNode.children[i].children[1].value 
								+ ", ADDRESS: To be determined once the beginning of static data is identified\n\n";
				var tableEntry = new StaticTableEntry("T" + staticDataTempIndex + "XX", tempNode.children[i].children[1].value, lengthOfPreviousTemp);
				lengthOfPreviousTemp++; 
				staticDataTable.push(tableEntry);
				staticDataTempIndex++;
			
			}
			
			if (tempNode.children[i].value === "assign") {
				var tempMemAddress;
				console.log("Found an Assign Statement");
				document.getElementById("taOutput").value += "\t\tLoad Acc with input: 0" + tempNode.children[i].children[1].value.toString() 
							+ " --> A9 0" + tempNode.children[i].children[1].value.toString() + "\n\n";
				
				//Load Acc with input
				opCodeArray.push("A9");
				opCodeArray.push("0" + tempNode.children[i].children[1].value.toString());	
				
				//Grabs the temp address stored in the static table for the matching variable
				for (var t = 0; t < staticDataTable.length; t++) {
					//finds the variable
					if (tempNode.children[i].children[0].value === staticDataTable[t].variable) {
						tempMemAddress = staticDataTable[t].temp.slice(0,2).toString();
					}
				}
				
				document.getElementById("taOutput").value += "\t\tStore Acc in "+ tempMemAddress + " XX --> 8D "  + tempMemAddress + " XX\n\n";
				//Store Acc in Temp
				opCodeArray.push("8D");
				opCodeArray.push(tempMemAddress);
				opCodeArray.push("XX");			
			}
			
			if (tempNode.children[i].value === "print") {
				var tempMemAddress;
				console.log("Found an Print Statement");
				//Load Y Reg with contents of variable
				opCodeArray.push("AC");	
				
				//Grabs the temp address stored in the static table for the matching variable
				for (var y = 0; y < staticDataTable.length; y++) {
					if (tempNode.children[i].children[0].value === staticDataTable[y].variable) {
						tempMemAddress = staticDataTable[y].temp.slice(0,2).toString();
					}
				}
				document.getElementById("taOutput").value += "\t\tLoad Y Register with contents of variable --> AC " + tempMemAddress + " XX\n\n";
				
				opCodeArray.push(tempMemAddress);
				opCodeArray.push("XX");
				document.getElementById("taOutput").value += "\t\tLoad X Register with 1 --> A2 01\n\n";
				//Load X Reg with 1
				opCodeArray.push("A2");
				opCodeArray.push("01");
				document.getElementById("taOutput").value += "\t\tPerform System Call --> FF\n\n";
				//System Call
				opCodeArray.push("FF");			
			}
		}
	}
}

function backPatch() {
	console.log("opCodeArray length: " + opCodeArray.length);
	var startStaticData = opCodeArray.length + 1;
	
	//Go through the Static Data table and fill in addresses 
	for (var q = 0; q < staticDataTable.length; q++) {
		if (staticDataTable[q].temp === "T"+ q + "XX") {
			//console.log("Matching: " + staticDataTable[q].temp + " to: " + "T"+ q + "XX");
			document.getElementById("taOutput").value += "\t\tBack Patching T"+ q + "XX to memory address " + startStaticData + "\n\n";
			staticDataTable[q].address = startStaticData;
		}
		//startStaticData = toDecimal(startStaticData);
		startStaticData++;
	}
	
	//****
	var tempIndex = 0;
	for (var z = 0; z < opCodeArray.length; z++) {
		//console.log("Matching: " + opCodeArray[z] + " to: " + "T" + tempIndex);
		if (opCodeArray[z] === "T" + tempIndex) {
			opCodeArray[z] = staticDataTable[tempIndex].address;
			//Function call so that all of the current temp indexes can be backpatched before moving to next index
			backPatchAllOfTheSameTemp(tempIndex);
			tempIndex++;
		}
		 else if (opCodeArray[z] === "XX") {
			 opCodeArray[z] = "00";
		 }
	}
}

function backPatchAllOfTheSameTemp(tempIndexValue) {
	for (var a = 0; a < opCodeArray.length; a++) {
		if (opCodeArray[a] === "T" + tempIndexValue) {
			opCodeArray[a] = staticDataTable[tempIndexValue].address;
		}		
	}
}

//Brings back memories of these conversions from OS
function toHex(aDecimalNum) {
	var hexNum = aDecimalNum.toString(16).toUpperCase();
	return hexNum;
}

function toDecimal(aHexNum) {
	var decimalNum = parseInt(aHexNum, 16);
	return decimalNum;
}

function printOpCodes() {
	var newlineLimit = 0;
	document.getElementById("taOutput").value += "EXECUTABLE CODE:\n\n";
	document.getElementById("taOutput").value += "\t\t";
	for (var index = 0; index < opCodeArray.length; index++) {
		document.getElementById("taOutput").value += (opCodeArray[index] + " ");
		if (newlineLimit > 6) {
			document.getElementById("taOutput").value += "\n\t\t";
			newlineLimit = -1;
		}
		newlineLimit++;
	}
}
