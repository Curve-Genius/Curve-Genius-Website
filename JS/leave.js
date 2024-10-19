//saves calculator data to local storage when the tab is closed
window.addEventListener('beforeunload', () => {
    saveData();
});

//saves calculator data to local storage every 30s
setInterval(function() {
    saveData();
}, (dataSaveInterval*1000));

//loads all saved data when the page is loaded
window.addEventListener('load', () => {

    //parses the saved data to an array
    const loadedCurves = JSON.parse(localStorage.getItem('saveCurves'));
    if(loadedCurves.length > 0){
       
        //creates a curve from each saved curve with the proper attributes
        loadedCurves.forEach(obj => {
            let tempCurve
            if(obj[0].trim() == autoPanelName) {
                tempCurve = new CurvePanel("")
            } else {
                tempCurve = new CurvePanel(obj[0].trim())
            }
            panels.push( tempCurve);
            tempCurve.normalize = obj[1];
            tempCurve.normalizeButton.checked = obj[1];
            tempCurve.curveType = obj[2];
            if(obj[1]){
               existsNormal++;
            }
            if(obj[2]){
                tempCurve.useMeanAndDeviationButton.classList.remove("outline");
                tempCurve.useRangeButton.classList.add("outline");
            } else {
                tempCurve.useMeanAndDeviationButton.classList.add("outline");
                tempCurve.useRangeButton.classList.remove("outline");
            }
            tempCurve.inputMean = obj[3];
            tempCurve.inputDeviation = obj[4];
            tempCurve.limitRange = obj[5];
            tempCurve.inputMin = obj[6];
            tempCurve.inputMax = obj[7];
            tempCurve.meanInputElem.value = obj[3];
            tempCurve.deviationInputElem.value = obj[4];
            tempCurve.limitRangeButton.checked = obj[5];
            tempCurve.minInputElem.value = obj[6];
            tempCurve.maxInputElem.value = obj[7];
            tempCurve.letScoresDrop = obj[8];
            tempCurve.letScoresDropButton.checked = obj[8];
            tempCurve.centerRangeButton.checked = obj[9];
            tempCurve.updatePanel();
        })
    } else {

        //if no curves are saved it adds one new curve
        panels.push( new CurvePanel(''));
    }
    
    //parses saved excel sheets to an array
    const loadedSheets = JSON.parse(localStorage.getItem('saveExcelSheets'));
    loadedSheets.forEach( obj => {

        //adds excel sheet
        new excelSheet(null, obj);
        excelListButton.style.display = 'inline-block';
    })
    
    //parses saved students to an array
    const loadedStudents = JSON.parse(localStorage.getItem('saveManualStudents') )
    loadedStudents.forEach( obj =>{

        //adds new students to student list with appropriate autoName/autoScore if necesary
        if(obj[0] === autoName){
            addStudent(new Student("", obj[1], -1, "Manual Input"));
        } else if(obj[1] === autoScore) {
            addStudent(new Student(obj[0].trim(), NaN, -1, "Manual Input"));
        } else {
            addStudent(new Student(obj[0], obj[1], -1, "Manual Input"));
        }   
    })
});


//clears all data from calculator
function clearAll() {

    //asks user to confirm choice
    var confirmed = confirm("Are you sure you want to clear all of the inputted data");
    if (confirmed){

        //removes all excel files
        for(let i = excelfiles.length -1; i > -1; i--){
            excelfiles[i].removeSelf();
        }
    
        //removes all score panels
        for(let i = panels.length -1; i > -1; i--){
            panels[i].removeSelf();
        }
    
        //removes all students
        for(let i = students.length -1; i > -1; i--){
            students[i].removeSelf();
        }
    
        //clears local storage
        localStorage.clear();

        //adds one new panel
        panels.push( new CurvePanel(''));
    }     
}

//saves all calculator data to local storage
function saveData() {

    //saves all spreadsheet data
    localStorage.setItem('saveExcelSheets', JSON.stringify(saveFiles));

    //array to store manually inputted students
    const manualStudents = [];
    students.forEach( obj => {
        if(obj.spreadsheetNum === -1){
            manualStudents.push([obj.name,obj.score]);
        }
    })
    localStorage.setItem('saveManualStudents', JSON.stringify(manualStudents));
    
    //array to store panels and settings stores as array
    const parallelCurveArray = [];
    panels.forEach( obj => {
        let smallCurve = [];
        smallCurve.push(obj.name); //0
        smallCurve.push(obj.normalize); //1
        smallCurve.push(obj.curveType); //2
        smallCurve.push(obj.inputMean); //3
        smallCurve.push(obj.inputDeviation); //4
        smallCurve.push(obj.limitRange); //5
        smallCurve.push(obj.inputMin); //6
        smallCurve.push(obj.inputMax); //7
        smallCurve.push(obj.letScoresDrop); //8
        smallCurve.push(obj.centerRangeButton.checked) //9
        parallelCurveArray.push(smallCurve) 
    })
    localStorage.setItem('saveCurves', JSON.stringify(parallelCurveArray));
}
