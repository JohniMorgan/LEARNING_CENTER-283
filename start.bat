@echo off
cd .\backend\news_portal-main\
start /B /WAIT docker compose up -d
cd ..\..\
start /B /WAIT npx vue-cli-service serve --open --host=localhost
exit

