# comp3008
Folder hierarchy:

## /db --> stores JSON data used for password analysis
## /lib --> stores file for generating password schemes
## /public --> stores static files to be served to the client 
## /routes --> stores files to handle route requests 
## /views --> stores pug files to be rendered into view for client 
## /www --> helper file to startup server 

# Starting and running app:
    cd to root folder
    npm install //install dependencies 
    npm install -g typescript //install typescript compiler 
    tsc * //compile all typescript files 
    node ./www/bin.js //startup server 
    Navigate to localhost:3000 to use application 
