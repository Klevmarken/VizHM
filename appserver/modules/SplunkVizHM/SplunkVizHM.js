
// A simple results table
Splunk.Module.SplunkVizHM = $.klass(Splunk.Module.DispatchingModule, {

    /*
     * overriding initialize to set up references and event handlers.
     */
    initialize: function($super, container) {
        /*$super(container);
        this.myParam = this.getParam("myParam");
        this.resultsContainer = this.container;*/
        print "FAAAAAAAAAAAAAAAAAAAAAIL 1";
    },

    onJobDone: function(event) {
        /*this.getResults();
        var results = this.getResults();
        print "FAAAAAAAAAAAAAAAAAAAAAIL 2";*/
    },

    getResultParams: function($super) {
       /* var params = $super();
        var context = this.getContext();
        var search = context.get("search");
        var sid = search.job.getSearchId();

        if (!sid) this.logger.error(this.moduleType, "Assertion Failed.");
        print "FAAAAAAAAAAAAAAAAAAAAAIL 3";
        params.sid = sid;
        return params;*/
    },

    renderResults: function($super, htmlFragment) {
        /*if (!htmlFragment) {
		return;
        }*/
        print "FAAAAAAAAAAAAAAAAAAAAAIL 4";
        /*var dataFrag =  htmlFragment;
        this.resultsContainer.html(htmlFragment);
        $("document").ready(function() {
        	HeatMapPlot.init($("#plotWrapper"));
                HeatMapPlot.startPlot();
                DataColumnParser.init(Data,50,1000);
                HeatMapPlot.retrieveData = function() { return DataColumnParser.fillSkeleton(DataColumnParser.createSkeleton()) };
       */
       }                        
    }
})

