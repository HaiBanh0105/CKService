@echo off
echo === STARTING SERVICES ===

start "users" php -S localhost:8001 -t service/users
start "computers" php -S localhost:8002 -t service/computer_station
start "session" php -S localhost:8003 -t service/session
start "booking" php -S localhost:8004 -t service/booking
start "email" php -S localhost:8005 -t service/email
start "payment" php -S localhost:8006 -t service/payment

echo === ALL SERVICES STARTED ===
pause
