# LERANING_CENTER-283
## Прототип новостной интернет-газеты (frontend)
### Инициализация проекта
```
npm install
```
### Для полноценной работы
Так же необходимо в папке с проектом создать папку **"backend"**
и:
1. выгрузить туда репозиторий, доступный по следующей [ссылке](https://github.com/JohniMorgan/news_portal-main)
2. перейти в папку news_portal-main и выполнить команду
```
docker compose build
```
### Быстрый запуск
Необходимо запустить файл **start.bat**, после чего сайт автоматически откроет
в окне браузера
### Поэтапный запуск
1. Перейти в папку /backend/news_portal-main и выполнить команду
```
docker compose up
```
2. Вернуться в корневую папку проекта и выполнить команду
```
npm run serve
```
3. Получить в консоли ссылку на дев-сервер
### Окончание тестирования
1. Прервать выполнение пакета npm в консоли
(В случае запуска в cmd Windows достаточно закрыть консоль)
2. Перейти в папку /backend/news_portal-main и выполнить команду
```
docker compose stop
```
### Компиляция и подготовка к выпуску в продакшн
```
npm run build
```
В результате в папке dist будет сформированы файлы, которые позже
необходимо поместить в домашнюю папку веб-сервера.

