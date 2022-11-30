


function mapped_number() {
    var num = Math.random();

    num += .5;

    return num;
}

class NCurve {

    num;
    zScore ;
    stddev;
    mean;


    constructer(num = null, 
        mean = null, 
        stddev = null, 
        zScore = null)
        {

            this.num = num;
            this.mean = mean;
            this.stddev = stddev;
            if (zScore != null){
                this.zScore = zScore;
            }
            else {
                this.zScore = this.Zscore();
            }

        }

    Zscore() {
        return (this.num - this.mean) / this.stddev;
    }

    StdDev() {
        return (this.num - this.mean) / this.zScore;
    }
};





class populations {
    initial;
    population;
    dependencies;
    predaDeck;

    populations(initial_pop, mean, stddev){
        this.initial = initial_pop;
        this.population = new NCurve(initial_pop, mean, stddev);
        this.dependencies = [];
        this.predaDeck = 0;
    }


    dependencies_calc(){
        var final = 0; //value to be returned

        var dp_type_score = [];
        var importance = [];

        for (var dependencyType = 0; dependencyType < this.dependencies.length; dependencyType++){
            var score = 0;

            for (var dependency = 0; dependency < dependencyType[0].length; dependency++){

                score += dependency[0].population.Zscore() * dependency[1];
                

                dependency[0].predaDeck += this.population.Zscore() * dependency[1] * this.population.stddev;

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

        var pop = this.population.num;

        this.population.num += Math.floor((this.dependencies_calc() / 150) * this.population.stddev * mapped_number());

        this.population.num -= Math.floor((this.predaDeck / 20) * mapped_number());

        this.predaDeck = 0;


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





class environment {

    populations = {};

    printPop(){
        console.log(this.populations);
        for (let i = 0; i < Object.keys(this.populations).length; i++){
            console.log(Object.keys(this.populations)[i], " = ", this.populations[this.populations[i]].print());
        }
    }

    pop_setup(){
        this.populations["birds"] = populations(500, 450, 100);
        this.populations["worms"] = populations(2500, 3000, 400);
        this.populations["birds"].dependencies = [[[[self.populations["worms"],5]],5]];
        this.printPop();
    }

    run(){
        while(true){
            var New = this.populations;

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







testDrawing = new JDHDrawing( "testDraw" );
bg = new Frame( 0, 0, 1, 1 );
bg.setCombinedPaint( rgb( 150, 150, 150 ) );
testDrawing.add( bg );
text1 = new Text( 100, 95, "TextInput:" );
testDrawing.add( text1 );
input1 = new TextInput( 100, 100, 200, 30 );
text2 = new Text( 400, 95, "TextOutput:" );
testDrawing.add( text2 );
output1 = new TextOutput( 400, 100, 200, 30 );
output1.setText( "" );
testDrawing.add( output1 );
function input1CB() {
    output1.setText( input1.getText() );
}
input1.setCallback( input1CB );
testDrawing.add( input1 );
text3 = new Text( 100, 245, "ValueInput:" );
testDrawing.add( text3 );
input2 = new ValueInput( 100, 250, 200, 30 );
testDrawing.add( input2 );

resize();