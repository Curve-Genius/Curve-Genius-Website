const Elems = 
["centerRangeButton", "limitRangeButton", "letScoresDropButton", 
"meanInputElem", "inputMean", "deviationInputElem", "inputDeviation", "minInputElem", "inputMin", "maxInputElem", "inputMax", 
"nameLine", "statsLine", "limitRangeLine", "rangeLine", "centerRangeLine",
"closeButton", "normalizeButton", "useMeanAndDeviationButton", "useRangeButton"];

//sets values from settings panel into the model panel that is copied
const modelPanel = document.getElementById("modelPanel");
modelPanel.querySelector(".normalizeButton").checked = autoNormalize;
modelPanel.querySelector(".normalizeButton").checked = autoNormalize;
modelPanel.querySelector(".meanInputElem").value = autoMean;
modelPanel.querySelector(".deviationInputElem").value = autoDeviation;
modelPanel.querySelector(".minInputElem").value = autoMin;
modelPanel.querySelector(".maxInputElem").value = autoMax;
modelPanel.querySelector(".limitRangeButton").checked = autoLimitRange;
modelPanel.querySelector(".centerRangeButton").checked = autoCenter;
modelPanel.querySelector(".letScoresDropButton").checked = autoLetScoresDrop;
if(autoCurveType){
    modelPanel.querySelector(".useRangeButton").classList.add("outline")
} else {
    modelPanel.querySelector(".useMeanAndDeviationButton").classList.add("outline")
}

class CurvePanel extends Named{

    constructor(name){
        //creates name data and name elemenet
        super(name, autoPanelName, panels, "panel");
       
        //index for self removal
        this.index = panelCount++;
        
        //clones model element
        this.wrapper = document.getElementById("modelPanel").cloneNode(true);
        this.wrapper.classList.remove("hidden");

        //creates references to lines and check boxes and adds input update functionality to check and number inputs
        for(let i = 0; i < Elems.length; i++){
            
            //references for all elements in the string Elems
            this[Elems[i]] = this.wrapper.querySelector("." + Elems[i]);
            
            //checkbox functionality
            if(i < 3){
                this[Elems[i]].addEventListener('change', function() {
                    this.updatePanel()
                }.bind(this));
            }

            //input update functionality
            if(i < 10 && i > 2){
                const firstElem = Elems[i];
                const secondElem = Elems[i+1];
                this[secondElem] = parseFloat(this[firstElem].value);
                this[firstElem].addEventListener('blur', function() {
                    this[secondElem] = parseFloat(this[firstElem].value);
                    this.updatePanel()
                }.bind(this));
                i++;
            }
        }

        //adds normaliziation button functionality
        this.normalizeButton.addEventListener('change', function() {
            if(this.normalizeButton.checked){
                existsNormal++;
                if(existsNormal === 1){
                    updateAllNormedZScores();
                }
            } else {
                existsNormal--;
            }
            this.updatePanel();
        }.bind(this));

        //adds name element and closing button to panel
        this.nameLine.insertBefore(this.nameInput , this.closeButton);
        this.nameLine.querySelector(".nameInput").remove();
        this.closeButton.addEventListener('click', function() {
            this.removeSelf();
        }.bind(this));

        //implements code for switching of curve type selection
        this.curveType = autoCurveType;
        this.useMeanAndDeviationButton.addEventListener('click', function() {
            this.curveType = true;
            this.useMeanAndDeviationButton.classList.remove("outline");
            this.useRangeButton.classList.add("outline");
            this.updatePanel();
        }.bind(this));
        this.useRangeButton.addEventListener('click', function() {
            this.curveType = false;
            this.useMeanAndDeviationButton.classList.add("outline");
            this.useRangeButton.classList.remove("outline");
            this.updatePanel();
        }.bind(this));

        
        //adds new outputs for all existing students
        students.forEach( obj => {
            let output = document.createElement("td");
            obj.wrapper.append(output);
            obj.outputs.push(output);
        });
        this.updatePanel();

        //adds whitespaces for all entryRows
        entryRows.forEach( obj => {
            let blank = document.createElement('td');
            blank.textContent = blankContent;
            obj.whiteSpaces.push(blank);
            obj.wrapper.append(blank);
        })

        //adds the panel to the screen
        panelsList.insertBefore(this.wrapper , document.getElementById("addNew"));
    }

    //method to remove panel from the screen and update all respective displays
    removeSelf(){
        
        //updates name data
        this.nameLabel.remove();
        this.removeName();

        //updates index data
        panels.forEach(obj => {
            if(obj.index > this.index){
              obj.index--;
            }
        });
        panelCount--;

        //removes self from screen and from array along side respective output boxes
        this.wrapper.remove();
        panels.splice(this.index, 1);
        students.forEach( obj => {
            obj.outputs[this.index].remove();
            obj.outputs.splice(this.index,1)
        });
        entryRows.forEach(obj => {
            obj.whiteSpaces[0].remove();
            obj.whiteSpaces.splice(0,1);
        });
    }

    //updates all panel outputs given panel settings and statistics
    updatePanel(){
            if(this.curveType){
            
            //if the user is specifing the mean and deviation their is no calculation required for the mean and deviation of the linear transformation, lines that are displayed are updated
            this.transMean = this.inputMean;
            this.transDeviation = this.inputDeviation;
            this.statsLine.classList.remove("hidden");
            this.centerRangeLine.classList.add("hidden");
            this.limitRangeLine.classList.remove("hidden");
            if(this.limitRangeButton.checked){
                this.rangeLine.classList.remove("hidden");
                this.limitRange = true;
            } else {
                this.rangeLine.classList.add("hidden");
                this.limitRange = false;
            }
        } else {

            //the user is specifing a range to fit the data to
            this.centerRangeLine.classList.remove("hidden");
            this.limitRangeLine.classList.add("hidden"); 
            this.statsLine.classList.add("hidden");
            this.rangeLine.classList.remove("hidden");
            if(min === max) {

                //if the  min and max of the set are the same then all the outputs recieve a score which is the average of the specified min and max
                this.transDeviation = 0;
                this.transMean = (this.inputMin + this.inputMax) / 2;
            } else {
                if(this.normalizeButton.checked){
                   
                    //if normalize is the selected the transformation constants need to calculated with respect to the min and max Zscores instead of input scores
                    this.transDeviation = (this.inputMax - this.inputMin) /  (students[count - 1].normZScore - students[0].normZScore);
                    this.transMean = this.inputMin + (this.transDeviation * -1 * students[0].normZScore);
                
                } else if(this.centerRangeButton.checked){

                    //centering fits the mean element to the middle of the specified range and the farthest deviation element to its respective end of the range
                    this.transMean = (this.inputMin + this.inputMax) / 2;
                    this.transDeviation = deviation * (this.inputMax - this.inputMin) / (2 * Math.max(Math.abs(mean - min),Math.abs(mean - max)));        
                } else {

                    //not centering will fit the extreme inputs to the extremes of the range
                    this.transDeviation = deviation * (this.inputMax - this.inputMin) / (max - min);
                    this.transMean = this.inputMin + (this.transDeviation * (mean - min) / deviation);
                }
            }
        }

        //updates variables depending on if the scores are normalized
        if(this.normalizeButton.checked){
            this.normalize = true;

            //there does not need to be an option to center a range because normalizing scores allows you to fit the mean, and extrema to the respective positions on the output range
            this.centerRangeLine.classList.add("hidden");
        } else {
            this.normalize = false;
        }

        //decides whether scores are allowed to be lower than the orginal score or not
        this.letScoresDrop = this.letScoresDropButton.checked;
        this.updateOutputs();
    }

    //updates all the outputs using the mean and deviation for the linear transformation
    updateOutputs(){
        
        students.forEach( obj => {
            let newScore;
            let Zscore;
            
            //chooses between calculated or normalized zscore
            if(this.normalize){
                Zscore = obj.normZScore;
            } else {
                Zscore = obj.zScore;
            }
            
            if(deviation < 0.000001){
                //edge case if all the values are the same
                newScore = roundFloat(this.transMean);
            } else if(this.limitRange ){

                //transformed scores with a range
                newScore = Math.min( Math.max( roundFloat(this.transDeviation * (Zscore) + this.transMean), this.inputMin) ,this.inputMax);
            } else {

                //transformed scores
                newScore = roundFloat(this.transDeviation * (Zscore) + this.transMean);
            }

            //assigns new score, or highest of new and input score to screen depending on settings
            if(this.letScoresDrop){
                obj.outputs[this.index].textContent = roundFloat(newScore);
            } else {
                obj.outputs[this.index].textContent = roundFloat(Math.max(newScore, obj.score));
            }
        });
    }
}