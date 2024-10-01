const exportFileName = document.getElementById("exportFileName");
const exportBlock = document.getElementById("exportBlock");
const blurBackdrop = document.getElementById('blurBackdrop');

function exportExcel() {
``

    if(exportFileName.value.trim() !== ""){
        const table = [];
        const firstRow = ["Name", "Score", "Origin"]
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

        students.forEach( obj => {
            let studentExcelInfo = [obj.nameInput.value, obj.score, obj.origin];
            obj.outputs.forEach( elem => {
                studentExcelInfo.push(elem.textContent);
            })
            table.push(studentExcelInfo);
        })

        // Create Excel workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(table);

        // Add worksheet to workbook and generate Excel file
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Scores');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Create   download link
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

