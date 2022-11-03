# Max-simulation-program
A capstone project by Max to simulate bird populations in Rock Creek Parkway

The simulation framework is written in python
The end product is a web application written with either django or flask (not yet determined)

this specific brnach is to test basic attributes of the program with jdh, while sheel works on the
flask branch I am writing pure javascript to get a basic program running with jdh, here's how it works:

- jdh is a javascript library that uses no css and as little html as possible, it is not open source because it sucks
- how it works is the main.html file gives total control of the sceen to js/main.js
- this however is not where you write your code, you write it in main.js (I take responsibility for the bad naming)
- to run it run "sh buildit" then run "open main.html"
- buildit takes areas in main.js where you wrote "//BSInclude blah" and pastes everything in blah and your file into js/main.js
