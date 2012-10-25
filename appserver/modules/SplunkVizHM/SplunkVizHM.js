
// A simple results table
Splunk.Module.SplunkVizHM = $.klass(Splunk.Module.DispatchingModule, {

    /*
     * overriding initialize to set up references and event handlers.
     */
    initialize: function($super, container) {
        $super(container);
        this.logger.info(this.moduleType, ".js initialized");
    },

    onJobDone: function(event) {
        this.getResults();
    },

    getResultParams: function($super) {
        var params = $super();
        var context = this.getContext();
        var search = context.get("search");
        var sid = search.job.getSearchId();

        if (!sid) this.logger.error(this.moduleType, "Assertion Failed.");

        params.sid = sid;
        return params;
    },

    renderResults: function($super, data) {
        if (!data) {            
            return;
        }
        //this.logger.info(this.moduleType, "Data in renderResults");
        //this.resultsContainer.html(data);
        $("document").ready(function() {
        	HeatMapPlot.init($("#plotWrapper"));
        	HeatMapPlot.startPlot();
        	DataColumnParser.init(data,10,10000);
        	HeatMapPlot.retrieveData = function() { return DataColumnParser.fillSkeleton(DataColumnParser.createSkeleton()) };
        });
    }
})

    
