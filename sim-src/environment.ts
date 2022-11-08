class environment {

    populations = {};

    printPop(){
        console.log(this.populations);
        for (let i = 0; i < this.populations.keys(); i++){
            console.log(this.populations.keys()[i], " = ", this.populations[this.populations.keys()[i]].print())
        }
    }
}