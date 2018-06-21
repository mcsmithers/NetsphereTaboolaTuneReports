// Document Ready
$(document).ready(function() {
    /****************************************************
     *Get the setups ready for the apis
     ****************************************************/
    // Objects for api data


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

    };

    function buildEndpoint(endpoints) {

    }

    /**************************************************** 
     * Get the report data from Taboola
     ******************************************************/
    var taboolaData;

    function runTaboolaUpdates() {
        const account = "tapstone-auto-sc";
        const xmlhttp = new XMLHttpRequest();
        var requestStatus;

        // Setup Taboola so we can make requests
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200 && this.responseText == "success") {
                console.log('Hooray!  We hit the Taboola request endpoint');
            } else if (this.readyState == 4 && this.status == 200 && this.responseText != "success") {
                console.log('Fail!  Smack forehead and try again');
            }
        };

        // Get the Taboola data report
        xmlhttp.open("GET", "https://tapstone.com/tools/includes/taboolaReportStore.php");
        xmlhttp.send();

        var request = "https://tapstone.com/tools/includes/taboolaReportRequest.php?account=" + account;

        $.getJSON(request, function(data) {

            if (data.response.status == 1) {
                taboolaReportsData = data.data.results;
                taboolaReports = {};
                taboolaReports.data = [];

                // netsphereData.forEach(function(value, key) {
                //     const netsphereSubID = value.Subid;
                //     const revenue = value.Net_Revenue;
                //     const netsphereDate = value.Date;

                // // Splitting the subid from netsphere to get the subid and offer id for the new table
                // const splitter = netsphereSubID.split("_");
                // const subId = splitter[0];
                // const offerId = splitter[1];
                console.log("Here's the taboola reports data");
                console.log(taboolaReportsData);
                taboolaReportsData.forEach(function(value, key) {
                    const name = value.name;
                    const campaign = value.name;
                    const cost = value.cpc;
                    const spent = value.spent;
                    // console.log("taboola stuff");
                    // console.log(name, campaign, cost, spent);

                    // Splitting the subid from netsphere to get the subid and offer id for the new table
                    // const underscoreSplitter = name.split("_");
                    // const spaceSplitter = name.split(" ");
                    // const offerId = underscoreSplitter[0];
                    // const affiliateId = underscoreSplitter[1];
                    // console.log(offerId);
                    // console.log(affiliateId);


                    // const entryTest = objectExists(offerID);
                    // if (entryTest > -1) {
                    //     const entryData = new Object();
                    //     entryData.offer = offer;
                    //     console.log(entryData)
                    //     taboola.data[entryTest].data.push(entryData);
                    // } else {
                    //     const entry = new Object();
                    //     entry.offer = offer;
                    //     entry.affiliate = affiliate;
                    //     entry.affiliateID_offerID = affiliateID_offerID;
                    //     entry.taboolaDate = taboolaDate;

                    //     const entryData = new Object();
                    //     taboola.data.push(entry);
                    // }
                });

            } else {
                var msg = 'Request for Taboola data has failed';
                console.log("Error: " + msg);
                addError(msg);
            }
        });

        // Get the Taboola data for campaigns
        xmlhttp.open("GET", "https://tapstone.com/tools/includes/taboolaCampaignStore.php");
        xmlhttp.send();

        var request = "https://tapstone.com/tools/includes/taboolaCampaignRequest.php?account=" + account;

        $.getJSON(request, function(data) {

            if (data.response.status == 1) {
                taboolaCampaignsData = data.data.results;
                taboolaCampaigns = {};
                taboolaCampaigns.data = [];

                // netsphereData.forEach(function(value, key) {
                //     const netsphereSubID = value.Subid;
                //     const revenue = value.Net_Revenue;
                //     const netsphereDate = value.Date;

                // // Splitting the subid from netsphere to get the subid and offer id for the new table
                // const splitter = netsphereSubID.split("_");
                // const subId = splitter[0];
                // const offerId = splitter[1];
                console.log("Here's the taboola campaign data");
                console.log(taboolaCampaignsData);
                taboolaCampaignsData.forEach(function(value, key) {
                    const name = taboolaCampaignsData.name;
                    // console.log("taboola stuff");
                    // console.log(name, campaign, cost, spent);

                    // Splitting the subid from netsphere to get the subid and offer id for the new table
                    // const underscoreSplitter = name.split("_");
                    // const spaceSplitter = name.split(" ");
                    // const offerId = underscoreSplitter[0];
                    // const affiliateId = underscoreSplitter[1];
                    // console.log(offerId);
                    // console.log(affiliateId);


                    // const entryTest = objectExists(offerID);
                    // if (entryTest > -1) {
                    //     const entryData = new Object();
                    //     entryData.offer = offer;
                    //     console.log(entryData)
                    //     taboola.data[entryTest].data.push(entryData);
                    // } else {
                    //     const entry = new Object();
                    //     entry.offer = offer;
                    //     entry.affiliate = affiliate;
                    //     entry.affiliateID_offerID = affiliateID_offerID;
                    //     entry.taboolaDate = taboolaDate;

                    //     const entryData = new Object();
                    //     taboola.data.push(entry);
                    // }
                });

            } else {
                var msg = 'Request for Taboola data has failed';
                console.log("Error: " + msg);
                addError(msg);
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
        msg = "Well, #$%&, looks like something broke.  Error : " + error;
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