//class to be implemented into classes that have interactable names
class Named{

    //sets name and creates name element and defines array of objects that names are compared within
    constructor(name, auto, array, childType){
        
        //defines variables for later access
        this.autoName = auto;
        this.array = array;
        this.childType = childType;

        //different html needed for panel and student
        if(childType === "panel"){
            this.nameLabel = document.createElement("td");
            document.getElementById("scoresLabels").append(this.nameLabel);
            this.nameInput = document.getElementById("modelPanel").querySelector(".nameInput").cloneNode(true);
        } else {
            this.nameInput = document.createElement('input');
        }
        this.nameInput.type = "text";

        //sets the name and updates all the name variables
        this.setName(name, 1);
        if(childType === "panel"){
            this.nameLabel.textContent = this.updateDisplayName();
            this.nameInput.placeholder = "Curve Name"
        }
        
        //name update function call
        this.nameInput.addEventListener('blur', function() {
            this.changeName();
        }.bind(this));
    }

    //sets the name of a new element
    setName(name, isNew){
        
        //auto name if needed, includes addition or removal of auto name class
        if( name.length === 0){ 
            this.name = this.autoName; 
            this.nameInput.setAttribute("aria-invalid", true);
            this.nameInput.classList.add("auto");
        } else { 
            this.name = name; 
            this.nameInput.removeAttribute("aria-invalid");
            this.nameInput.classList.remove("auto");
        }

        //updates name indices and repeat boolean with addition of new name
        const sameNames = this.array.filter(obj => obj.name === this.name)
        this.nameIndex = sameNames.length + isNew;
        if( this.nameIndex > 1){
            this.nameRepeats =  true;

            //updates repeat bolean if name is newley repeating and updates display of the name
            if( this.nameIndex === 2) {
                let update = sameNames.find(obj => obj.nameIndex === 1);
                update.nameRepeats = true;
                update.updateDisplayName();
            }
        } else {
            this.nameRepeats = false;
        }
        //updates display of this name
        this.updateDisplayName();
    }

    //method when name is changed
    changeName(){

        //checks if name recieved a legitimate change
        const newName = this.nameInput.value.replace(/\d/g, '').trim();
        if(newName === this.name || (newName === "" && this.nameInput.className.includes("auto")) ){
            this.updateDisplayName();
            return;
        }
        //if the name is removed it checks the child class to see if the object should remove itself
        if(this.childType === "Student"){
            if(newName === "" && this.scoreInput.className.includes("auto")){
                this.removeSelf();
                return;
            }
        }
        
        //updates data for the removal of the old name and the addition of the new name
        this.removeName();
        this.setName(newName, 0);

        logAllStudents()
    }

    //updates the display name depending on if an index is required after
    updateDisplayName() {
        
        if(this.childType === "panel"){
            if(this.nameRepeats === true){
                this.nameInput.value = this.name + " " + this.nameIndex;
            } else {
                this.nameInput.value = this.name;
            }
           this.nameLabel.textContent = this.nameInput.value;
           return this.nameInput.value;
        } else {
            if(this.nameRepeats === true){
                this.nameInput.value = this.name + " " + this.nameIndex;
            } else {
                this.nameInput.value = this.name;
            }
        }
    }

    //updates name data when a name is removed
    removeName(){
        
        //no updates necessary if the name doesn't repeat
        if(this.nameRepeats){

            const sameNames = this.array.filter(obj => obj.name === this.name)
            //updates name data if name repeats
            if(sameNames.find(obj => obj.nameIndex === 3)){
                sameNames.forEach(obj => {
                    if( obj.nameIndex > this.nameIndex){
                        obj.nameIndex--;
                        obj.updateDisplayName();
                    }
                });
            } else {

                //if there is only one other object with the same name its name index is set to 1 and its repeat parameter is set to false
                const twinElem = sameNames.find(obj => obj.index !== this.index);
                twinElem.nameRepeats = false;
                if(this.nameIndex === 1){
                    twinElem.nameIndex--;
                }
                twinElem.updateDisplayName();
            }
        }
    }
}
