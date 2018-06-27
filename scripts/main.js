// Document Ready
$(document).ready(function() {
    /****************************************************
     *Get the setups ready for the apis
     ****************************************************/
    // Objects for api data
    var tune;
    var netsphere;
    var taboola;

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
        endDate: yesterday
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

    $("#end-date").change(function() {
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

    // /**************************************************** 
    //  * Get the report data from Netsphere
    //  ******************************************************/
    netsphere = {};
    taboola = {};
    tune = {};

    netsphere.data = [];
    tune.data = [];
    taboola.data = [];

    // Formatting the dates for this api
    var startDateSelect = $('#start-date').val();
    var endDateSelect = $('#end-date').val();

    const getNetsphere = () => $.ajax({
        type: "GET",
        url: "https://tapstone.com/tools/includes/netsphereData.php?startDate=" + startDateSelect + "&endDate=" + endDateSelect,
        data: {},
        async: false,
        dataType: "json"
    })

    getNetsphere()
        .then(response => {
            // console.log(response);
            response.forEach(function(value, key) {
                const subId = value.Subid;
                const revenue = value.Net_Revenue;
                const date = value.Date;
                // Splitting the subid from netsphere to get the subid and offer id for the new table
                const splitter = subId.split("_");
                const affiliateId = splitter[0];
                const offerId = splitter[1];
                const entry = new Object();
                entry.subId = subId;
                entry.offerId = offerId;
                entry.affiliateId = affiliateId;
                entry.date = date;
                entry.data = [];
                netsphere.data.push(entry);
            });
            console.log("Netsphere data looks like...");
            console.log(netsphere);
        })

    const getTune = () => $.ajax({
        type: "GET",
        url: "https://tsh.api.hasoffers.com/Apiv3/json?NetworkToken=NETXqfUQYBBISOBfs6ixG8BeFg5sKe&Target=Report&Method=getStats&fields[]=Stat.offer_id&fields[]=Stat.affiliate_id&fields[]=Affiliate.company&fields[]=Offer.name&fields[]=Stat.date",
        data: {},
        async: false,
        dataType: "json",
    })
    getTune()
        .then(response => {
            tuneData = response.response.data.data;
            tuneData.forEach(function(value, key) {
                const offerId = value.Stat.offer_id;
                const affiliateId = value.Stat.affiliate_id;
                const affiliate = value.Affiliate.company;
                const offer = value.Offer.name;
                const date = value.Stat.date;
                const entry = new Object();
                entry.offer = offer;
                entry.affiliate = affiliate;
                entry.date = date;
                entry.affiliateId = affiliateId;
                entry.offerId = offerId;
                tune.data.push(entry);
            })
            console.log("Has offer looks like...");
            console.log(tune);
        });

    const account = "tapstone-auto-sc";
    const xmlhttp = new XMLHttpRequest();
    var requestStatus;
    var request = "https://tapstone.com/tools/includes/taboolaReportRequest.php?account=" + account + '&start_date=' + startDateSelect + '&end_date=' + endDateSelect;

    const getTaboola = () => $.ajax({
        type: "GET",
        url: request,
        data: {},
        async: false,
        dataType: "json"
    })
    getTaboola()
        .then(response => {
            taboolaReportData = response.data.results;
            // console.log("Taboola report data incoming...");
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
                const entry = new Object();
                entry.cost = cost;
                entry.spent = spent;
                entry.date = date;
                entry.campaign = campaign;
                entry.offerId = offerId;
                entry.affiliateId = affiliateId;
                entry.clicks = clicks;
                entry.actions = actions;
                entry.name = name;
                taboola.data.push(entry);
            });

            console.log("Taboola Data looks like...");
            console.log(taboola);
            mergeTaboolaAndNetsphere();
            // mergeEverything();

        })

    var a = taboola.data;
    var b = netsphere.data;
    var c = tune.data;

    /***********************************************************
     * Mutate the objects to make one bigger object based on matching values
     ************************************************************/

    function mergeTaboolaAndNetsphere() {
        var arrResults = _.map(a, function(obj) {
            return _.assign(obj, _.find(b, {
                date: obj.date,
                offerId: obj.offerId,
                actions: obj.actions,
                affiliateId: obj.affiliateId,
                campaign: obj.campaign,
                cost: obj.cost,
                spent: obj.spent,
                subId: obj.subId
            }));
        });
        console.log("Here's the result of netsphere and taboola");
        console.log(arrResults);
        mergeTaboolaAndTune();
    }


    function mergeTaboolaAndTune() {
        var arrResults2 = _.map(a, function(obj) {
            return _.assign(obj, _.find(c, {
                date: obj.date,
                offerId: obj.offerId,
                subId: obj.subId,
                affiliate: obj.affiliate,
                offer: obj.offer,
                actions: obj.actions,
                affiliateId: obj.affiliateId,
                campaign: obj.campaign,
                cost: obj.cost,
                name: obj.name,
                spent: obj.spent
            }));
        });
        console.log("Here's the result of tune and taboola");
        console.log(arrResults2);
        mergeEverything();
    }

    function mergeEverything() {
        var data = {};
        // var data = _.map(arrResults, function(obj) {
        //     return _.assign(obj, _.find(arrResults2, {
        //         date: obj.date,
        //         offerId: obj.offerId,
        //         actions: obj.actions,
        //         affiliateId: obj.affiliateId,
        //         campaign: obj.campaign,
        //         cost: obj.cost,
        //         spent: obj.spent,
        //         subId: obj.subId,
        //         offerId: obj.offerId,
        //         affiliate: obj.affiliate,
        //         offer: obj.offer
        //     }));
        console.log("Here's the result of all arrays");
        console.log(data);
        buildTable();
    }



    /***********************************************************
     * Update the UI and make the table ready to use
     ************************************************************/

    // Build Table and make it exportable
    function buildTable() {
        console.log("Generating a table will happen here");
    }

    // var reportTable = buildTable();

    // Foundation fired up for its menu actions
    $(document).foundation();
});