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
    
    function test() {
    
        var code = document.getElementById("regExpTest").value;
        code = trim(code);
        code = code.split("");
        console.log("Source Code: " + code);
        
//        var alphabet = {"a":8, "b":30, "c":8, "d":8, "e":8, "f":39, "g":8, "h":8, "i":16, "j":8, "k":8, "l":8, "m":8, "n":8, "o":8, "p":3, "q":8, "r":8, "s":24, "t":44, "u":8,
//                    "v":8, "w":11, "x":8, "y":8, "z":8, "0":37, "1":37, "2":37, "3":37, "4":37, "5":37, "6":37, "7":37, "8":37, "9":37, "=":9, "+":48, "!=":38, "{":1,
//                    "}":2, "(":20, ")":21, "\"":18, "\"":19, "$":49};
                    
                    
       	//var testAlpha = {"a":4, "b":1, "c":4, "d":4, "e":4};
        
        
        //array[state][nextState]
        var array = [ [{"a":4, "b":1, "c":4, "d":4, "e":4, " ":'T_ID'}],
					  [{"a":4, "b":4, "c":4, "d":4, "e":2, " ":'T_ID'}],
					  [{"a":4, "b":4, "c":4, "d":3, "e":4, " ":'T_ID'}],
					  [{"a":4, "b":4, "c":4, "d":4, "e":4, " ":'T_BED'}],
					  [{"a":4, "b":4, "c":4, "d":4, "e":4, " ":'T_ID'}]        			
        			];
        
        var token = "";
        
        for (var i = 0; i <= code.length; i++ ) {
        	var element = code[i];
        	var nextState = array[i][0][element];
        	//console.log("Next State " + nextState);
        	
        	if (element in array[nextState][0]) { //array[0][0] is the same as alphabet
        		console.log("Element " + element + " is in alphabet and points to the next state " + nextState );
        		
        		
        		token += element;
        		console.log(token);
        		
        	}
        }
        
           
    	//console.log(array[0][1]);
    
    }