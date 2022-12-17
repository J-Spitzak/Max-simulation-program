// (helper functions.js)

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
            console.log("a normalized curve for a population was initialized");

        }

    Zscore() {
        return (this.num - this.mean) / this.stddev;
    }

    StdDev() {
        return (this.num - this.mean) / this.zScore;
    }
};


/* 
myCurve = new NCurve(600,500,100);
console.log("mean = ", myCurve.jwtgvjwv);
console.log("z score = ", myCurve.Zscore()); */

/* let Curve = class {
    mean;
    Curve(mean){
        this.mean = mean;
    }
}


let curved = new Curve(10);
console.log(curved.mean); */

class NCurve {
    constructor(height, width) {
      this.height = height;
      this.width = width;
    }
    // Getter
    get area() {
      return this.calcArea();
    }
    // Method
    calcArea() {
      return this.height * this.width;
    }
  }
  
  const square = new NCurve(10, 10);
  
  console.log(square.area); // 100
  
