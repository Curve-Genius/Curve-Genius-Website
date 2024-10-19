//html element references
const exportFileName = document.getElementById("exportFileName");
const exportBlock = document.getElementById("exportBlock");
const blurBackdrop = document.getElementById('blurBackdrop');

function exportExcel() {
    
    //check if file name exists
    if(exportFileName.value.trim() !== ""){

        //creates a 2d array to store student scores that is eventually converted into a spreadsheet
        const table = [];
        const firstRow = ["Name", "Score", "Origin"]

        //uses data from each panel to create each column heading
        //[Name], Normalize: [Yes/No], Curve Type: [Mean and Deviation/Range], Mean: [Mean], Deviation: [Deviation], Restrict Range: [Yes/No], Min: [Min], Max: [Max], Range Centered: [Yes/No] Let Scores Drop: [Yes/No]
        panels.forEach( panel => {
            let panelHeader = panel.nameInput.value;
            panelHeader +=", Normalize: ";
            if(panel.normalizeButton.checked){
                panelHeader += "Yes"
            } else {
                panelHeader += "No"
            }
            panelHeader +=", Curve Type: ";
            if(panel.curveType){
                panelHeader += "Mean and Deviation, Mean: " + panel.inputMean + ", Deviation: " + panel.inputDeviation + ", Restrict Range: ";
                if(panel.limitRange){
                    panelHeader += "Yes, Min: " + panel.inputMin + ", Max: " + panel.inputMax;
                } else {
                    panelHeader += "No"
                }
            } else {
                panelHeader += "Range, Max: " + panel.inputMax + ", Min: " + panel.inputMin + ", Range Centered: ";
                if(panel.normalizeButton.checked){
                    panelHeader += "N/A";
                } else if(panel.centerRangeButton.checked){
                    panelHeader += "Yes ";
                } else {
                    panelHeader += "No ";
                }
            }
            panelHeader += ", Let Scores Drop: "
            if(panel.letScoresDrop){
                panelHeader += "Yes";
            }  else {
                panelHeader += "No";
            }
            firstRow.push(panelHeader);
        })
        table.push(firstRow)

        //adds student names, raw scores, origins and output scores below respective columns
        students.forEach( obj => {
            let studentExcelInfo = [obj.nameInput.value, obj.score, obj.origin];
            obj.outputs.forEach( elem => {
                studentExcelInfo.push(elem.textContent);
            })
            table.push(studentExcelInfo);
        })

        // Create Excel file and pass the 2d array to fill its values
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(table);
        XLSX.utils.book_append_sheet(workbook, worksheet, autoSheetExportName);
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Create file download with provided name and download it the users computer
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = exportFileName.value.trim() + '.xlsx';
        link.click();
        exportFileName.removeAttribute("aria-invalid");
        exportBlock.style.display = "none";
        blurBackdrop.style.display = 'none';
    } else {
        exportFileName.setAttribute("aria-invalid", true)
    }
}

