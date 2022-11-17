class populations {
    initial : number;
    population : any;
    dependencies : any;
    predaDeck : number;

    populations(initial_pop : number, mean : number, stddev : number){
        this.initial = initial_pop;
        this.population = NCurve(initial_pop, mean, stddev);
        this.dependencies = [];
        this.predaDeck = 0;
    }


    dependencies_calc(){
        var final = 0; //value to be returned
        // returns how well a certain population has done based
        // on the success of it's dependencies

        var dp_type_score = [];
        var importance = [];

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
        }
    }

}