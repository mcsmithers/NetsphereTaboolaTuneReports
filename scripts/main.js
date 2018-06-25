// Document Ready
$(document).ready(function() {
    /****************************************************
     *Get the setups ready for the apis
     ****************************************************/
    // Objects for api data
    tune = {};
    netsphere = {};
    taboola = {};

    // Setup Date Pickers
    var today = new Date();
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    $('#start-date').fdatepicker({
        initialDate: (yesterday.getFullYear()) + '-' + (yesterday.getMonth() + 1) + '-' + (yesterday.getDate()),
        format: 'yyyy-mm-dd',
        disableDblClickSelection: true,
        leftArrow: '<<',
        rightArrow: '>>',
        closeIcon: 'X',
        endDate: today
    });

    $('#end-date').fdatepicker({
        initialDate: (today.getFullYear()) + '-' + (today.getMonth() + 1) + '-' + (today.getDate()),
        format: 'yyyy-mm-dd',
        disableDblClickSelection: true,
        leftArrow: '<<',
        rightArrow: '>>',
        closeIcon: 'X',
        endDate: today
    });

    $("#start-date").change(function() {
        runNetsphereUpdates();
        runTaboolaUpdates();
        runTuneUpdates();
    });


    /**************************************************** 
     * Get the report data from all APIs
     ******************************************************/
    var startDate;
    var startDateString;
    var endDate;
    var endDateString;
    var dateRange;
    var dates = [];

    // Calculate Date Range
    startDateString = $('#start-date').val().replace(new RegExp("-", "g"), '-');
    startDate = new Date(startDateString);
    endDateString = $('#end-date').val().replace(new RegExp("-", "g"), '-');
    endDate = new Date(endDateString);
    console.log("Original start date is ", startDateString);
    console.log("Original end date is ", endDateString);

    /**************************************************** 
     * Get the report data from Taboola
     ******************************************************/

    function runTaboolaUpdates() {
        var startDateSelect = $('#start-date').val();
        var endDateSelect = $('#end-date').val();
        const account = "tapstone-auto-sc";
        const xmlhttp = new XMLHttpRequest();
        var requestStatus;
        var request = "https://tapstone.com/tools/includes/taboolaReportRequest.php?account=" + account + '&start_date=' + startDateSelect + '&end_date=' + endDateSelect;

        $.getJSON(request, function(data) {

            if (data.response.status == 1) {
                taboolaReportData = data.data.results;
                taboola = {};
                taboola.data = [];

                console.log("Taboola report data incoming...");
                taboolaReportData.forEach(function(value, key) {
                    const date = value.date;
                    const campaign = value.campaign;
                    const name = value.campaign_name;
                    const clicks = value.clicks;
                    const actions = value.cpa_actions_num;
                    const cost = value.cpc;
                    const spent = value.spent;
                    const splitter = name.split("_");
                    const offerId = splitter[0].slice(-4);
                    const affiliateId = splitter[1];
                    const entryTest = objectExists(date);
                    const entry = new Object();
                    entry.cost = cost;
                    entry.spent = spent;
                    entry.date = date;
                    entry.campaign = campaign;
                    entry.offerId = offerId;
                    entry.affiliateId = affiliateId;
                    entry.clicks = clicks;
                    entry.actions = actions;

                    const entryData = new Object();
                    taboola.data.push(entry);
                });
                console.log("Taboola Data looks like...");
                console.log(taboola);
                return taboola;

                function objectExists(val) {
                    var found = -1;
                    for (var i = 0; i < taboola.data.length; i++) {
                        if (taboola.data[i].date == val) {
                            found = i;
                            break;
                        }
                    }
                    return found;
                }

            } else {
                var msg = 'Request for Taboola data has failed';
                console.log("Error: " + msg);
                addError(msg);
            }
        });
        return taboola;
    }

    runTaboolaUpdates();


    /**************************************************** 
     * Get the report data from HasOffers aka Tune
     ******************************************************/
    //&start_date=2018-06-18&end_date=2018-06-19
    function runTuneUpdates() {
        console.log("HO updates...");

        // Formatting the dates for this api
        var startDateSelect = $('#start-date').val();
        var endDateSelect = $('#end-date').val();

        $.ajax({
            type: "GET",
            url: "https://tsh.api.hasoffers.com/Apiv3/json?NetworkToken=NETXqfUQYBBISOBfs6ixG8BeFg5sKe&Target=Report&Method=getStats&fields[]=Stat.offer_id&fields[]=Stat.affiliate_id&fields[]=Affiliate.company&fields[]=Offer.name&fields[]=Stat.date",
            data: {},
            dataType: "json"

        }).done(function(result) {

            tuneData = result.response.data.data;
            tune = {};
            tune.data = [];

            tuneData.forEach(function(value, key) {
                const offerId = value.Stat.offer_id;
                const affiliateId = value.Stat.affiliate_id;
                const affiliate = value.Affiliate.company;
                const offer = value.Offer.name;
                const date = value.Stat.date;
                const entryTest = objectExists(offerId);
                const entry = new Object();
                entry.offer = offer;
                entry.affiliate = affiliate;
                entry.date = date;
                entry.affiliateId = affiliateId;
                entry.offerId = offerId;
                const entryData = new Object();
                tune.data.push(entry);
            });

            function objectExists(val) {
                var found = -1;
                for (var i = 0; i < tune.data.length; i++) {
                    if (tune.data[i].offer == val) {
                        found = i;
                        break;
                    }
                }
                return found;
            }
            return tune;
            console.log("HasOffers data looks like...");
            console.log(tune);
        });
        return tune;
    }

    runTuneUpdates();

    /**************************************************** 
     * Get the report data from Netsphere
     ******************************************************/
    function runNetsphereUpdates() {
        console.log("Netsphere data incoming...");
        // Formatting the dates for this api
        var startDateSelect = $('#start-date').val();
        var endDateSelect = $('#end-date').val();

        $.ajax({
            type: "GET",
            url: "https://tapstone.com/tools/includes/netsphereData.php?startDate=" + startDateSelect + "&endDate=" + endDateSelect,
            data: {},
            dataType: "json"

        }).done(function(result) {
            netsphereData = result;
            // console.log(netsphereData);
            netsphere = {};
            netsphere.data = [];

            netsphereData.forEach(function(value, key) {
                const subId = value.Subid;
                const revenue = value.Net_Revenue;
                const date = value.Date;

                // Splitting the subid from netsphere to get the subid and offer id for the new table
                const splitter = subId.split("_");
                const affiliateId = splitter[0];
                const offerId = splitter[1];
                const entryTest = objectExists(offerId);

                const entry = new Object();
                entry.subId = subId;
                entry.offerId = offerId;
                entry.affiliateId = affiliateId;
                entry.revenue = revenue;
                entry.date = date;
                entry.data = [];
                const entryData = new Object();
                netsphere.data.push(entry);

            });

            function objectExists(val) {
                var found = -1;
                for (var i = 0; i < netsphere.data.length; i++) {
                    if (netsphere.data[i].subId == val) {
                        found = i;
                        break;
                    }
                }
                return found;
            }
            console.log("Netsphere data looks like...");
            console.log(netsphere);
            return netsphere;

        });
        return netsphere;
    }
    runNetsphereUpdates();

    /***********************************************************
     * Compare the objects and merge them
     ************************************************************/
    function getObjectKeys() {
        console.log("Keys look like...");
        console.log(tune);
    }
    getObjectKeys();



    /***********************************************************
     * Update the UI and make the table ready to use
     ************************************************************/

    // Build Table and make it exportable
    function buildTable() {
        console.log("Generating a table will happen here");
    }

    var reportTable = buildTable();

    // Foundation fired up for its menu ations
    $(document).foundation();
});