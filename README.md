json2table
==========

JavaScript prototype which accepts a JSON array of objects and returns an HTML table

    Written by:    Pat Pawlowski
    Created On:	2014.04.18
	Modified:		
	
	Description:	This is quite simply to convert a JSON object, namely one
                        that has come from a PHP web service, to an HTML table.
                        
                        I created this to server my own puposes and add functionality
                        to it as needed. 

	Issues:
	
	Execution:
                        The only requirement is the JSON data however you most likely 
                        would like to specify the classes to make the table look 
                        unless you have some other functionality to dress it up.

                        Currently the most basic usage is the following 3 lines
                        where data is the JSON data you want to convert into a 
                        table and dataTable is the finished table waiting to be 
                        placed in a div somewhere. 
                        
                        var table = new json2table();
                        table.json = data;
                        var dataTable = table.createTable();

                        NOTE: The header row is constructed from the first element
                        in data. To customize this you can either 1) modify your
                        SQL, assuming that's the source, by aliasing your column
                        names with friendlier headers. or 2) simply modify the 
                        index of the JSON to set the headers. 
                        i.e. data[0][0] = "Some Friendly Column Header';
                        IMPORTANT: If you modify the onclickColumn's header you 
                        will need to modify all of them. The first one specifies 
                        the text for the header row of the table but the rest of
                        them will need to be changed for the onclick functionality 
                        to find the propre value to pass to the onclickFunction.

                        Regarding the onclickFunction and onclickColumn, they 
                        allow you to attach an onclick function to each row and 
                        feed into it the value from one of the columns. I'll probably 
                        need to add the functionality to hide the column in question
                        at some point but have not done so yet. The are both text
                        fields so you just enter the column name as it appears in 
                        the data and onclickFunction should just be the function 
                        name without the trailing parens. i.e. 'alert' not 'alert()'.
                        
                        IMPORTANT: The onclickFunction has to be in the global 
                        namespace where window['myFunction']() will work. If you
                        need to call a function that is part of a larger object 
                        such as myObject.Myfunction() then you will have to create
                        a global function to call it like:
                        function myGlobalFunction(data){
                            myObject.Myfunction(data);
                        }
                        
                        That's all and hopefully someone finds some use for this 
                        besides me. 

                        -pat
                        
                        var data = [
                            {
                                'Name': 'John',
                                'Sex': 'male',
                                'Age': '48'
                            },
                            {
                                'Name': 'Jane',
                                'Sex': 'female',
                                'Age': '36'
                            },
                            {
                                'Name': 'Joe',
                                'Sex': 'male',
                                'Age': '10'
                            },
                            {
                                'Name': 'Jack',
                                'Sex': 'male',
                                'Age': '10'
                            }
                        ];
                        var table = new json2table();
                        table.json = data;
                        table.tableClass = 'mainTable';
                        table.thClass= 'tableHeader';
                        table.trClass = 'clickable';
                        table.tdClass = 'cellLeft';
                        table.datetimeColumns = []; // Display these as datet and time yyyy-mm-dd hh-mm-ss so it will sort
                        table.dateColumns = [8]; // Display these as just dates yyyy-mm-dd so it will sort
                        table.onclickFunction = function(e){lead.selectNewOwner(e)}; // Function to call when a row is clicked
                        table.onclickColumn = 'Name'; // Value availalbe to the calling function as e.target.parentNode.onclickvalue
                        table.columnsToSkip = [1]; // Array of numeric index of columns to not display starts with 1
                        var dataTable = table.createTable();
                        
                        // to suppress the headings:
                        dataTable.getElementsByTagName("thead")[0].style.display = "none";

