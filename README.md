### CLI Commands for Scraper Service

```Bash

# starting vite server for VUE development 
npm run frontend:dev
# starting express server
npm run dev
# build frontend command
npm run build 

#help commands 
npm start -- --version # displays version of program
npm start -- --help # see main help menu

# help menu for cpu command
npm start -- cpu help
npm start -- server help 

# cpu scraper commands 
npm start -- cpu cninjas # scrapes cloud ninjas cpu collection 
npm start -- cpu xbyte # scrapes xByte's cpu collection
npm start -- cpu smonkey # scrapes Server Monkey's cpu collection 
npm start -- cpu all # scrapes all websites and their cpu collections 

# server scraper commands 
npm start -- server cnServerCollection_data # Scrapes Cloud Ninjas Server collection pages
npm start -- server smServerCollection_data # Scrapes Server Monkey Server collection pages  
npm start -- server xbyteServerCollection_data # Scrapes xByte Server collection pages  

```