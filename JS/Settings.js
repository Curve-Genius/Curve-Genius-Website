//debug toggle
const debugOn = false;

//entry rows settings
const emptyBoxes = 3;
const entryRows = [];
const blankContent = "-";

//students settings
const autoScore = 80.00;
const autoName = "Test Taker";
const decimalAccuracy = 2;
const students = [];

//panels settings
const autoPanelName = "Curve"
const autoNormalize = false;
const autoCurveType = true;
const autoMean = 80;
const autoDeviation = 8;
const autoMin = 60;
const autoMax = 100;
const autoLimitRange = true;
const autoCenter = false;
const autoLetScoresDrop = false;
const panels = [];

//variables that do not pertain to any specific object
let existsNormal = 0;
let panelCount = 0;
let count = 0;
let mean = 0;
let deviation = 0;
let min;
let max;

const autoSheetExportName = "Student Scores";