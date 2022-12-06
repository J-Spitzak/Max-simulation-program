

class environment {

    populations = {};

    printPop(){
        console.log(this.populations);
        for (let i = 0; i < Object.keys(this.populations).length; i++){
            console.log(Object.keys(this.populations)[i], " = ", this.populations[this.populations[i]].print());
        }
    }

    pop_setup(){
        this.populations["birds"] = new populations(500, 450, 100);
        this.populations["worms"] = new populations(2500, 3000, 400);
        this.populations["birds"].dependencies = [[[[this.populations["worms"],5]],5]];
        this.printPop();
        //this function is no longer called, the  "setup" function in this class is currently what is run...
        //and sets up the populations based on user input
    }

    run(){
        while(true){
            var New = this.populations;
            // ^ creating new copy of population values to store new values...
            // isolated from old ones that the simulation is running on

            var extinct = [];

            for (const population in New) {
                New[population].increment();

                console.log(`${population}: ${New[population].population.num}`);
                
                if (New[population].population.num <= 0){
                    console.log(population, "went extinct");
                    extinct.push(population);
                }
            }

            for (const ex in extinct){
                for (const population in New){
                    if (population == ex){
                        delete New[population];
                    }
                }
            }

            this.populations = New;
            
        }
    }
}

