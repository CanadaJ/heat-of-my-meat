heat-of-my-meat
===============

Web interface for (bbq and more!) temperature logging on your Raspberry Pi using the MAX31855 breakout board!

## Requires
* Raspberry Pi
* Apache2
* Sqlite3
* [MAX31855 Thermocouple Amplifier](http://www.adafruit.com/products/269?gclid=CLrRmtyx-boCFaSDQgodXE8ANw)
* [Tuckie's MAX31855 Python Driver](https://github.com/Tuckie/max31855) (included)

## Usage
***

Place the contents of the heat-of-my-meat folder into either /var/www or wherever Apache can get to it.
Run the following bash command:

	you@pi: ~$ sudo python3 get_temps.py <location of database>.db
	
This will cause the Pi to begin reading the temperatures from the thermocouple, and add them to the database.
You can then navigate to the included index page on your pi from anywhere on your network, and check up on the heat of your meat!
