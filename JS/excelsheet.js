//array to store all student data for page reload
const saveFiles = []

//class to open and close excel spreadsheet information
class excelSheet {

    //opens excel sheet from reload or from import
    constructor(file, reload){

        //indexes sheet for self removal
        this.numID = numsheets;

        //creates spreadsheet element in removal list
        this.wrapper = document.createElement('li');
        this.checkBox = document.createElement('input');
        this.checkBox.type = "checkbox";
        this.checkBox.id = "sheet" + this.numID;
        this.nameElem = document.createElement('label');
        this.nameElem.setAttribute("for", "sheet" + this.numID);
        this.wrapper.append(this.checkBox);
        this.wrapper.append(this.nameElem);
        excelRemoveList.append(this.wrapper);

        //adds this element to list of excel files
        excelfiles.push(this);

        //holds data from spreadsheet to be saved and reloaded
        //if information comes directly from file (not from local storage)
        //name
        //row and columns values
        //data
        const elemSaveData = [];

        if(reload === null){

            //name is the spreadsheet name without .xlsx
            this.nameElem.textContent = file.name.slice(0, -5).trim();        
            elemSaveData.push(file.name.slice(0, -5).trim());

            //reads data and adds students
            readXlsxFile(file).then(function(data) {

                //fileValues holds row and column data from user input
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

                //clears fileValues
                Object.keys(fileValues).forEach(key => fileValues[key] = null);
                inputFile.value = '';
                numsheets++;

                //adds row and column data followed by file data.
                elemSaveData.push(...[startRow, endRow, startColumn, endColumn, scoreColumn]);
                elemSaveData.push(data);
            })
            
        } else {

            //reloads data from local storage
            this.nameElem.textContent = reload[0].trim();        
            elemSaveData.push(reload[0].trim());  
            const startRow = reload[1]
            const endRow = reload[2]
            const startColumn = reload[3]
            const endColumn = reload[4]
            const scoreColumn = reload[5]
            const data = reload[6]

            //adds students to screen
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

            //restores data
            elemSaveData.push(...[startRow, endRow, startColumn, endColumn, scoreColumn]);
            elemSaveData.push(data);
        }

        //saves the data to variable that is stored to local storage
        saveFiles.push(elemSaveData);
    }

    //method to remove students from excel sheet
    removeSelf(){

        //removes excel display from "remove list", removes self from list of excelfiles, removes self from saveFiles variable
        this.wrapper.remove();
        excelfiles.splice(this.numID - 1 , 1);
        saveFiles.splice(this.numID - 1, 1)

        //lowers total number of excel sheets and lowers the index of every sheet after it
        numsheets--;
        excelfiles.forEach( file => {
            if(file.numID > this.numID){
                file.numID--;
                this.checkBox.id = "sheet" + file.numID;
                file.nameElem.setAttribute("for", "sheet" + file.numID);
            }
        })

        //iterates through students array backwards to not miss any elements, removes students that came from this excel sheet
        for(let i = students.length - 1; i > -1; i--){
            if(students[i].spreadsheetNum === this.numID) {
                students[i].removeSelf();
            } else if (students[i].spreadsheetNum > this.numID){
                //updates spreadsheet index of students whose index is higher than the sheet being removed
                students[i].spreadsheetNum--;
            }
        }
    }
}

//removes all excelsheets that are selected on popup screen
function removeSheets(){
    for(let i = excelfiles.length - 1; i > -1; i--){
        if(excelfiles[i].checkBox.checked){
            excelfiles[i].removeSelf();
        }
    }
    
    //removes option to remove spreadsheets
    excelList.style.display = 'none';
    blurBackdrop.style.display = 'none';
    if(numsheets == 1){
        excelListButton.style.display = 'none';
    }
}
