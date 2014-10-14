/*
    Written by:    Patrick Pawlowski, Ticomix, Inc.
    Created On:	2014.04.18
	Modified:		
	
	Description:	This is quite simply to convert a JSON object, namely one
                        that has come from a PHP web service, to an HTML table. 

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
                        table.onclickFunction = function(e){lead.selectNewOwner(e)}; 
                        table.onclickColumn = 'ID'; // Access via e.target.parentNode.onclickvalue
                        table.columnsToSkip = [1]; // Array of numeric index of columns to not display starts with 1
                        var dataTable = table.createTable();
                        
                        // to suppress the headings:
                        dataTable.getElementsByTagName("thead")[0].style.display = "none";

*/

var json2table = function json2table(){};
json2table.prototype.json = {};
json2table.prototype.tableClass = '';
json2table.prototype.tableID = '';
json2table.prototype.tableCaption = '';
json2table.prototype.trClass = '';
json2table.prototype.tdClass = '';
json2table.prototype.theadClass = '';
json2table.prototype.thClass = '';
json2table.prototype.columnsToSkip = [];
json2table.prototype.dateColumns = [];
json2table.prototype.datetimeColumns = [];
json2table.prototype.nowrapColumns = [];
//json2table.prototype.onclickFunction = '';
json2table.prototype.onclickFunction = function(){};
json2table.prototype.onclickColumn = '';
json2table.prototype.createTable = function createTable(){
    if (this.json[0] === undefined)
    {
        return('No Data');
    }else{
        var Table = document.createElement('table');//.className = this.tableClass;
        Table.className = this.tableClass;
        Table.id = this.tableID; 
        var TableHeader = document.createElement('thead');//.className = this.theadClass;
        var TableBody = document.createElement('tbody');
        for (row in this.json)
        {
            if (! TableHeaderRow)
            {
                var TableHeaderRow = document.createElement('tr');
                TableHeaderRow.className = this.trClass;
                var irow = 1;
                for (column in this.json[row])
                {
                    if (this.columnsToSkip.indexOf(irow))
                    {
                        var TableHeaderCell = document.createElement('th');
                        TableHeaderCell.className = this.thClass;
                        TableHeaderCell.appendChild(document.createTextNode(column + '\xA0\xA0'));
                        TableHeaderRow.appendChild(TableHeaderCell);
                        TableHeader.appendChild(TableHeaderRow);
                    }
                    irow++;
                }
            }
            var TableRow = document.createElement('tr');
            TableRow.className = this.trClass;
            if (this.onclickColumn !== '' && this.onclickFunction !== '')
            {
                TableRow.onclickvalue = this.json[row][this.onclickColumn];
                TableRow.onclickfunction = this.onclickFunction;
                //TableRow.onclick = function(){window[this.onclickfunction](this.onclickvalue)}; 
                TableRow.addEventListener('click', this.onclickFunction);
            }
            var irow = 1;
            for (column in this.json[row])
            {
                if (this.columnsToSkip.indexOf(irow) === -1)
                {
                    var TableCell = document.createElement('td');
                    TableCell.className = this.tdClass;
                    if (this.nowrapColumns.indexOf(irow) >= 0)
                    {
                        TableCell.setAttribute('nowrap','nowrap');
                    }
                    if (Object.prototype.toString.call(this.json[row][column]) === '[object Object]') // Convert dates to strings
                    {
                        var DateTimeText = this.json[row][column]['date'];
                        if (this.datetimeColumns.indexOf(irow) >= 0)
                            DateTimeText = this.json[row][column]['date'].slice(0,16);
                        if (this.dateColumns.indexOf(irow) >= 0)
                            DateTimeText = this.json[row][column]['date'].slice(0,11);
                        TableCell.appendChild(document.createTextNode(DateTimeText));
                    }else{
                        TableCell.appendChild(document.createTextNode(this.json[row][column]));
                    }
                    TableRow.appendChild(TableCell);
                }
                irow++;
            }
                //alert(JSON.stringify(TableHeaderRow));
                TableBody.appendChild(TableRow);
        }
        var TableCaption = document.createElement('caption');
        TableCaption.appendChild(document.createTextNode(this.tableCaption));
        Table.appendChild(TableCaption);
        Table.appendChild(TableHeader);
        Table.appendChild(TableBody);
    }
    return(Table);
};
