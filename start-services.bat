@echo off
echo === STARTING SERVICES ===

start "users" php -S localhost:8001 -t service/users
start "computers" php -S localhost:8002 -t service/computer_station
start "session" php -S localhost:8003 -t service/session
start "booking" php -S localhost:8004 -t service/booking

echo === ALL SERVICES STARTED ===
pause
