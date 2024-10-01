//debug functions
function logAllStudents(){
    if(debugOn){

        //group stats
        console.log("*****");
        console.log("");
        console.log("min: " + min);
        console.log("max: " + max);
        console.log("deviation: " + deviation);
        console.log("mean: " + mean);
        console.log("count: " + count);
        console.log("");

        //individuals stats and info
        students.forEach(obj => {
            console.log("name: " + obj.name);
            console.log("nameIndex: " + obj.nameIndex);
            console.log("nameRepeats: " + obj.nameRepeats);
            console.log("score: " + obj.score);
            console.log("order: " + obj.order);
            console.log("index: " + obj.index);
            console.log("zScore: " + obj.zScore);
            console.log("normedZScore: " + obj.normZScore);
            console.log("");
        });

        panels.forEach(obj => {
            console.log("name: " + obj.name);
            console.log("nameIndex: " + obj.nameIndex);
            console.log("normalize: "+ obj.normalize);
        })
    }
}

//rounds numbers and parses them as float data type
function roundFloat(num){
    return parseFloat( num.toFixed(decimalAccuracy));
}



//updates the Zscores for all students
function updateZscores(){

    //edge case if all scores are the same, accounts for rounding errors
    if(deviation < 0.000001){
        students.forEach( obj => {
            obj.zScore = 0;
        });
        deviation = 0;
    } else {
        students.forEach( obj =>{
            obj.zScore = (obj.score - mean) / deviation;
        });
    }
}

//updates curves for all panels
function updateAll(){
    panels.forEach( obj => {
        obj.updatePanel();
    })
}

//updates the normally distributed Zscores for all elements 
function updateAllNormedZScores() {
    
    if(existsNormal > 0) {
        students.forEach( obj => {
            obj.normZScore = adjInvErf( (2 * obj.order + 1)/count - 1);
        });;
    }
}

//stegun and abramowitz approximation of the sqrt(2) * inverse error function with maximum relative error of 0.00013
const sqrtTwo = Math.sqrt(2);
function adjInvErf(x) {
    const a  = 0.147  
    const b = 2/(Math.PI * a) + Math.log(1-x**2)/2
    const sqrt1 = Math.sqrt( b**2 - Math.log(1-x**2)/a )
    const sqrt2 = Math.sqrt( sqrt1 - b )
    return sqrtTwo * sqrt2 * Math.sign(x);
}

//adds creates a name and score input for a student input and adds it to its respective location on the screen
function addStudentInputs(obj, childType) {

    //students will already have a name element from Named, entry rows will need one
    if(childType === "entryRow"){
        obj.nameInput = document.createElement("input");
        obj.nameInput.type = "text";
    }

    //creates table row and wrappers for name and score inputs
    obj.wrapper = document.createElement("tr");
    obj.nameWrapper = document.createElement("th");
    obj.nameWrapper.append(obj.nameInput);
    obj.scoreWrapper = document.createElement("th");
    obj.scoreInput = document.createElement("input");
    obj.scoreInput.type = "number";

    //sets placeholders
    obj.scoreInput.placeholder = "Score"
    obj.nameInput.placeholder = "Student Name"

    //adds all elements to the document
    obj.scoreWrapper.append(obj.scoreInput);
    obj.wrapper.append(obj.nameWrapper);
    obj.wrapper.append(obj.scoreWrapper);
    if(childType === "entryRow") {
        document.getElementById("addStudents").append(obj.wrapper);
    } else if (childType === "student") {
        document.getElementById("studentTable").append(obj.wrapper);
    }
}

const studentCountDisplay = document.getElementById("studentCountDisplay");
const averageDisplay = document.getElementById("averageDisplay");
const deviationDisplay = document.getElementById("deviationDisplay")


function updateDisplayStats(){
    studentCountDisplay.textContent = count;
    if(count > 0){
        averageDisplay.textContent = roundFloat(mean);
        deviationDisplay.textContent = roundFloat(deviation);
    } else {
        averageDisplay.textContent = "-";
        deviationDisplay.textContent = "-";
    }
}
