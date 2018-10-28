// Global variables/configurations
var DCMProfileID = 'DCMProfileID';
var DCMAdvertiserID = 'DCMAdvertiserID';
var DCMCampaignID = 'DCMCampaignID';
var AUTO_POP_HEADER_COLOR = '#a4c2f4';
var USER_INPUT_HEADER_COLOR = '#b6d7a8';
var AUTO_POP_CELL_COLOR = 'lightgray';


// Sheet names
var SETUP_SHEET = "Setup";
var BULK_CREATE_CAMPAIGNS = "Create Campaigns"
var BULK_CREATE_PLACEMENT = "Create Placements";
var BULK_ASSIGN_CREATIVES = "Assign Creatives";
var GET_CREATIVES = "Get Creative IDs";
var BULK_ASSIGN_URL = "Assign URLs";
var BULK_CREATE_FL = "Create FL Tags";


/**
 * fetch the DCM User profileid set in Setup tab
 * @return {string} DCM User profile ID.
 */
function _fetchProfileId() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var range = ss.getRangeByName(DCMProfileID);
  if (!range) {
    SpreadsheetApp.getUi().alert('User Profile ID cannot be null');
  }
  return range.getValue();
}

/**
 * fetch the DCM AdvertiserId set in Setup tab
 * @return {string} DCM Advertiser ID.
 */
function _fetchAdvertiserId() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var range = ss.getRangeByName(DCMAdvertiserID);
  if (!range) {
    SpreadsheetApp.getUi().alert('Advertiser ID cannot be null');
  }
  return range.getValue();
}

/**
 * fetch the DCM CampaignId set in Setup tab
 * @return {string} DCM Campaign ID.
 */
function _fetchCampaignId() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var range = ss.getRangeByName(DCMCampaignID);
  if (!range) {
    SpreadsheetApp.getUi().alert('Campaign ID cannot be null');
  }
  return range.getValue();
}


/**
 * Find and clear, or create a new sheet named after the input argument.
 * @param {string} sheetName The name of the sheet which should be initialized.
 * @param {boolean} lock To lock the sheet after initialization or not
 * @return {object} A handle to a sheet.
 */
function initializeSheet_(sheetName, lock) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (sheet == null) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }
  if (lock) {
    sheet.protect().setWarningOnly(true);
  }
  return sheet;
}

/**
 * Initialize all tabs and their header rows
 */
function setupTabs() {
  _setupSetupSheet();
  _setupCreateCampaignSheet();
  _setupCreatePlacementsSheet();
  _setupAssignCreativesSheet();
  _setupAssignGetCreativesSheet();
  _setupAssignUrlsSheet();

}

/**
 * Initialize the Setup sheet and its header row
 * @return {object} A handle to the sheet.
*/
function _setupSetupSheet() {
  var sheet = initializeSheet_(SETUP_SHEET, false);

  sheet.getRange('B5').setValue("User Profile ID")
                      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('C5').setBackground(USER_INPUT_HEADER_COLOR);

  sheet.getRange('B6').setValue("Advertiser ID")
                      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('C6').setBackground(USER_INPUT_HEADER_COLOR);

  sheet.getRange('B7').setValue("Campaign ID")
                      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('C7').setBackground(USER_INPUT_HEADER_COLOR);

  sheet.getRange("B5:C5").setFontWeight("bold").setWrap(true);
  sheet.getRange("B6:C6").setFontWeight("bold").setWrap(true);
  sheet.getRange("B7:C7").setFontWeight("bold").setWrap(true);

  return sheet;

}



/**
 * Initialize the CreateCampaigns sheet and its header row
 * @return {object} A handle to the sheet.
 */
function _setupCreateCampaignSheet() {
  var sheet = initializeSheet_(BULK_CREATE_CAMPAIGNS, false);

  sheet.getRange('A1').setValue("CampaignName").setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('B1').setValue("LP Name").setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('C1').setValue("LP URL")
                      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('D1').setValue("Start Date")
                      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('E1').setValue("End Date")
                      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('F1').setValue("Campaign ID")
                      .setBackground(AUTO_POP_HEADER_COLOR);

  sheet.getRange("A1:IJ").setFontWeight("bold").setWrap(true);
  return sheet;
}



/**
 * Initialize the CreatePlacements sheet and its header row
 * @return {object} A handle to the sheet.
 */
function _setupCreatePlacementsSheet() {
  var sheet = initializeSheet_(BULK_CREATE_PLACEMENT, false);

  sheet.getRange('A1').setValue("SiteID").setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('B1').setValue("SiteKeyName").setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('C1').setValue("PlacementName")
                      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('D1').setValue("Dimension")
                      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('E1').setValue("StartDate")
                      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('F1').setValue("EndDate")
                      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('G1').setValue("Compatibility")
                      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('H1').setValue("CostStructure")
                      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('I1').setValue("Units")
                      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('J1').setValue("Rate")
                      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('K1').setValue("Placement ID")
                      .setBackground(AUTO_POP_HEADER_COLOR);                    

  sheet.getRange("A1:K1").setFontWeight("bold").setWrap(true);
  return sheet;
}



/**
 * Initialize the Assign Creatives sheet and its header row
 * @return {object} A handle to the sheet.
 */
function _setupAssignCreativesSheet() {
  var sheet = initializeSheet_(BULK_ASSIGN_CREATIVES, false);

  sheet.getRange('A1').setValue("SiteID*").setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('B1').setValue("SiteName")
       .setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('C1').setValue("PlacementID")
       .setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('D1').setValue("PlacementName")
       .setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('E1').setValue("PlacementSize")
       .setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('F1').setValue("CreativeID")
       .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('G1').setValue("CreativeName")
       .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('H1').setValue("CreativeSize")
       .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('I1').setValue("CreativeType")
       .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('J1').setValue("ClickThrough URL")
       .setBackground(USER_INPUT_HEADER_COLOR);

  sheet.getRange("A1:J1").setFontWeight("bold").setWrap(true);
  return sheet;
  sheet.getRange("A1:H1").setFontWeight("bold").setWrap(true);
  return sheet;

}

/**
 * Initialize the Get Creative IDs sheet and its header row
 * @return {object} A handle to the sheet.
 */
function _setupAssignGetCreativesSheet() {
  var sheet = initializeSheet_(GET_CREATIVES, true);

  sheet.getRange('A1').setValue("Creative Name").setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('B1').setValue("Creative ID*")
       .setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('C1').setValue("Creative Size")
       .setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('D1').setValue("Creative Type")
       .setBackground(AUTO_POP_HEADER_COLOR);

  sheet.getRange("A1:D1").setFontWeight("bold").setWrap(true);
  return sheet;

}



/**
 * Initialize the Get Creative IDs sheet and its header row
 * @return {object} A handle to the sheet.
 */
function _setupAssignUrlsSheet() {
  var sheet = initializeSheet_(BULK_ASSIGN_URL, false);

  sheet.getRange('A1').setValue("SiteID*").setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('B1').setValue("SiteName")
       .setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('C1').setValue("PlacementID")
       .setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('D1').setValue("PlacementName")
       .setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('E1').setValue("PlacementSize")
       .setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('F1').setValue("CreativeID")
       .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('G1').setValue("CreativeName")
       .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('H1').setValue("CreativeSize")
       .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('I1').setValue("CreativeType")
       .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('J1').setValue("ClickThrough URL")
       .setBackground(USER_INPUT_HEADER_COLOR);

  sheet.getRange("A1:J1").setFontWeight("bold").setWrap(true);
  return sheet;

}
