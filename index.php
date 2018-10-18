<?php

define("SCRIPT_ROOT", "http://localhost:8000/tools/");
?>

<!doctype html>

<html class="no-js" lang="en" dir="ltr">

<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HONeY</title>

  <!-- jquery -->
  <script src="https://tapstone.com/tools/js/vendor/jquery.js"></script>

  <!-- styles -->
  <link rel="stylesheet" href="https://tapstone.com/tools/css/jquery-ui.css">
  <link rel="stylesheet" href="https://tapstone.com/tools/css/foundation.css">
  <link rel="stylesheet" href="https://tapstone.com/tools/foundation-icons/foundation-icons.css" />
  <link rel="stylesheet" type="text/css" href="https://tapstone.com/tools/css/foundation-datepicker.min.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/TableExport/5.0.0/css/tableexport.min.css">
  <link rel="stylesheet" href="./styles/style.css">

  <!-- scripts -->
  <!-- Minified version of `es6-promise-auto` -->
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js"></script> 
<!-- styling from local-->
  <script src="https://tapstone.com/tools/js/jquery-ui.js"></script>
  <script src="https://tapstone.com/tools/js/foundation-datepicker.min.js"></script>
  <!-- moar styling and ui stuff -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.1.0/lodash.min.js"></script>
  <script src="https://tapstone.com/tools/js/vendor/foundation.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js"></script>
  <script src='https://cdn.jsdelivr.net/g/lodash@4(lodash.min.js+lodash.fp.min.js)'></script>
  <!-- d3 crap to draw and export-->
  <script src="https://d3js.org/d3.v5.js"></script>  
  <script src="https://d3js.org/d3-collection.v1.min.js"></script>
  <script src="https://unpkg.com/xlsx/dist/xlsx.full.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/TableExport/5.0.2/js/tableexport.min.js"></script>
  <!-- <script src="../node_modules/tableexport/src/stable/js/tableexport.min.js"></script> -->
  <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/TableExport/5.0.2/js/tableexport.min.js"></script> -->
  <!-- <script type="text/javascript" src="tableExport.min.js"></script> -->
  <script src="https://d3js.org/d3-time.v1.min.js"></script>
<script src="https://d3js.org/d3-time-format.v2.min.js"></script>
  <script src="./scripts/main.js"></script>


  <!-- Busy Load JS -->
  <script src="https://cdn.jsdelivr.net/npm/busy-load/dist/app.min.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/busy-load/dist/app.min.css" rel="stylesheet">


</head>

<body>

  <style type="text/css">
    .ui-autocomplete {
      max-height: 200px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    #barLogo {
      max-width: 160px;
      vertical-align: text-top;
      padding: 0 0 0 10px;
    }
  </style>

  <br />

  <div class="row expanded">
    <div class="row" </div> <div class="large-12 columns">
      <div class="callout">
        <h3> HONeY Tool</h3>
        <p>Make reports for a chosen range of dates.</p>
        <p style="display: inline-block; margin: 5px;">Data ready from Netsphere?
          <div style="display: inline-block; margin: 5px;" id="netsphereStatus"></div>
        </p>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="large-12 columns">
      <div class="callout" id="error-box">
        <div id="errorContainer"></div>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="large-12 columns" id="date-pickers">
      <form>
        <div class="small-4 large-2 columns" id="start-date-box">
          <label for="start-date" class="text-right left">Start Date</label>
          <input type="text" id="start-date">
        </div>
        <div class="small-4 large-2 columns" id="end-date-box">
          <label for="end-date" class="text-right left">End Date</label>
          <input type="text" id="end-date">
        </div>
        <div class="small-4 large-4 columns"></div>
      </form>
    </div>
  </div>

  <div class="row" style="width: 100%">
    <div class="large-12 columns">
              <!--		Show Numbers Of Rows 		-->
  <!-- <select class="form-control" name="state" id="maxRows">
    <option value="5000">Show ALL Rows ▼</option>
    <option value="25">25</option>
    <option value="50">50</option>
    <option value="100">100</option>
  </select><br/> -->
      <table id="table">
      </table>
    </div>
  </div>
  </div>

  </div>
  <br />
  <br />
  <br />
  <br />
  </div>


</body>

</html>