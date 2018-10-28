/**
 * Setup custom menu for the sheet
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('DCM Functions')

      .addItem('Setup Sheets', 'setupTabs')
      .addSeparator()
      .addItem('Get Placements', 'getAllPlacements')
      .addItem('Get All Creatives', 'getAllCreatives')
      .addSeparator()
      .addItem('Bulk Create Campaigns', 'bulkCreateCampaigns')
      .addItem('Bulk Create Placements', 'bulkCreatePlacements')
      .addItem('Bulk Assign Creatives', 'bulkAssignCreatives')
      .addItem('Bulk Assign URLs', 'bulkAssignUrls')
      .addSeparator()
      .addItem('Bulk Create Floodlight Tags', 'bulkCreateFloodlightTags')
     
      .addToUi();
}

/**
 * Read campaign information from sheet and use DCM API to bulk insert them
 * in DCM 
 */
function bulkCreateCampaigns() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(BULK_CREATE_CAMPAIGNS);

  // This represents ALL the data
  var range = sheet.getDataRange();
  var values = range.getValues();

  const profile_id = _fetchProfileId();
  const advertiser_id = _fetchAdvertiserId();

  // build request body resources
  for (var i = 1; i < values.length; ++i) {
    var currentRow = i + 1;
    var currentPlacement = values[i];
    var campaign_name = currentPlacement[0]; 
    var lp_name = currentPlacement[1]; 
    var lp_url = currentPlacement[2]; 
    var campaign_start = currentPlacement[3];
    var campaign_end = currentPlacement[4];
    var resource = {
        "startDate": campaign_start,
        "endDate" : campaign_end,
        "name": campaign_name,
        "advertiserId" : advertiser_id
      };

    
    var newCampaign = DoubleClickCampaigns.Campaigns
                                          .insert(resource, profile_id, lp_name, lp_url);
    
    sheet.getRange("F" + currentRow)
         .setValue(newCampaign.id).setBackground(AUTO_POP_CELL_COLOR);
    
      }  
  }




/**
 * Use DCM API to get a list of all placements from the specified campaign, print it out on the sheet
 */
function getAllPlacements() {
  const profile_id = _fetchProfileId();
  const campaign_id = _fetchCampaignId();
  var placementsList = DoubleClickCampaigns.Placements
                                           .list(profile_id, {
                                            'campaignIds' : campaign_id,
                                             'archived' : false
                                           }).placements;

  var sheet = _setupAssignCreativesSheet();

  for (var i = 0; i < placementsList.length; ++i) {
    var currentObject = placementsList[i];
    var rowNum = i+2;
    
    sheet.getRange("A" + rowNum).setNumberFormat('@')
         .setValue(currentObject.siteId).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("B" + rowNum).setNumberFormat('@')
         .setValue(currentObject.keyName).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("C" + rowNum).setNumberFormat('@')
         .setValue(currentObject.id).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("D" + rowNum)
         .setValue(currentObject.name).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("E" + rowNum)
         .setValue(currentObject.size.width + 'x' + currentObject.size.height).setBackground(AUTO_POP_CELL_COLOR);

  }
}



/**
 * CREATE PLACMENTS
 * Read placement information from sheet and use DCM API to bulk insert them
 * in the DCM campaign
 */
function bulkCreatePlacements() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(BULK_CREATE_PLACEMENT);

  // This represents ALL the data
  var range = sheet.getDataRange();
  var values = range.getValues();

  const profile_id = _fetchProfileId();
  const campaign_id = _fetchCampaignId();

  // build request body resources
  for (var i = 1; i < values.length; ++i) {
    var currentRow = i + 1;
    var currentPlacement = values[i];
    var site_id = currentPlacement[0];
    var placement_name = currentPlacement[2]; 
    var placement_start = currentPlacement[4];
    var placement_end = currentPlacement[5];
    var placement_type = currentPlacement[6];
    var placement_cost_type = currentPlacement[7];
    var placement_cost_units = currentPlacement[8];
    var placement_cost_rate = currentPlacement[9];
    var width = currentPlacement[3].substr(0, currentPlacement[3].indexOf('x'));
    var height = currentPlacement[3].split('x').pop();
    var pricing_type;
    var pricing_rate;

    var pricing_rate = placement_cost_rate*1000000000;


        if (placement_cost_type == "CPA") {
        pricing_type = "PRICING_TYPE_CPA";
    }
        if (placement_cost_type == "CPC") {
        pricing_type = "PRICING_TYPE_CPC";
    }
        if (placement_cost_type == "CPM") {
        pricing_type = "PRICING_TYPE_CPM";
    }
        if (placement_cost_type == "CPM_ACTIVEVIEW") {
        pricing_type = "PRICING_TYPE_CPM_ACTIVEVIEW";
    }
        if (placement_cost_type == "FLAT_RATE_CLICKS") {
        pricing_type = "PRICING_TYPE_FLAT_RATE_CLICKS";
    }
        if (placement_cost_type == "FLAT_RATE_IMPRESSIONS") {
        pricing_type = "PRICING_TYPE_FLAT_RATE_IMPRESSIONS";
    }


   var placementResource = {
        "siteId": site_id,
        "campaignId" : campaign_id,
        "name": placement_name,
        "size": {
          "height": height,
          "width": width
        },
        "compatibility": placement_type,
        "pricingSchedule": {
          "startDate": placement_start,
          "endDate": placement_end,
          "pricingType": pricing_type,
          "capCostOption" : "CAP_COST_CUMULATIVE",
          "pricingPeriods" : [{
          
              "startDate": placement_start,
              "endDate": placement_end,
              "units": placement_cost_units,
              "rateOrCostNanos": pricing_rate

          }
      ],
        },
        "paymentSource": "PLACEMENT_AGENCY_PAID",
        "tagFormats": [
          "PLACEMENT_TAG_IFRAME_JAVASCRIPT",
          "PLACEMENT_TAG_JAVASCRIPT",
          "PLACEMENT_TAG_STANDARD",
          "PLACEMENT_TAG_TRACKING",
          "PLACEMENT_TAG_INTERNAL_REDIRECT"
        ]
    };



    var newPlacement = DoubleClickCampaigns.Placements
                                           .insert(placementResource,
                                                    profile_id);
    
    sheet.getRange("K" + currentRow)
         .setValue(newPlacement.id).setBackground(AUTO_POP_CELL_COLOR);

    sheet.getRange("B" + currentRow)
         .setValue(newPlacement.keyName).setBackground(AUTO_POP_CELL_COLOR);


  }
}



/**
 * Use DCM API to get a list of all creatives from the specified campaign, print it out on the sheet
 */
function getAllCreatives() {
  const profile_id = _fetchProfileId();
  const campaign_id = _fetchCampaignId();
  var placementsList = DoubleClickCampaigns.Creatives
                                           .list(profile_id, {
                                            'campaignId' : campaign_id
                                           }).creatives;

  var sheet = _setupAssignGetCreativesSheet();

  for (var i = 0; i < placementsList.length; ++i) {
    var currentObject = placementsList[i];
    var rowNum = i+2;
    

    sheet.getRange("A" + rowNum).setNumberFormat('@')
         .setValue(currentObject.name).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("B" + rowNum).setNumberFormat('@')
         .setValue(currentObject.idDimensionValue.value).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("C" + rowNum).setNumberFormat('@')
         .setValue(currentObject.size.width + 'x' + currentObject.size.height).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("D" + rowNum)
         .setValue(currentObject.artworkType).setBackground(AUTO_POP_CELL_COLOR);

  }
}











/**
 * BulkAssing Creatives
 **/
function bulkAssignCreatives() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(BULK_ASSIGN_CREATIVES);

  // This represents ALL the data
  var range = sheet.getDataRange();
  var values = range.getValues();

  const profile_id = _fetchProfileId();
  const campaign_id = _fetchCampaignId();
  const advertiser_id = _fetchAdvertiserId();

  
  // build request body resources
  for (var i = 1; i < values.length; ++i) {
    var currentRow = i + 1;
    var currentPlacement = values[i];
    var placement_id = currentPlacement[2];
    var placement_name = currentPlacement[3];
    var creative_id = currentPlacement[5];
    var placement_size = currentPlacement[4];
    var creative_name = currentPlacement[6];
    var custom_url = currentPlacement[9];
    var creative_type = currentPlacement[8];
    
    var date_time = new Date();
    var startDateIso = date_time.toISOString();
    
    var endDate = DoubleClickCampaigns.Placements
                                        .get(profile_id, placement_id).pricingSchedule.endDate;
    
    var endDateIso = endDate+'T00:00:00Z';
    
    var ad_name = creative_name + "-" + placement_name;
    var placement_type = placement_type_now;
    var placement_type_now;
        
        if (placement_size == "1x1") {
        placement_type = "AD_SERVING_TRACKING";
    } else {
        placement_type = "AD_SERVING_STANDARD_AD";
    }
    
    var AdInsertion = {
        "advertiserId" : advertiser_id,
        "campaignId" : campaign_id,
        "active": true,
        "startTime" : startDateIso,
        "endTime" : endDateIso,
        "type" : placement_type,
        "name" : ad_name,

        "placementAssignments" : [{
          "placementId" : placement_id,
          "active" : true      
        }],
        "creativeRotation" : {
        "creativeAssignments" : [{
          "creativeId" : creative_id,
          "active" : true,
          
        "clickThroughUrl": {
          "defaultLandingPage": false,
          "customClickThroughUrl": custom_url,
  },
        }],
},
      "deliverySchedule": {
        "priority": "AD_PRIORITY_15",
        "impressionRatio": "1"
    },
    };


    var newAds = DoubleClickCampaigns.Ads
                                        .insert(AdInsertion,
                                                    profile_id);
    
    
 if (placement_type == "AD_SERVING_STANDARD_AD" && creative_type == "ARTWORK_TYPE_HTML5") {
   var exitId1 = newAds.creativeRotation.creativeAssignments[0].richMediaExitOverrides[0].exitId
   }
 
 if (placement_type == "AD_SERVING_STANDARD_AD" && creative_type == "ARTWORK_TYPE_HTML5") {
   var exitId2 = newAds.creativeRotation.creativeAssignments[0].richMediaExitOverrides[1].exitId
   }
  
    
    
 if (creative_type == "ARTWORK_TYPE_HTML5") {
  var patchBody = {
  "creativeRotation": {
    "creativeAssignments": [
      {
        "creativeId": creative_id,
        "active": true,
        "clickThroughUrl": {
          "defaultLandingPage": false,
          "customClickThroughUrl": custom_url,
          "computedClickThroughUrl": custom_url
        },
        "richMediaExitOverrides": [
          {
            "exitId": exitId1,
            "enabled": true,
            "clickThroughUrl": {
              "defaultLandingPage": false,
              "customClickThroughUrl": custom_url,
              "computedClickThroughUrl": custom_url
            }
          },
           {
            "exitId": exitId2,
            "enabled": true,
            "clickThroughUrl": {
              "defaultLandingPage": false,
              "customClickThroughUrl": custom_url,
              "computedClickThroughUrl": custom_url 
      }
          }]
      }
    ]
  }
}
  }
if (creative_type == "ARTWORK_TYPE_HTML5") {
    var urlOverride = DoubleClickCampaigns.Ads
                                        .patch(patchBody, profile_id, newAds.id);
}
    
  }
}

