//class containing inputs and student functions
class Student extends Named{
    constructor(name, score, sheetNum, sheetName) {

        //name and score elements created and added to document
        super(name, autoName, students, "Student");
        addStudentInputs(this , "student");
        this.scoreInput.addEventListener('blur', function() {
            this.changeScore();
            logAllStudents();
        }.bind(this));

        //spreadsheet reference for removal of spreadsheet
        this.spreadsheetNum = sheetNum;
        this.origin = sheetName;

        //index for use in self removal gets rewritten in entry rows
        this.index = -1;

        //checks if student needs auto score or not
        if(isNaN(score)){
            this.score = autoScore;
            this.scoreInput.classList.add("auto");
            this.scoreInput.setAttribute("aria-invalid", true);
        } else {
            this.score = score;
            this.scoreInput.classList.remove("auto", "aria-invalid");
            this.scoreInput.removeAttribute("aria-invalid");
        }
        this.scoreInput.value = roundFloat(this.score);

        //updates stats on addition of student
        let newMean = ((mean * count) + this.score)/(++count);
        deviation = Math.sqrt(Math.max( (((this.score - newMean ) ** 2 ) + (count - 1) * ((deviation ** 2) + ((mean - newMean) ** 2))) / (count) , 0 ));
        mean = newMean;
        if(deviation < 0.00001){
            this.zScore = 0;
        } else {
            this.zScore = (this.score - mean) / deviation;
        }

        updateZscores(deviation, mean);
        
        //updates on screen stats
        updateDisplayStats();

        //creates output boxes and gives them all the score 80 which will be over ridden when all the boxes are updated
        this.outputs = [];
        panels.forEach(obj => {
            let output = document.createElement('td');
            this.outputs.push(output);
            this.wrapper.append(output);
        });
    }

    //method when score is changed
    changeScore(){
        let newScore = parseFloat(this.scoreInput.value);

        //checks if score recieved a legitimate change
        if(newScore === this.score){
            this.scoreInput.value = this.score;
            this.scoreInput.classList.remove("auto");
            this.scoreInput.removeAttribute("aria-invalid");
            return;
        }

        //if the score was removed it removes the object or 
        if(isNaN(newScore)){
            if(this.nameInput.className.includes("auto")){
                this.removeSelf();
                return;
            } else {
               newScore = autoScore;
               this.scoreInput.classList.add("auto", "aria-invalid");
               this.scoreInput.setAttribute("aria-invalid", true);
               this.scoreInput.value = newScore;
            } 
        } else {
            this.scoreInput.classList.remove("auto");
            this.scoreInput.removeAttribute("aria-invalid");
        }
        this.scoreInput.value = roundFloat(newScore);
        
        //gives element a temporary order value that it pushes up or down depending on the entries between it's old and new values
        students.splice(this.index, 1)
        let insertionIndex = 0;
        let insertionOrder = 0;

        //differening code depending on if the new score goes up or down
        if(this.score < newScore){
            students.forEach( obj => {

                //updates orders, indices, and normalized zscores as it goes through the loop
                if(obj.score < this.score){
                    insertionIndex++;
                } else if(obj.score === this.score){
                    insertionIndex++;
                    obj.order-=0.5;
                    obj.updateNormedZScore();
                    if(obj.index > this.index)
                        obj.index--;
                } else if(obj.score > this.score && obj.score < newScore){
                    obj.order--;
                    obj.updateNormedZScore();
                    obj.index--;
                    insertionIndex++;
                } else if(obj.score === newScore){
                    insertionIndex++;
                    insertionOrder-=0.5;
                    obj.order-=0.5
                    obj.updateNormedZScore();
                    obj.index--;
                }
            });
        } else {

            //updates orders, indices, and normalized zscores as it goes through the loop
            students.forEach( obj => {
                if(obj.score < newScore){
                    insertionIndex++;
                } else if(obj.score === newScore){
                    insertionOrder+=0.5;
                    obj.order+=0.5;
                    obj.updateNormedZScore();
                    obj.index++;
                } else if(obj.score > newScore && obj.score < this.score){
                    obj.order++;
                    obj.updateNormedZScore();
                    obj.index++;
                } else if(obj.score === this.score){
                    obj.order+=0.5
                    obj.updateNormedZScore();
                    if(obj.index < this.index)
                        obj.index++;
                }
            });
        }
        students.splice(insertionIndex, 0, this);
        this.order = insertionIndex + insertionOrder;
        this.updateNormedZScore();
        this.index = insertionIndex;
       
        //updates stats upon score change
        let oldScore = this.score;
        this.score = newScore;
        let newMean = (mean * count + this.score - oldScore) / count ;
        deviation = Math.sqrt( Math.max(deviation ** 2 + ((this.score - oldScore) * (oldScore + this.score - newMean - mean))/count, 0));
        mean = newMean;
        this.zScore = (this.score - mean) / deviation;
        min = students[0].score;
        max = students[count-1].score;
        updateZscores(deviation, mean);
        updateAll();
      
        //updates on screen stats
        updateDisplayStats();
    }

    //updates the normalized Zscore of the object
    updateNormedZScore(){
        this.normZScore =  adjInvErf( (2 * this.order + 1)/count - 1);
    }

    //method to remove a student from the table
    removeSelf(){
        
        //updates name data and score data
        this.removeName();
        students.splice(this.index, 1);
        students.forEach(obj => {
            if(obj.order > this.order){
                obj.order--;
                obj.index--;
            } else if (obj.order === this.order){
                obj.order-=0.5;
            }
        }); 

        //updates mean and deviation
        if(count - 1 === 0){
            mean = 0;
            deviation = 0;
            count--;
        } else {
            let newMean =  (((mean * count) - this.score ) / --count);
            deviation = Math.sqrt( Math.max(  (((count+1) * (deviation ** 2) - ((this.score - mean) ** 2)) / count) - ((mean - newMean) ** 2) , 0))  ;
            mean = newMean; 
        }
        
        //updates all variables for other elements that change update removing self
        if(count > 0){
            min = students[0].score;
            max = students[count-1].score;
        }
        updateZscores(deviation, mean);
        updateAllNormedZScores();
        updateAll();

        //remove self from screen and from array
        this.wrapper.remove();

        //updates on screen stats
        updateDisplayStats();

        logAllStudents()
    }
}
