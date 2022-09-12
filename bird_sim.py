import time
import math
import random
import sys

def mapped_number(accuracy = 100):

    number = random.randint(0, accuracy) / accuracy
    number += .5
    return number

class NCurve():

    def __init__(self, number = None, mean = None, standard_deviation = None, zScore = None):
        self.num = number
        self.zScore = zScore
        self.mean = mean
        self.stddev = standard_deviation

    def Zscore(self):
        return (self.num - self.mean) / self.stddev 

class population():

    def __init__(self, initial_pop, mean, stddev):
        self.initial = initial_pop
        self.population = NCurve(initial_pop, mean, stddev)
        self.dependencies = []
        self.predaDeck = 0
        #predaDeck is predatory decrement and is calculated based on the zscore of it's predators


    def dependencies_calc(self):
        #print(self.dependencies)
        final = 0
        dp_type_score = []
        importance = []
        for dependencyType in self.dependencies:
            score = 0
            for dependency in dependencyType[0]:
                score += dependency[0].population.Zscore() * dependency[1]
                dependency[0].predaDeck += self.population.Zscore() * dependency[1] * self.population.stddev
                #print(dependency[0].population.Zscore() , dependency[1])
            importance.append(dependencyType[1])
            #print(score, dependencyType[1])
            dp_type_score.append(score)
        for i in range(len(dp_type_score)):
            final += dp_type_score[i] * importance[i]
        #print(dp_type_score)
        #print(importance)
        return final

    def increment(self):
        # this function is the heart of the simulation, it is called on every population in every run instance
        # it is called in the run method of environment

        pop = self.population.num
        #^ variable is created to store the previose population number
        # so that it can be used by the rest of the simulation

        self.population.num += math.floor((self.dependencies_calc() / 150) * self.population.stddev * mapped_number())
        # ^ adding the success of dependencies to the population
        self.population.num -= math.floor((self.predaDeck / 20) * mapped_number())
        # ^ reducing population by the success of predators
        self.predaDeck = 0
        # ^ resseting the score for success of the predators

        # returning previose population number to stay consistent 
        return pop

    def print(self, name = None):
        if name != None:
            print(name, ":")
        print("dependecies:", self.dependencies)
        print("mean:", self.population.mean, "number:", self.population.num,"standard dev:", self.population.stddev)

class environment():

    def __init__(self):
        self.populations = {}
    
    def printPop(self):
        print(self.populations)
        for i in self.populations.keys():
            print(i, "=", self.populations[i].print( ))  


    def setup(self):

        print("population number: ")

        populationsNum = int(input())
        for _ in range(populationsNum):
            print(_, "nth population: name, number, mean, standard deviation")
            nm = str(input())
            #name ^
            self.populations[nm] = population(int(input()),int(input()),int(input()))
            print(nm, "-- number:", self.populations[nm].population.num, "mean:", self.populations[nm].population.mean, "standard dev:", self.populations[nm].population.stddev)
        
        print("dependencies: ")

        key_list = list(self.populations.keys())
        val_list = list(self.populations.values())

        for i in key_list:
            pop = self.populations[i]
            print("number of elements for:", i)
            elementNum = int(input())
            listing = []
            for element in range(elementNum):
                print("element importance: ")
                imp = int(input())
                newListing = [[],imp]
                print("number of suppliers:")
                supplierNum = int(input())
                for supplier in range(supplierNum):
                    print("supplier importance, name:")
                    supplierImp = int(input())
                    supplierName = str(input())
                    newListing[0].append([self.populations[supplierName], supplierImp])
                listing.append(newListing)
                pop.dependencies = listing

        
        print("setup done!")
        self.printPop()
        def timedown(n):
            print("running in", n)
            time.sleep(1)
        timedown(3)
        timedown(2)
        timedown(1)
        print("starting")



    def pop_setup(self):
        self.populations["birds"] = population(500, 450, 100)
        self.populations["worms"] = population(2500, 3000, 400)
        self.populations["birds"].dependencies = [[[[self.populations["worms"],5]],5]]
        self.printPop()
        #this function is no longer called, the  "setup" function in this class is currently what is run...
        #and sets up the populations based on user input
    
    def run(self):
        while True:

            new = self.populations
            # ^ creating new copy of population values to store new values...
            # isolated from old ones that the simulation is running on

            extinct = [] # list for extinct species

            for population in new:
                new[population].increment()
                print(population,  ": " , new[population].population.num)
                if new[population].population.num <= 0:
                    print(population, "went extinct")
                    extinct.append(population)

            for ex in extinct:
                new.pop(ex)

            self.populations = new
            time.sleep(1)
                

            


"""
test for dependencies calc method
birds = population(500, 400, 50)
birds.dependencies = [[[[population(10,20,2), 5], [population(120,100,30),2]],5],[[[population(15,20,5),2], [population(500,300,150),3]],5]]
#            specific population ^ importance ^        importance of resource ^   all populations that contribute to resource end here ^
print(birds.dependencies_calc())
"""

env = environment()
'''env.pop_setup() # the pre-setup one
env.setup() #the one where you set it up'''





arguments = sys.argv

if ':p' in arguments or ':c' in arguments:
    if ':p' in arguments:
        env.pop_setup()
    if ':c' in arguments:
        env.setup()
else:
    try:
        print(arguments[1], "is not a valid argument")
    except:
        print("an argument must be provided")

    print("possible arguments are: \n :p -> stands for 'pre' uses pre-made test setup \n :c -> stands for 'custom' uses command line utility to create a custom environment")
    input()
    quit()


env.run()