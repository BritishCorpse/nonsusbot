# Dashboard API

This script must be run separately from the bot. The bot will talk to this process.

Python 3 is required to run this script.

## Setup

Make sure you are in the same directory as this README, and run this:

### On Linux or Mac

```py
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### On Windows

```py
python3 -m venv venv
venv/bin/activate.bat
pip install -r requirements.txt
```

## Run

To run the script, run this (making sure the virtual environment is activated):

```py
cd src
python3 main.py
```

## Unsetup

To deactivate the virtual environment, run this:

```py
deactivate
```

To delete the virtual environment, run this:

```py
rm -rf venv
```
