#!/usr/bin/python
from max31855 import MAX31855, MAX31855Error
import time
import sqlite3

conn = sqlite3.connect('/var/www/heat-of-my-meat/temperatures.db')
#stmt = 'create table if not exists temps (temp text)'
c = conn.cursor()
#c.execute(stmt)
#conn.commit()

cs_pin = 10
clock_pin = 7
data_pin = 8
units = "f"
thermocouple = MAX31855(cs_pin, clock_pin, data_pin, units)
while(True):
  try:
    temp = thermocouple.get()
    str_temp = str(temp)
    c.execute('INSERT INTO temps VALUES (?)', [str_temp])
    conn.commit()
    print(temp)
    time.sleep(3)
  except KeyboardInterrupt:
    thermocouple.cleanup()
    print("\nstopping")
    conn.commit()
    conn.close()
