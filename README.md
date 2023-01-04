# Max-simulation-program
A project by Max and Jason to simulate bird populations in Rock Creek Park


We (Max and Jason) are students of Arlington Tech High School, part of the Arlington Career Center (ACC). This project origionally started as Max's senior capstone project but is now a seperate project

The simulation framework was origionally written in python and was going to use flask but is now written in javascript with the intent to use JDH. JDH is a html-less library that uses only javascript. This may not be a permanent solution because jdh is not a proven framework for I-Pads which is what is given to elementary and middle school students in APS.



### jenky summary of legal stuff:
The project is under a MIT license, feel free to do whatever you want with it. Fork it as you wish but (and I don't know if the MIT license requires this) we would like some credit for your project. If it is not required under the MIT License then we only request that you give credit and that request is in no way legally required.



## a quick overview of the project files and directories: 

- sim-src stand for simulation source and stores all of the simulation files
  - most of the javascript files have corresponding python files left over from the origional project, I will be going over the javascript files as the python files are no longer maintained
  - helper_functions.js has a function for generatin a random number and a "normalized curve" class which is used by population.js to encapsulate the state of a population
  - population.js contains a population class. A population is just as it sound, it has dependencies that are other populations and my be a dependency itself. It is used in environment.js
  - environment.js contains a class that defines the environment. in addition to the run function which calls the population increment function and manages things like extinction and printing the status it also contains functions like pop_setup for creating a simple set of populations and the origional python version even had the setup function which was a command line utility for generating sets of populations
  - main.js contains the main source code for the website and includes both jdh and the simulation files
  - simulation.js just includes the simulation files, I don't use it anymore but I think I used it with node for debugging
- the js directory contains the combined javascript files, this is how jdh works, it also contains a filler document so that git doesn't ignore the directory
- README.md is the README, LICENSE is the license and index.html is the html file, I think those are self explanatory
- MAKE combines the javascript files into a single file in the js directory in a 2 step process
- CLEAN removes those files
- buildit removes the files, builds them again and runs index.html for convinience
- NODE-BUILD is unused, it was made to do something similar to buildit but for node.js for easier debugging.
