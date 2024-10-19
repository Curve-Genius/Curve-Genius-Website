//references to html elements
const fileBlock = document.getElementById("fileBlock");
const excelList = document.getElementById("excelImportList")
const excelListButton = document.getElementById("excelListButton");
const fileInputs = document.querySelectorAll('.fileInput');
const inputFile = document.getElementById("inputFile");
const errorMessage = document.getElementById("errorMessage");
const processButton = document.getElementById("processExcelSheet");
const excelRemoveList = document.getElementById("filesToRemove");

//stores all excelfiles data
const excelfiles = [];
let numsheets = 1;

//stores values inputted from screen
const fileValues = {
    columnnamestart: null, 
    rowstart: null, 
    columnnameend: null, 
    rowend: null, 
    columnscore: null, 
}

//updates fileValues appropriatly when a fileInput element is updated
fileInputs.forEach(input => {
    input.addEventListener('blur', handleEvent); 
});

//?
//add exit if there is no change
//?

//updates fileValues appropriatly when a fileInput element is updated
function handleEvent(event) {

    //reference to updated element and clears any invalid indications or error messages
    const element = event.currentTarget;
    fileInputs.forEach(input => {
        input.removeAttribute('aria-invalid');
        processButton.style.borderColor = '#00000000';
        errorMessage.textContent = "";
    });

    //retrieves non-styling classes from input element
    const elemClassList = element.classList.toString().slice(10).replace(/\s/g, '');

   
    if(elemClassList.startsWith("row")){

        //if elements is row update row values
        fileValues[elemClassList] = parseInt(element.value);

        //if final row comes before initial row, swap row values
        if(fileValues['rowend'] < fileValues['rowstart'] && !(fileValues['rowend'] == null || fileValues['rowstart'] == null )){
            const temp = fileValues['rowend'];
            fileValues['rowend'] = fileValues['rowstart'];
            fileValues['rowstart'] = temp;
        }
    } else if(elemClassList.startsWith("column")) {

        //if element is column, update column values
        fileValues[elemClassList] = element.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
        if(elemClassList.includes("name")){

            //if is a name column and name start column or end column are not defined, then both columns become the inputted column
            if(fileValues['columnnamestart'] == null || fileValues['columnnameend'] == null){
                fileValues['columnnamestart'] = fileValues[elemClassList];
                fileValues['columnnameend'] = fileValues[elemClassList];
            } else if(greaterThanColumn(fileValues['columnnamestart'],fileValues['columnnameend'])){

                //if the name end column comes before the name start columns, they are switched
                const temp = fileValues['columnnamestart'];
                fileValues['columnnamestart'] = fileValues['columnnameend'];
                fileValues['columnnameend'] = temp;
            }
        }
        if( greaterThanColumn(fileValues['columnnameend'],fileValues['columnscore'])){
           
            //if the name end column and the score column are they same, the score column is removed
            if(fileValues['columnnameend'] == fileValues['columnscore']){
                fileValues['columnscore'] = null;
            } else {

                //if the name end column comes after the score column, they are switched
                const pmet = fileValues['columnnameend']
                fileValues['columnnameend'] = fileValues['columnscore']
                fileValues['columnscore'] = pmet;
            }
        }
    }

    //updates all values on screen
    fileInputs[0].value = fileValues['columnnamestart'];
    fileInputs[1].value = fileValues['rowstart'];
    fileInputs[2].value = fileValues['columnscore'];
    fileInputs[3].value = fileValues['rowstart'];
    fileInputs[4].value = fileValues['columnnameend'];
    fileInputs[5].value = fileValues['rowend'];
    fileInputs[6].value = fileValues['columnscore'];
    fileInputs[7].value = fileValues['rowend'];
}

//method to compare order of columns
function greaterThanColumn(a, b) {
   
    //if they are both null or empty return false
    if(b === "" || a === ""){
        return false;
    }
    if(a == null || b == null){
        return false;
    }

    //if a is longer than the b, a comes after, return true
    if(a.length > b.length){
        return true;
    }

    //if b is longer than a, b comes after, return false
    if(b.length > a.length) {
        return false;
    }

    //otherwise, a and b are the same character length, so return the alphanumeric comparison
    return a > b;
}

//processes inputs to create an instance of excel object and respective students
function process() {

    //returns whether inputs are valid, error message if needed, and error code
    const inputInfo = validInputs();
    if(inputInfo[0]){

        //inputs are valid, clear error message and error indications, fileInputs values, and create new excelSheet object
        errorMessage.textContent = "";
        new excelSheet(inputFile.files[0], null);
        fileBlock.style.display = 'none';
        blurBackdrop.style.display = 'none';
        excelListButton.style.display = 'inline-block';
        fileInputs.forEach(input => {
            input.value = "";
        });
        processButton.style.borderColor = 'none';
    } else {
    
        //inputs were not valid, give red border to process button, and update correct error message
        processButton.style.borderColor = '#c84e48d4';
        errorMessage.textContent = inputInfo[1];

        //give a red border to the proper element depending on the error code
        switch(inputInfo[2]){
            case 1:
            case 3:
                fileInputs[1].setAttribute('aria-invalid', true)
                fileInputs[3].setAttribute('aria-invalid', true)
                fileInputs[5].setAttribute('aria-invalid', true)
                fileInputs[7].setAttribute('aria-invalid', true)
                break;
            case 2:
            case 4:
                fileInputs[0].setAttribute('aria-invalid', true)
                fileInputs[2].setAttribute('aria-invalid', true)
                fileInputs[4].setAttribute('aria-invalid', true)
                fileInputs[6].setAttribute('aria-invalid', true)
                break;
        }
    }
}

function validInputs() {

        //file was not added
        if(inputFile.files.length == 0){
            return [false, 'Missing file', 0]
        }   

        // Check if column names are only capital letters
        if (!/^[A-Z]+$/.test(fileValues['columnnamestart']) || !/^[A-Z]+$/.test(fileValues['columnnameend']) || !/^[A-Z]+$/.test(fileValues['columnscore'])) {
            return [false , 'Empty or invalid column entry', 2]; 
        }

        // Check if row numbers are valid
        if (isNaN(fileValues['rowstart']) || isNaN(fileValues['rowend']) || fileValues['rowstart'] == null || fileValues['rowend']==null) {
            return [false, "Invalid row entry", 1];
        }

        //check that columns are in the correct order
        if( greaterThanColumn(fileValues['columnnamestart'], fileValues['columnnameend']) || !greaterThanColumn( fileValues['columnscore'], fileValues['columnnameend']) ){
            return [false, 'Columns are in the incorrect order', 4];
        }

        //check that rows are in the correct order
        if( fileValues['rowstart'] > fileValues['rowend'] ){
            return [false, "Rows are in the incorrect order", 3];
        }

        return [true, "no error", 5]; // All inputs are valid
}

//convers the excel column of letter form to number so it can be used in opening excelsheet data for creation of excelSheet object
function excelColumnToNumber(column) {
    const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.length;
    let result = 0;
  
    for (let i = 0; i < column.length; i++) {
      result = result * base + (column.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
    }
  
    return result - 1;
}
