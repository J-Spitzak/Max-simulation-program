

function mapped_number() {
    // creates a random number beetween 0 and 1
    var num = Math.random();

    //makes the range of the number beetween .5 and 1.5
    num += .5;

    // the return value is multiplied by a number to create random variation
    return num;
}


class NCurve {

    num;

    mean;

    stddev;

    zScore;

    constructor(num = null, 
        mean = null, 
        stddev = null, 
        zScore = null) {

            this.num = num;
            this.mean = mean;
            this.stddev = stddev;
            if (zScore != null){
                this.zScore = zScore;
            }
            else {
                this.zScore = this.Zscore;
            }

        }

    get Zscore() {
        return (this.num - this.mean) / this.stddev;
    }

    get StdDev() {
        return (this.num - this.mean) / this.zScore;
    }

    get num() {
        return this.num;
    }

    get mean() {
        return this.mean;
    }
  }
  


// delete everything above









// (population.js)

class population {


    initial; // initial value of the population

    population_curve; // stores the normalized curve instance that hholds the data for the population

    dependencies; // a list of other populations it depends on

    predatory_decrement; // how impacted the population is by it's predators 

    populations(initial_pop, mean, stddev){

        this.initial = initial_pop;

        this.population_curve = new NCurve(initial_pop, mean, stddev);

        this.dependencies = [];

        this.predatory_decrement = 0;

        console.log(this.population_curve.num);

    }


    dependencies_calc(){


        var final = 0; //value to be returned
        // returns how well a certain population has done based
        // on the success of it's dependencies

        var dp_type_score = []; // the values stored from each type of dependency

        var importance = [];

        for (var dependencyType = 0; dependencyType < this.dependencies.length; dependencyType++){

            var score = 0;

            for (var dependency = 0; dependency < dependencyType[0].length; dependency++){
                // the first item is a list of each...
                // dependency that supplies for that type, the second is the importance

                // how well each dependency source supplies that dependency
                score += dependency[0].population_curve.Zscore * dependency[1];
                // how well a population is doing ^ * it's importance ^
                

                dependency[0].predatory_decrement += this.population_curve.Zscore * dependency[1] * this.population.stddev;
                // adds the success of this population to the predatory_decrement of the dependency source...
                // since the source should do badly if it's predators are doing well

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

        var pop = this.population_curve.num;
        //^ variable is created to store the previose population number
        // so that it can be used by the rest of the simulation

        this.population_curve.num += Math.floor((this.dependencies_calc() / 150) * this.population.stddev * mapped_number());
        // ^ adding the success of dependencies to the population

        this.population_curve.num -= Math.floor((this.predatory_decrement / 20) * mapped_number());
        // ^ reducing population by the success of predators

        this.predatory_decrement = 0;
        // ^ resseting the score for success of the predators

        // returning previose population number to stay consistent 

        return pop;
    }

    print(name = null){
        if (name != null){
            console.log(name, ":");
        }
        console.log("dependencies: ", this.dependencies);
        console.log(this.population);
        console.log("mean ", this.population_curve.mean, "number: ", this.population_curve.num, "standard dev: ", this.population_curve.stddev);
    }

};

var birds = new population(600, 500, 100);

var worms = new population(900, 1000, 150);

birds.dependencies = [[5,[5,worms]]];

birds.increment()