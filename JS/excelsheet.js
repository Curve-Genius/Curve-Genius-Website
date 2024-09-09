const saveFiles = []

class excelSheet {
    constructor(file, reload){
        this.numID = numsheets;
        this.wrapper = document.createElement('li');
        this.checkBox = document.createElement('input');
        this.checkBox.type = "checkbox";
        this.checkBox.id = "sheet" + this.numID;
        this.nameElem = document.createElement('label');
        this.nameElem.setAttribute("for", "sheet" + this.numID);
        this.wrapper.append(this.checkBox);
        this.wrapper.append(this.nameElem);
        excelRemoveList.append(this.wrapper);
        excelfiles.push(this);
        const elemSaveData = [];
        if(reload === null){
            this.nameElem.textContent = file.name.slice(0, -5).trim();        
            elemSaveData.push(file.name.slice(0, -5).trim());

            readXlsxFile(file).then(function(data) {
                const startRow = fileValues['rowstart'] - 1;
                const endRow = fileValues['rowend'] - 1;
                const startColumn = excelColumnToNumber(fileValues["columnnamestart"]);
                const endColumn = excelColumnToNumber(fileValues["columnnameend"]);
                const scoreColumn = excelColumnToNumber(fileValues["columnscore"]);
                for(let i = startRow; i <= endRow; i++){
                    let name = "";
                    let score = parseFloat(data[i][scoreColumn]);

                    for(let j = startColumn; j <= endColumn; j++){
                        
                        name += " " + data[i][j].toString().replace(/\d+/g, '').trim();
                    }
                    
                    if( !isNaN(score) && !(name=="") ){
                        addStudent(new Student(name.trim(), parseFloat(data[i][scoreColumn]), numsheets, file.name.slice(0, -5).trim()));
                    }
                }
                Object.keys(fileValues).forEach(key => fileValues[key] = null);
                inputFile.value = '';
                numsheets++;
                elemSaveData.push(...[startRow, endRow, startColumn, endColumn, scoreColumn]);
                elemSaveData.push(data);
            })
            
        } else {
            this.nameElem.textContent = reload[0].trim();        
            elemSaveData.push(reload[0].trim());  
            const startRow = reload[1]
            const endRow = reload[2]
            const startColumn = reload[3]
            const endColumn = reload[4]
            const scoreColumn = reload[5]
            const data = reload[6]
            for(let i = startRow; i <= endRow; i++){
                let name = "";
                let score = parseFloat(data[i][scoreColumn]);

                for(let j = startColumn; j <= endColumn; j++){
                    
                    name += " " + data[i][j].toString().replace(/\d+/g, '').trim();
                }
                
                if( !isNaN(score) && !(name=="") ){
                    addStudent(new Student(name.trim(), parseFloat(data[i][scoreColumn]), numsheets,reload[0].trim()));
                }
            }
            numsheets++;
            elemSaveData.push(...[startRow, endRow, startColumn, endColumn, scoreColumn]);
            elemSaveData.push(data);
        }
        saveFiles.push(elemSaveData);
    }

    removeSelf(){

        this.wrapper.remove();
        excelfiles.splice(this.numID - 1 , 1);
        saveFiles.splice(this.numID - 1, 1)
        numsheets--;
        excelfiles.forEach( file => {
            if(file.numID > this.numID){
                file.numID--;
                this.checkBox.id = "sheet" + file.numID;
                file.nameElem.setAttribute("for", "sheet" + file.numID);
            }
        })

        for(let i = students.length - 1; i > -1; i--){
            if(students[i].spreadsheetNum === this.numID) {
                students[i].removeSelf();
            } else if (students[i].spreadsheetNum > this.numID){
                students[i].spreadsheetNum--;
            }
        }
    }
}

function removeSheets(){
    for(let i = excelfiles.length - 1; i > -1; i--){
        if(excelfiles[i].checkBox.checked){
            excelfiles[i].removeSelf();
        }
    }
    
    excelList.style.display = 'none';
    blurBackdrop.style.display = 'none';
    if(numsheets == 1){
        excelListButton.style.display = 'none';
    }
}