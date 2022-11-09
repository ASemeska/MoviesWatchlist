import os
from flask import Flask, render_template
from flask_login import LoginManager,UserMixin,login_user
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from wtforms import StringField,PasswordField,SubmitField,IntegerField, FloatField
from wtforms.validators import DataRequired, ValidationError, EqualTo


app = Flask(__name__)

#++++++++++++++++CLASES++++++++++++++++#

#++++++++++++++++FORMS+++++++++++++++++#

#++++++++++++++++ROUTES++++++++++++++++#
@app.route("/")
def home():
    return f'Hello'





if __name__ == "__main__":
    app.run(debug=True)
