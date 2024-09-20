window.addEventListener('beforeunload', () => {
    saveData();
});

setInterval(function() {
    saveData();
}, 30000);

window.addEventListener('load', () => {
    const loadedCurves = JSON.parse(localStorage.getItem('saveCurves'));
    if(loadedCurves.length > 0){
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
        panels.push( new CurvePanel(''));
    }
    
    const loadedSheets = JSON.parse(localStorage.getItem('saveExcelSheets'));
    loadedSheets.forEach( obj => {
        new excelSheet(null, obj);
        excelListButton.style.display = 'inline-block';
    })
    
    const loadedStudents = JSON.parse(localStorage.getItem('saveManualStudents') )
    loadedStudents.forEach( obj =>{
        if(obj[0] === autoName){
            addStudent(new Student("", obj[1], -1, "Manual Input"));
        } else if(obj[1] === autoScore) {
            addStudent(new Student(obj[0].trim(), NaN, -1, "Manual Input"));
        } else {
            addStudent(new Student(obj[0], obj[1], -1, "Manual Input"));
        }   
    })
});



function clearAll() {
    var confirmed = confirm("Are you sure you want to clear all of the inputted data");
    if (confirmed){
        for(let i = excelfiles.length -1; i > -1; i--){
            excelfiles[i].removeSelf();
        }
    
        for(let i = panels.length -1; i > -1; i--){
            panels[i].removeSelf();
        }
    
        for(let i = students.length -1; i > -1; i--){
            students[i].removeSelf();
        }
    
        localStorage.clear();
        panels.push( new CurvePanel(''));
    }     
}

function saveData() {
    localStorage.setItem('saveExcelSheets', JSON.stringify(saveFiles));
    const manualStudents = [];
    students.forEach( obj => {
        if(obj.spreadsheetNum === -1){
            manualStudents.push([obj.name,obj.score]);
        }
    })
    localStorage.setItem('saveManualStudents', JSON.stringify(manualStudents));
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
