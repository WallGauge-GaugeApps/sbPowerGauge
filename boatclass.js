

class boat {
    constructor(Name, Length, Draft, Beam){
        this.name = Name;
        this.length = Length;
        this.draft = Draft;
        this.beam = Beam;

        this.printDetails();
    }

    printDetails(){
        console.log(this.name + " is " + this.length + "' long and "+ this.beam + "' wide.");
        var cubicFeet = this.findSpace(this.length, this.beam, this.draft);
        console.log('If it was a square boat it would have ' + cubicFeet + ' cubic feet of space.');
    }

    findSpace(length, width, depth){
        return length * width * depth;
    }

}

module.exports = boat;