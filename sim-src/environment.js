



//environment.js

class environment {

    populations = {};

    printPop(){
        console.log("this.populations: \n")
        console.log(this.populations);

        for (let key in this.populations) {
            console.log("key = " + key);
            console.log(" \n(this.populations)[key] \n")
            console.log(this.populations[key]);
            console.log(this.populations[key], " = ", this.populations[key].print());            
        }
    }

    pop_setup(){
        this.populations["birds"] = new population(500, 450, 100);
        this.populations["worms"] = new population(2500, 3000, 400);
        this.populations["birds"].dependencies = [[[[this.populations["worms"],1]],1]];

        //this function is no longer called, the  "setup" function in this class is currently what is run...
        //and sets up the populations based on user input
    }

    run(){

        var iteration = 0;

        run:

        while(true){

            var New = this.populations;
            // ^ creating new copy of population values to store new values...
            // isolated from old ones that the simulation is running on

            var extinct = [];

            for (const population in New) {

                New[population].increment();

                console.log(`${population}: ${New[population].population_curve.num}`);
                
                if (New[population].population_curve.num <= 0){
                    console.log(population, "went extinct at iteration", iteration + 1);
                    extinct.push(population);
                }
            }

            for (const extinct_index in extinct){
                var ex = extinct[extinct_index];
                delete New[ex];
                break run;
            }
            this.populations = New;

            iteration++;
            
        }
    }
}


