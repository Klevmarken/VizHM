/**
 *  Use this to create a HeatMap plotting columns containing clusters of values.
 *
 *  NOTE: The cluster data must be a key/data pair, where the key is an unique identifier
 *        of the data row(column), and the data is an array of key/value paired clusters.
 *
 *        Example of clusterColumns:
 *        var clusterColumns = [{key: "uniqueKey", data: [clusterData]}, {key: "uniqueKey2", data: [clusterData2]}];
 *        
 *        Example of clusterData array: 
 *        var clusterData = [{key: "0-10", value:50}, {key: "11-20", value: 20}]
 *  
 *
 *  Requires: jQuery version x.x
 *  
 *
 *  @Version: -0.1
 *  @Author: Matteus Klich 
 *
 * */

var HeatMapPlot = {} || 0;
var HeatMapPlot =  {
    
    init: function(plotObject) { 
        this.plotObject = plotObject;
        this.currentIntervalSpeed = this.defaultSpeed; 
    },
    
    
    // This property is the container and cache of all data plotted.
    clusterColumns: [],

    // Global default settings
    plotColumnWidth: 25,
    plotWidth: 600,
    getClusters: function() {
        return this.clusterColumns != null && this.clusterColumns.length > 0 ? this.clusterColumns[this.currentColumnIndex]["data"].length : 50;
    },
    
    defaultSpeed: 400,
    cacheLimit: 100,

    // Global variables init
    plotPaused: 0,
    plotTickerID: 0,
    currentIntervalSpeed: 0,
    currentColumnIndex: 0,

    // The default for requesting data is a batch of randomized latency data
    // this should be overridden in the application.
    retrieveData: function() {return RandomLatencyDataGenerator(100,this.getClusters());},
    
    startPlot: function() {
        this.startPlotTicker();
    },

    startPlotTicker: function () {
        // reset just in case the interval has not been reset
        this.resetPlotTicker();

        var self = this;
        this.plotTickerID = window.setInterval(function() { self.drawPlot(); }, this.currentIntervalSpeed); 
    },

    resetPlotTicker: function () {

       window.clearInterval(this.plotTickerID);
    },

    pause: function() {
        this.plotPaused = 1;
        this.resetPlotTicker();
    },
    
    play: function() {
        this.plotPaused = 0;
        this.startPlotTicker();
    },

    isPaused: function() {
        return this.plotPaused;
    },

    updatePlotTickerInterval: function () {

        //resetPlotTicker();

        this.startPlotTicker();
    },

    changePlotTickerTime: function (timeChange) {
        
        if(this.currentIntervalSpeed-timeChange < 0)
            this.currentIntervalSpeed = 0;
        else
            this.currentIntervalSpeed -= timeChange;
        this.updatePlotTickerInterval();    
    },

    drawPlot: function() {
        if(this.plotPaused)
            return;

        if(!this.unplottedDataExists())
            this.getClusterData();

        this.stepOneColumnRight();

        if(this.clusterColumns.length > this.cacheLimit)
            this.reduceClusterCache();

    },

    createColumnID: function() {

        var randomID = Math.floor((Math.random()*4711)+1);

        var columnID = "column-"+randomID;
        
        return columnID;
    },

    createColumnDiv: function(columnID) {

        var columnHTML = "<div id=\""+columnID+"\" class=\"clusterColumn\"></div>";

        return columnHTML;
    },

    getOldColumn: function() {
        if (this.currentColumnIndex > this.getMaxColumns()) {
            var idx = this.currentColumnIndex - this.getMaxColumns()-1;

            return this.clusterColumns[idx];
        }
        return null;
    },

    stepOneColumnLeft: function() {
        var columnID = this.createColumnID();
        var findOldColumn = this.getOldColumn();
        
        if (findOldColumn == null) {
            return; // Throw an exception or do something more informative to the user here..
        }

        var columnToAppend = this.createColumnDiv(columnID);

        this.addColumnToPlot(columnToAppend,true);
        this.addClustersToColumn(this.plotObject.children().last(),findOldColumn);
        this.currentColumnIndex -= 1;

        this.removeFirstColumnFromPlot();
    },

    stepOneColumnRight: function() {

        if(!this.unplottedDataExists())
            return;

        var columnID = this.createColumnID();
        var columnToPrepend = this.createColumnDiv(columnID);

        this.addColumnToPlot(columnToPrepend,false);
        this.addClustersToColumn(this.plotObject.children().first(),this.clusterColumns[this.currentColumnIndex]);
        this.currentColumnIndex += 1; 

        if(this.plotObject.children().length > this.getMaxColumns())
            this.removeLastColumnFromPlot();

        
    },

    addColumnToPlot: function(columnHTML, append) {
        if(append)
            $(this.plotObject).append(columnHTML);
        else
            $(this.plotObject).prepend(columnHTML);
    },

    removeLastColumnFromPlot: function() {
        this.plotObject.children().last().remove();
    },

    removeFirstColumnFromPlot: function() {
        this.plotObject.children().first().remove();
    },

    reduceClusterCache: function() {
        var nrIndexesToRemove = Math.floor(this.clusterColumns.length*0.1);

        // only remove already plotted columns!
        var allowedToRemove = this.currentColumnIndex - 1;

        if(allowedToRemove-nrIndexesToRemove > this.getMaxColumns()) {
            this.currentColumnIndex -= nrIndexesToRemove;
            this.clusterColumns.splice(0,nrIndexesToRemove);
        }
        
    },

    addClustersToColumn: function(column,columnData) {

        var clusters = columnData["data"].length;
        var boxHeight = Math.floor(column.height()/clusters);
        
        var clusterData = columnData['data'];
        var maxClusterValue = this.getMaxValue(clusterData);


        for(var key in clusterData) {
            var color = this.getColorFromValue(clusterData[key]['value'], maxClusterValue);

            // we need a unique id so that the box easily can become clickable
            var clusterBoxID = column.attr('id')+clusterData[key]["key"];

            column.append("<p class=\"clusterBox\" id=\""+clusterBoxID+"\" style=\"height:"+boxHeight+"px; background-color: "+color+"; color: "+color+"\">"+clusterData[key]['value']+"</p>");

            // This might not work..? Not sure what 'this' is in the below anonymous function
            var self = this;
            column.children().last().click(function() { self.clusterBoxClicked(this)});
        }
    },


    unplottedDataExists: function() {
        return (this.clusterColumns.length) > this.currentColumnIndex;
    },

    /* *
     *
     * Getters
     *
     * */

    getClusterData: function() {
        if(!this.clusterColumns || this.clusterColumns.length == 0 || !this.unplottedDataExists()) {
            if(!this.requestData(10,200))

                throw {
                    name: "DataNotRetrievedException",

                    message: "The requested data was not received"
                };
        }
//var testData = [{"key": "1", "value": "17"},{"key": "1", "value": "18"},{"key": "1", "value": "42"}, {"key": "2", "value":"20"}];
        return this.clusterColumns;
    },

    getMaxColumns: function() {
        return Math.floor(this.plotWidth / this.plotColumnWidth);
    },

    /* *
     * 
     * Event handlers
     *
     * */

    pausePlayButtonClicked: function (event) {
        if(!plotPaused) {
            // plot is playing, so we should pause it, and change the button to Play
            this.updatePlayPauseButton("Play");
            plotPaused = !plotPaused;
        } else {
            this.updatePlayPauseButton("Pause");
        }
    },

    clusterBoxClicked: function(clusterBox) {
        // Override me!
    },

    
    // This method is not used..
    //
    // This method requests the main application to collect and add data to clusterColumns
    // the method is blocking for a number of retries (if set to 0, it will be blocking until 
    // data is received).
    //
    // @param retries Number of retries it will wait for the data to be received (0 will cause
    //                loop that ends when data is received)
    // @param timeout The timeout parameter specifies the time (in ms) between each checking if
    //                data has been received.
    //
    // @returns       Returns true if data has been received, otherwise false.
    requestData: function(maxRetries, timeout) {

        var retries = 0;

        var waitForData = function(self) {
            if(!self.unplottedDataExists() && retries++ < maxRetries) {
                var newData = self.retrieveData();

                self.clusterColumns = self.clusterColumns.concat(newData);
                setTimeout(waitForData, timeout);
            }
            }(this);

        return this.unplottedDataExists();
    },

    /* *
     * 
     * Helper methods
     *
     * */

    getMaxValue: function(clusterData) {
        var maxValue = 0;

        for( var key in clusterData)
            if(clusterData[key]['value'] > maxValue)
                maxValue = clusterData[key]['value'];
        return maxValue;
    },

    getColorFromValue: function(value, maxValue) {

        var red = Math.floor(((value / (maxValue+25)) * 255));

        return "rgb(255, "+(255-red)+","+(255-red)+")";
    }
    
};

    
var RandomLatencyDataGenerator = function(numberOfColumns, numberOfClusters) {

    var latencyData = [];

    var maxValue = 50;

    for(var i=0;i<numberOfColumns;i++) {
        var column = function () {
            var resultData = [];
            for(var j=0;j<numberOfClusters;j++)
            {
                var clusterValue = Math.floor((Math.random()*maxValue));
                
                // some constraints (to make the fake data look real)
                var randomLow = Math.floor((Math.random()*2)+1);

                if((j>=0 && j<(10+5*randomLow)) || (j<numberOfClusters-2 && j > numberOfClusters-15+randomLow))
                    clusterValue = 0;
                    
                if(j==numberOfClusters-1 || j==numberOfClusters-2) {
                    clusterValue = maxValue + Math.floor(0.3*maxValue);
                
                    if(j==numberOfClusters-2)
                        clusterValue -= 5*randomLow;

                clusterValue = clusterValue < 0 ? 0 : clusterValue;

                } 
                resultData.push({key: j, value: clusterValue});
            }

            return resultData;
        };

        latencyData.push({key: "column-"+i, data: column()});
    }

    return latencyData;

};

/* *
 * Parse data and make it into a cluster that can be inputed to HeatMapPlot.js
 *
 * @param data            Raw data from a data source, should be a k/v list, with an additional name index.
 *                        Example: var rawData = {{"key": "2012-10-19T16:22:00:123-0700", "name": "utf8", "value": "544"},...}
 *
 * @param clusterInterval The interval timeslice (in ms) that the data will be divided in.
 *
 * */ 

 var DataColumnParser = {
    init: function(data, clusters, columnInterval) {
        this.data = data;
        this.clusters = clusters;
        this.columnInterval = columnInterval;

        this.currentColumnTime = this.getTimeInMillis(this.data[0]["key"]);
    },

    result: [],
    clusterInterval: {"from": -1, "to": -1},
    currentIndex: 0,


    getTimeInMillis: function(timestamp) {
        var millis = parseFloat(timestamp)*1000;
        return millis;
    },

    getMinimumDataValue: function(from,to) {
        var min = Infinity;

        if(to>this.data.length) {
            to = this.data.length;
            if(from-(to-this.data.length) < 0)
              from = 0;
            else
              from = from - (to-this.data.length);
          }

        for(var i=from; i<to;i++) {
            var dataValue = this.data[i]["value"];

            if(dataValue <= min)
                min = dataValue;
        }

        return parseInt(min);
    },

    getClusterIntervalSize: function(startTime) {
        var min = Infinity;
        var max = 0;

        for(var i=0; i<this.data.length;i++) {
            var dataValue = this.data[i]["value"];

            if(dataValue >= max)
                max = dataValue;
            if(dataValue <= min)
                min = dataValue;

        }
        
        var valueSpan = max-min;

        return Math.ceil(valueSpan/this.clusters);
    },

    valueIsWithinTheCurrentCluster: function (value) {
        return value >= this.clusterInterval["from"]  && value <= this.clusterInterval["to"];
    },

    keyIsWithinCurrentColumn: function(key) {
        return key >= this.currentColumnTime && key <= this.currentColumnTime + this.columnInterval;
    },


    createSkeleton: function() {

        var result = [];
        var addIntervalTime = 0;

        var last = this.getTimeInMillis(this.data[this.data.length-1]["key"]);
        var first = this.getTimeInMillis(this.data[0]["key"]);
        var numberOfColumns = Math.floor(((last-first)/this.columnInterval))+1;

        for(var i=this.currentIndex;i<this.currentIndex+numberOfColumns; i++)
        {
            var columnData = {};

            columnData["key"] = this.currentColumnTime+addIntervalTime;
            columnData["data"] = [];

            addIntervalTime += this.columnInterval;

            //var intervalFrom = this.getMinimumDataValue(this.currentIndex, this.currentIndex+numberOfColumns);
            var intervalFrom = this.getMinimumDataValue(0, this.data.length);
            var intervalSize = this.getClusterIntervalSize();
            
            
            for(var j=0;j<this.clusters;j++) {
                var clusterList = {};
                clusterList['key'] = intervalFrom+" - "+(parseInt(intervalFrom)+parseInt(intervalSize));
                clusterList['value'] = 0;
                intervalFrom += intervalSize+1;
                clusterList['data'] = [];
                columnData["data"].push(clusterList);
            }
      
            result.push(columnData);

        }
        return result;
    },


    fillSkeleton: function(skeleton) {

        var dataIndex = 0;

        var intervalFrom = this.getMinimumDataValue(0,this.data.length);
        var intervalSize = this.getClusterIntervalSize();
        
        for(var idx in this.data)
        {
            var indexInSkeleton = Math.floor((this.getTimeInMillis(this.data[idx]["key"]) - parseInt(skeleton[0]["key"]))/this.columnInterval);

            var value = parseInt(this.data[idx]["value"]);

            var indexInColumn = Math.floor((value - intervalFrom)/intervalSize);

            if(indexInColumn == skeleton[indexInSkeleton]["data"].length)
                indexInColumn -= 1;

            skeleton[indexInSkeleton]["data"][indexInColumn]["value"] += 1;
            skeleton[indexInSkeleton]["data"][indexInColumn]["data"].push(this.data[idx]);
        }
        return skeleton;
    },


    getClusterData: function() {

        var columnData = {};
        
        columnData = {};
        columnData["key"] = this.currentColumnTime;
        columnData["data"] = [];

        var intervalFrom = this.getMinimumDataValue();
        var intervalSize = this.getClusterIntervalSize();
        
        var clusterList = {};
        for(var i=0;i<this.clusters;i++) {
            clusterList['key'] = intervalFrom+" - "+(parseInt(intervalFrom)+parseInt(intervalSize));
            clusterList['value'] = 0;
            intervalFrom += intervalSize;
            if(i==0)
                intervalFrom += 1;
            console.log(this.clusters);
            columnData["data"].push(clusterList);
        }
        
        for(this.currentIndex in this.data) {

            // Get the current timestamp we are on right now.
            var currentKey = this.getTimeInMillis(this.data[this.currentIndex]["key"]);
                    
            if(!this.keyIsWithinCurrentColumn(currentKey)) {
                this.result.push(columnData);
                columnData = {};
                this.currentColumnTime += this.columnInterval;
                columnData["key"] = this.currentColumnTime;
                columnData["data"] = [];

                var intervalFrom = this.getMinimumDataValue();
                var intervalSize = this.getClusterIntervalSize();
                
                
                for(var i=0;i<this.clusters;i++) {
                    var clusterList = {};
                    clusterList['key'] = intervalFrom+" - "+(parseInt(intervalFrom)+parseInt(intervalSize));
                    clusterList['value'] = 0;
                    intervalFrom += intervalSize + 1;
                    console.log(this.clusters);
                    columnData["data"].push(clusterList);
                }

                // 
                // for i=0;i<antalClusters;i++
                // skapa kluster i en loop
                // 
            } else
            { 
                
            } 

            // kolla vilket kluster denna hor hemma i, och lagg in den dar.
            // man kan nog rakna ut var den borde finnas nagonstans genom att ta
            // index = Math.floor(value-startklustervarde / klusterInterval);
            // ej testat raden ovanfor!
            // columnData["data"].push(this.getJSONData(this.data[this.currentIndex])); 
        }

        this.result.push(columnData);

        return this.result;
    },

    getJSONData: function(dataRow) {
        if(this.valueIsWithinTheCurrentCluster(dataRow['value'])) {
            
        }
        return {"key": dataRow["key"], "value": dataRow["value"]};
    }

};

//var testData = [{"key": "1", "value": "17"},{"key": "1", "value": "18"},{"key": "1", "value": "42"}, {"key": "2", "value":"20"}];
//DataColumnParser.init(testData,2,1000);

//var result = DataColumnParser.createSkeleton();
//result = DataColumnParser.fillSkeleton(result);
//var text = "[";
for(key in result)
{
    text += "\n\t{'key': '"+result[key]['key']+"', 'data': [";

    for(key2 in result[key]['data'])
    {
        text += "\n\t\t{'key': '"+result[key]['data'][key2]['key']+"', ";
        text += "'value': '"+result[key]['data'][key2]['value']+"', ";
        text += "'data': [";

        for(key3 in result[key]['data'][key2]['data'])
        {
            text += "\n\t\t\t{'key': '"+result[key]['data'][key2]['data'][key3]['key']+"', ";
            text += "'value': '"+result[key]['data'][key2]['data'][key3]['value']+"'}";
        }
        text += "]}";
    }
    text += "]}";
}
text += "\n]";
//console.log(text);
// Input DataClusterParser.init(testData,2, 1)
// 
// Expected result:
// result = [{"key":"1","data":[{"key": "1000-1250", "value": "1", "data": [{"key": "1", "value": "1000"}]}, {"key": "1251-1501", "value": "1", "data": [{"key": "1500"}]}]}];
//

//var testData = [{"key": "1", "value": "1000"},{"key": "1", "value": "1500"},{"key": "2","value":"1000"},{"key": "2", "value":"2000"}];

/*
 * var DataClusterParser = function(data, clusters, columnInterval ) {

    var result = [];

    var clusterMillisStart = null;
    var cluster = {};

    var clusterInterval = {"from": -1, "to": -1};
    var intNumber = 0;

    // input unix timestamp
    var getTimeInMillis = function(timestamp) {
      
        var millis = parseFloat(timestamp)*1000;
       return millis; 
    };


    var columnTime = -1;
    for(index in data) {

        var timeInMillis = getTimeInMillis(data[index]['key']);

        var timestampIncludedInCurrentCluster = function() { return (timeInMillis >= clusterInterval["from"] && timeInMillis <= clusterInterval["to"]); }();


        if(columnTime = -1)
            columnTime = timeInMillis;
        if(timeInMillis > columnTime+columnInterval)
            result.push(cluster);

        if(!timestampIncludedInCurrentCluster) {

            if(!cluster["key"]) {
                clusterInterval["from"] = timeInMillis;
                clusterInterval["to"] = timeInMillis + interval;

                cluster["key"] = [clusterInterval["from"],clusterInterval["to"]].join(' - ');
                cluster["data"] = [];
            } else {

                // create new cluster 
                cluster = {};
                clusterInterval["from"] = clusterInterval["to"]+1;
                clusterInterval["to"] = clusterInterval["to"] + interval;

                cluster["key"] = [clusterInterval["from"],clusterInterval["to"]].join(' - ');
                cluster["data"] = [];
            }
        }  

    
        var clusterData = {"key": intNumber++, "value": data[index]["value"], "name": data[index]["name"]};

        cluster["data"].push(clusterData);
    }

    // push the last cluster
    result.push(cluster);


    return result;
}
*/
