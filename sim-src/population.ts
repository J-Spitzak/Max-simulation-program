

class populations {
    initial : number;
    population : any;
    dependencies : any;
    predaDeck : number;

    populations(initial_pop : number, mean : number, stddev : number){
        this.initial = initial_pop;
        this.population = new NCurve(initial_pop, mean, stddev);
        this.dependencies = [];
        this.predaDeck = 0;
    }


    dependencies_calc(){
        var final = 0; //value to be returned
        // returns how well a certain population has done based
        // on the success of it's dependencies

        var dp_type_score : any = [];
        var importance : any = [];

        for (var dependencyType = 0; dependencyType < this.dependencies.length; dependencyType++){
            var score = 0;

            for (var dependency = 0; dependency < dependencyType[0].length; dependency++){
                // the first item is a list of each...
                // dependency that supplies for that type, the second is the importance

                // how well each dependency source supplies that dependency
                score += dependency[0].population.Zscore() * dependency[1];
                // how well a population is doing ^ * it's importance ^
                

                dependency[0].predaDeck += this.population.Zscore() * dependency[1] * this.population.stddev;
                // adds the success of this population to the predaDeck of the dependency source...
                // since the source should do badly if it's predators are doing well

                //print(dependency[0].population.Zscore() , dependency[1])
            }

            importance.push(dependencyType[1]);

            dp_type_score.push(score);
        }

        for (var i = 0; i < dp_type_score.length;i++){
            final += dp_type_score[i] * importance[i];
        }

        return final;
    }

    increment(){
        //this function is the heart of the simulation, it is called on every population in every run instance
        // it is called in the run method of environment

        var pop = this.population.num;
        //^ variable is created to store the previose population number
        // so that it can be used by the rest of the simulation

        this.population.num += Math.floor((this.dependencies_calc() / 150) * this.population.stddev * mapped_number());
        // ^ adding the success of dependencies to the population

        this.population.num -= Math.floor((this.predaDeck / 20) * mapped_number());
        // ^ reducing population by the success of predators

        this.predaDeck = 0;
        // ^ resseting the score for success of the predators

        // returning previose population number to stay consistent 

        return pop;
    }

    print(name = null){
        if (name != null){
            console.log(name, ":");
        }
        console.log("dependencies: ", this.dependencies);
        console.log("mean ", this.population.mean, "number: ", this.population.num, "standard dev: ", this.population.stddev);
    }

};

