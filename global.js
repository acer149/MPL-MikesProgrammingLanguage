/*global.js*/

var _Code = "";
var _TokenArray = [];
var _TokenCount = 0;
var _TokenIndex = 0;
var _LineNumber = 1;
var _ErrorCount = 0;
var _Index = 0;
var _Verbose = true;
var _JustLexVerbose = true;
var _JustParseVerbose = true;
var _IdentifierExists = false;

//CST Pointers
var _CSTRoot = null;
var _CurrentCstPointer = null;


//AST Pointers
var _CurrentAstPointer = null;