//entry rows class and their call functions to create students
class EntryRow {
    constructor(){
        
        //creates name and score input elements and adds them to the screen
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

        //creates "-" (null outputs scores) to fill the table under curve columns
        this.whiteSpaces = [];
        panels.forEach(obj => {
            let blank = document.createElement('td');
            blank.textContent = blankContent;
            this.whiteSpaces.push(blank);
            this.wrapper.append(blank);
        });
    }
}

//adds a new student to the screen, to the student array, and updates all values necessary
function addStudent(newElement) {

    if (count === 1) {

        //first student edge case
        students.push(newElement);
        newElement.index = 0;
        newElement.order = 0;
        min = newElement.score;
        max = newElement.score;
        newElement.normZScore = 0;
    } else {
    
        //inserts new element where needed in the ordered array and updates the indices and orders of all other elements
        //index allows a student to store its own location in the students array
        //order is similiar to index, but students with the same score have the same order but not the same index
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
        newElement.order = insertionIndex - insertionOrder;

        //updates min, max, normally distributed Zscores, all distributions, and all displays
        min = students[0].score;
        max = students[count-1].score;
        updateAllNormedZScores();
    }
    updateAll();
    logAllStudents();   
}
