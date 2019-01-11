const Boat = require("./boatclass.js")

class seaRay extends Boat{
    manafacture(){
        console.log('manafacture = SeaRay');
    }

    findSpace(l,w,d){
        var x = super.findSpace(l,w,d)
        console.log('you are inserting this method into the super class for '+ this.name +' It returned ' + x);
        return x;
    }


}


console.log('setting up classes');
var myBoat = new seaRay('Whos Your Daddy', 48, 4, 15);
myBoat.manafacture();