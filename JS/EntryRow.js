//entry rows class and their call functions to create students
class EntryRow {
    constructor(){
        
        //adds name and score display boxes
        addStudentInputs(this, "entryRow");

        //adds call functions when a Student is created
        this.nameInput.addEventListener('blur', function() {
            if( this.nameInput.value.replace(/\d/g , "").trim() !== ""){
                addStudent(new Student(this.nameInput.value.replace(/\d/g , "").trim(), NaN, -1, "Manual Input"));
            }
            this.nameInput.value = "";
        }.bind(this));
        this.scoreInput.addEventListener('blur', function() {
            if(this.scoreInput.value !== ""){
                addStudent(new Student("", parseFloat(this.scoreInput.value), -1, "Manual Input"));
            }    
            this.scoreInput.value = "";
        }.bind(this));

        //creates whitespace to fill the table under curve columns
        this.whiteSpaces = [];
        panels.forEach(obj => {
            let blank = document.createElement('td');
            blank.textContent = blankContent;
            this.whiteSpaces.push(blank);
            this.wrapper.append(blank);
        });
    }

    //updates various values and displays when a new student is added
    
}

function addStudent(newElement) {

    //first student edge case
    if (count === 1) {
        students.push(newElement);
        newElement.index = 0;
        newElement.order = 0;
        min = newElement.score;
        max = newElement.score;
        newElement.normZScore = 0;
    } else {
    
    //inserts new element where needed in the ordered array and updates the indices and orders of all other elements
    let insertionIndex = 0;
    let insertionOrder = 0;
    students.forEach( obj => {
        if(obj.score < newElement.score){
            insertionIndex++;
        } else if (obj.score === newElement.score){
            insertionIndex++;
            insertionOrder+=0.5;
            obj.order+=0.5;
        } else {
            obj.index++;
            obj.order++;
        }
    });
    students.splice(insertionIndex, 0, newElement);
    newElement.index = insertionIndex;
    newElement.order = insertionIndex - insertionOrder;

    //updates min, max, normally distributed Zscores, all distributions, and all displays
    min = students[0].score;
    max = students[count-1].score;
    updateAllNormedZScores();
    }
    updateAll();
    logAllStudents();   
}