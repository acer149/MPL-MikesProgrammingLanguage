/* lexer.js  */

    function lex()
    {
        // Grab the "raw" source code.
        var sourceCode = document.getElementById("taSourceCode").value;
        // Trim the leading and trailing spaces.
        sourceCode = trim(sourceCode);
        // TODO: remove all spaces in the middle; remove line breaks too.
        return sourceCode;
    }
    
    
    var tokenArray = [];
    var tokenCount;
    
    var lineNumber = 1;;
    
    var openQuote = false;
    var endOfFileReached = false;
    
    function test() {
    	document.getElementById("taOutput").value = "";
    	document.getElementById("taOutput").value = "Lexing in Process:";
    	
        var code = document.getElementById("taSourceCode").value;
        //code.trim();
        code = code.split("");
        console.log("Source Code: " + code);
        console.log("Source Code Length " + code.length);
                    
        
        var matrix = [[{"a":8, "b":30, "c":8, "d":8, "e":8, "f":39, "g":8, "h":8, "i":16, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":3, "q":8, "r":8, "s":24, "t":44, "u":8, "v":8, "w":11, "x":8, "y":8, "z":8, "0":37, "1":37, "2":37, "3":37, "4":37, "5":37, "6":37, "7":37, "8":37, "9":37, "=":9, "+":48, "!":38, "{":1, "}":2, "(":20, ")":21, "\"":18, "$":49}],
        			  [{" ": 'T_RBRACKET', "\n":'T_RBRACKET'}],
        			  [{" ": 'T_LBRACKET', "\n":'T_LBRACKET'}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":4, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":5, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":6, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":7, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8, " ":'T_PRINT', "\n":'T_PRINT'}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8, "\"":50, " ":'T_ID', "\n":'T_ID'}],
        			  [{"=":10, " ": 'T_ASSIGN'}],
        			  [{" ": 'T_EQUAL'}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":12, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":13, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":14, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":15, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8, " ":'T_WHILE', "\n":'T_WHILE'}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":17, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":22, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8, " ":'T_IF', "\n":'T_IF'}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8," ": 'T_QUOTE', "\n":'T_QUOTE'}],
        			  ["Placeholder"],
        			  [{" ": 'T_OPENPAREN', "\n":'T_OPENPAREN'}],
        			  [{" ": 'T_CLOSEPAREN', "\n":'T_CLOSEPAREN'}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":23, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8, " ":'T_INT', "\n":'T_INT'}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":25, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":26, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":27, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":28, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":29, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8, " ":'T_STRING', "\n":'T_STRING'}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":31, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":32, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":33, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":34, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":35, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":36, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8, " ":'T_BOOLEAN', "\n":'T_BOOLEAN'}],
					  [{" ":'T_DIGIT', "\n":'T_DIGIT'}],
					  [{"=":10}],
					  [{"a":40, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":41, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":42, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":43, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8, " ":'T_FALSE', "\n":'T_FALSE'}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":45, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":46, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":47, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
					  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8, " ":'T_TRUE', "\n":'T_TRUE'}],
					  [{" ":'T_PLUS', "\n":'T_PLUS'}],
					  [{" ":'T_EOF', "\n":'T_EOF', "":'T_EOF'}],
					  [{" ":'T_STRINGEXP', "\n":'T_STRINGEXP'}]
        			 ];
                 
        var token = "";
        var j = 0;
        
        for (var i = 0; i < code.length; i++ ) {
        	var element = code[i];
        	
        	//console.log("i = " + i);
        	console.log("j = " + j);
        	console.log("Element to check alphabet for " + element);
        	document.getElementById("taOutput").value = "Checking alphabet for " + element;
        	
        	//If not white space progress through the matrix
        	if (element != " " && element !="\n" && element != "$" && !endOfFileReached) {
        		console.log("j = " + j);
        		if (element in matrix[j][0]) {
        		
        			var nextState = matrix[j][0][element];
        			console.log("Next State " + nextState);
        		
        			console.log("Element " + element + " is in alphabet and points to the next state " + nextState );
        			
        			//Sets j to the next state that the DFA should visit
        			j = nextState;
        			        		
        			//Builds the token
        			token += element;
        			//console.log("Token after processing each element" + token);
        		}
        		//Handles unrecognized symbols
        		else {
        			console.log("Syntax error on line " + lineNumber);
        			document.getElementById("taOutput").value = "Syntax error on line " + lineNumber;
        			
        			i = code.length + 1; //Stops loop
        		}
	
        	}
        	//When whitespace or newline is encountered
        	else {
        		//Set the token type (T_ID, T_PRINT, etc.)
				var type = matrix[j][0][element];
				console.log("Type " + type);
				
				//Check if quotation is an open quote or a closing quote using a global boolean variable: openQuote
				if (type == "T_QUOTE" && openQuote) {
					type = "T_CLOSEQUOTE";
					openQuote = false;
				}
				else if (type == "T_QUOTE" && !openQuote) {
					type = "T_OPENQUOTE";
					openQuote = true;
				}
				
				//Check if there is ! before = sign, if there is set type to T_NOTEQUAL
				if (type == "T_EQUAL" && token.length > 1) {
					type = "T_NOTEQUAL";
				}
				
				//Check for EOF
				if (element === "$") {
					token = element;
					type = "T_EOF";
					endOfFileReached = true;	
				}
				
				//Throw warning if there is anything after $
				if (endOfFileReached) {
					i = code.length + 1; //Stops loop
					warnings();
				}
				
				if (i === code.length-1 && !endOfFileReached) {
					warnings();
				}
				
				//If newline, increment line count
				if (element === "\n") {
					lineNumber++;
				}
						
        		console.log("Here is your token and type: <" + type + " , " + token + ">");
        		document.getElementById("taOutput").value = "Token created: <" + type + " , " + token + ">";
        		
        		//Type check prevents extra spaces from becoming undefined tokens
        		if (type != undefined) {
        			//TODO:push to token array
        			newToken(type, token);
        			//TODO:increment token count
        			tokenCount++;
        		}
        		
        		token = ""; //Clear out previous token
  	    		j = 0; //reset the DFA to state zero  	    		
        		
        	}
        }  
        console.log(tokenArray); //Prints out token array
    }
    
    
function newToken(type, token) {
	var newToken = "<" + type + " , " + token + ">";
	
	tokenArray.push(newToken);
	
}
    

function warnings() {
	
	//Warns of excess code after EOF marker
	if (endOfFileReached) {
		console.log("WARNING: There is stuff after the EOF marker, this will be ignored.");
		document.getElementById("taOutput").value = "WARNING: There is stuff after the EOF marker, this will be ignored.";
	}
	
	//Warns if EOF was reached without reading a $. Inserts $
	if (!endOfFileReached) {
		console.log("WARNING: EOF was reached without the use of '$'. I have inserted this symbol for you.");
		document.getElementById("taOutput").value = "WARNING: EOF was reached without the use of '$'. I have inserted this symbol for you.";
		
		var code2 = document.getElementById("taSourceCode").value;
		code2 += "\n\n$";
		document.getElementById("taSourceCode").value = code2;
	}	
}
