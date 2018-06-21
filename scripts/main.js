// Document Ready
$(document).ready(function() {
    /****************************************************
     *Get the dates set up so ready for the Taboola api
     ****************************************************/


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

    const endpoints = {
        // tuneUrl: 'https://tsh.api.hasoffers.com/Apiv3/json?NetworkToken=NETXqfUQYBBISOBfs6ixG8BeFg5sKe&Target=Report&Method=getStats&fields[]=Stat.offer_id&fields[]=Stat.affiliate_id&fields[]=Affiliate.company&fields[]=Offer.name&fields[]=Stat.date',
        // netsphereUrl: 'https://tapstone.com/tools/includes/netsphereData.php?startDate=',
        // start_date_text: "&data_start=",
        // start_date_val: startDateString,
        // end_date_text: "&data_end=",
        // end_date_val: endDateString
    };

    function buildEndpoint(endpoints) {
        // const tuneEndpoint = endpoints.tuneUrl + endpoints.start_date_text + endpoints.start_date_val + endpoints.end_date_text + endpoints.end_date_val;
        // console.log(tuneEndpoint);
        // return tuneEndpoint;
    }
    // console.log("tuneEndPoint is" + tuneEndpoint);


    // Objects for api data


    /**************************************************** 
     * Get the report data from Taboola
     ******************************************************/

    function runTaboolaUpdates() {
        console.log("Taboola will run here");

        var request = "https://tapstone.com/tools/includes/taboolaCampaignRequest.php?account=tapstone-auto-sc/campaign-summary/dimensions/campaign_breakdown?start_date=2018-06-19&end_date=2018-06-20";
        $.getJSON(request, function(data) {
            if (data.response.status == 1) {
                console.log(data);
                var msg = 'Request for Taboola Data Failed: ' + data.response.error;
                console.log("Error: " + msg);
            }
        });


    }
    runTaboolaUpdates();



    /**************************************************** 
     * Get the report data from HasOffers aka Tune
     ******************************************************/
    var tune = {};

    function runTuneUpdates() {
        console.log("HO updates...");
        $.ajax({
            type: "GET",
            url: "https://tsh.api.hasoffers.com/Apiv3/json?NetworkToken=NETXqfUQYBBISOBfs6ixG8BeFg5sKe&Target=Report&Method=getStats&fields[]=Stat.offer_id&fields[]=Stat.affiliate_id&fields[]=Affiliate.company&fields[]=Offer.name&fields[]=Stat.date&start_date=2018-06-18&end_date=2018-06-19",
            data: {},
            dataType: "json"

        }).done(function(result) {

            tuneData = result.response.data.data;

            // "result" will contain whatever comes back from HasOffers
            tune = {};
            tune.data = [];

            tuneData.forEach(function(value, key) {
                const offerID = value.Stat.offer_id;
                const affiliateID = value.Stat.affiliate_id;
                const affiliateID_offerID = affiliateID + "_" + offerID;
                const affiliate = value.Affiliate.company;
                const offer = value.Offer.name;
                const tuneDate = value.Stat.date;
                const entryTest = objectExists(offerID);
                if (entryTest > -1) {
                    const entryData = new Object();
                    entryData.offer = offer;
                    console.log(entryData)
                    tune.data[entryTest].data.push(entryData);
                } else {
                    const entry = new Object();
                    entry.offer = offer;
                    entry.affiliate = affiliate;
                    entry.affiliateID_offerID = affiliateID_offerID;
                    entry.tuneDate = tuneDate;

                    const entryData = new Object();
                    tune.data.push(entry);
                }
            });

            function findWithValue(array, value) {
                for (var i = 0; i < array.length; i += 1) {
                    if (array[i] === value) {
                        return i;
                    }
                }
                return -1;
            }

            function findWithAttr(array, attr, value) {
                for (var i = 0; i < array.length; i += 1) {
                    if (array[i][attr] === value) {
                        return i;
                    }
                }
                return -1;
            }

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
            console.log("HasOffers data looks like...");
            console.log(tune.data);
            return (tune.data);
        });
    }

    runTuneUpdates();

    /**************************************************** 
     * Get the report data from Netsphere
     ******************************************************/

    function runNetsphereUpdates() {
        console.log("Netsphere data incoming...");
        $.ajax({
            type: "GET",
            url: "https://tapstone.com/tools/includes/netsphereData.php?startDate=2018-06-15&endDate=2018-06-17",
            data: {},
            dataType: "json"

        }).done(function(result) {
            netsphereData = result;
            //console.log(netsphereData);
            netsphere = {};
            netsphere.data = [];

            netsphereData.forEach(function(value, key) {
                const netsphereSubID = value.Subid;
                const revenue = value.Net_Revenue;
                const netsphereDate = value.Date;

                // Splitting the subid from netsphere to get the subid and offer id for the new table
                const splitter = netsphereSubID.split("_");
                const subId = splitter[0];
                const offerId = splitter[1];
                // console.log("The sub id is " + subId + " and the offer is " + offerId);
                const entryTest = objectExists(subId);
                if (entryTest > -1) {
                    const entryData = new Object();
                    entryData.subId = subId;
                    //console.log(entryData);
                    netsphere.data[entryTest].data.push(entryData);
                    // netsphere.data[entryTest].push(entryData);
                } else {
                    const entry = new Object();
                    entry.subId = subId;
                    entry.offerId = offerId;
                    entry.revenue = revenue;
                    entry.netsphereDate = netsphereDate;

                    entry.data = [];

                    const entryData = new Object();
                    netsphere.data.push(entry);
                }

            });
            //console.log(netsphere);

            function findWithValue(array, value) {
                for (var i = 0; i < array.length; i += 1) {
                    if (array[i] === value) {
                        return i;
                    }
                }
                return -1;
            }

            function findWithAttr(array, attr, value) {
                for (var i = 0; i < array.length; i += 1) {
                    if (array[i][attr] === value) {
                        return i;
                    }
                }
                return -1;
            }

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
            console.log(netsphere.data);
            return (netsphere.data);
        });
    }
    runNetsphereUpdates();

    // If our start date gets changed in the picker, let's take that in and update the UI
    $('#start-date,#end-date').change(function() {
        startDateString = $('#start-date').val();
        endDateString = $('#end-date').val();
        endpoints.start_date_val = startDateString;
        endpoints.end_date_val = endDateString;
        reportTable.ajax.reload();
        console.log("Date changed to " + endDateString);
    });


    // UI error in case API not working
    function addError(msg) {
        $("div.last-update").css({ 'color': 'red', 'font-size': '150%' });
        $("div.last-update").html(msg);
        console.log("Well, #$%&, looks like something broke.  Error : ", error);
    }


    /***********************************************************
     * Update the UI and make the table ready to use
     ************************************************************/

    // Build Table and make it exportable
    function buildTable() {
        console.log("Generating a table will happen here");
    }

    const reportTable = buildTable();



    // Foundation fired up for its menu ations
    $(document).foundation();
});