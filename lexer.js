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
    
    var openQuote = false;
    
    function test() {
    
        var code = document.getElementById("regExpTest").value;
        //code.trim();
        code = code.split("");
        console.log("Source Code: " + code);
        console.log("Source Code Length " + code.length);
                    
        
        var matrix = [[{"a":8, "b":30, "c":8, "d":8, "e":8, "f":39, "g":8, "h":8, "i":16, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":3, "q":8, "r":8, "s":24, "t":44, "u":8, "v":8, "w":11, "x":8, "y":8, "z":8, "0":37, "1":37, "2":37, "3":37, "4":37, "5":37, "6":37, "7":37, "8":37, "9":37, "=":9, "+":48, "!=":38, "{":1, "}":2, "(":20, ")":21, "\"":18, "$":49}],
        			  [{" ": 'T_RBRACKET'}],
        			  [{" ": 'T_LBRACKET'}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":4, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":5, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":6, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":7, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8, " ":'T_PRINT'}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8, " ":'T_ID'}],
        			  [{"=":10, " ": 'T_ASSIGN'}],
        			  [{" ": 'T_EQUAL'}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":12, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":13, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":14, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":15, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8, " ":'T_WHILE'}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":17, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":22, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8}],
        			  [{"a":8, "b":8, "c":8, "d":8, "e":8, "f":8, "g":8, "h":8, "i":8, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":8, "q":8, "r":8, "s":8, "t":8, "u":8, "v":8, "w":8, "x":8, "y":8, "z":8, "0":8, "1":8, "2":8, "3":8, "4":8, "5":8, "6":8, "7":8, "8":8, "9":8, " ":'T_IF'}],
        			  [{" ": 'T_QUOTE'}]
        			  
        			  

        			 ];
         
//        var array = [ [{"a":4, "b":1, "c":4, "d":4, "e":4, " ":'T_ID'}],
//					  [{"a":4, "b":4, "c":4, "d":4, "e":2, " ":'T_ID'}],
//					  [{"a":4, "b":4, "c":4, "d":3, "e":4, " ":'T_ID'}],
//					  [{"a":4, "b":4, "c":4, "d":4, "e":4, " ":'T_BED'}],
//					  [{"a":4, "b":4, "c":4, "d":4, "e":4, " ":'T_ID'}]        			
//        			];
        
        var token = "";
        var j = 0;
        
        for (var i = 0; i < code.length; i++ ) {
        	var element = code[i];
        	
        	//console.log("i = " + i);
        	console.log("j = " + j);
        	console.log("Element to check alphabet for " + element);
        	
        	//If not white space progress through the matrix
        	if (element != " ") {
        		console.log("j = " + j);
        		if (element in matrix[j][0]) { //array[0][0] is the same as alphabet
        		
        			var nextState = matrix[j][0][element];
        			console.log("Next State " + nextState);
        		
        			console.log("Element " + element + " is in alphabet and points to the next state " + nextState );
        			
        			j = nextState;
        		
        			token += element;
        			//console.log("Token after processing each element" + token);
        		}
        		//Handles unrecognized symbols
        		else {
        			console.log("Syntax Error");
        			i = code.length + 1; //Stops loop
        		}
	
        	}
        	else {
        		//Set the token label i.e. T_ID
				var label = matrix[j][0][element];
				
				//Check if quotation is an open quote or a closing quote using a global boolean variable: openQuote
				if (openQuote) {
					label = "T_CLOSEQUOTE";
					openQuote = false;
				}
				else {
					label = "T_OPENQUOTE";
					openQuote = true;
				}
				
        		console.log("Here is your token and label: <" + label + " , " + token + ">");
        		
        		//TODO:push to token array
        		//TODO:increment token count
        		
        		token = "";
        		j = 0;
        		
        	}
        }   
    }