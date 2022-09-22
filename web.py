from flask import Flask, redirect, url_for, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return "<h1>This is the home page</h1>"

@app.route("/<name>")
def name(name):
    return render_template("index.html", content=name)


if __name__ == '__main__':
    app.run(port=4096)