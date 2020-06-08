# **DCM API Trafficking Tool**

Google Sheets based tool to perform bulk tasks to DCM accounts using DCM API.

## OVERVIEW

This AppScript-based tool lets you use a Google Sheets to perform bulk tasks including - Bulk Create Campaigns - 
Bulk Create Placements - Bulk Assign Creatives - Bulk Assign URLs - Bulk Update Costs - Bulk Update Campaign names. 
Additional helper tasks for these bulk creations include - Get Placements List - Get Creatives List - Get Campaign Names.


It uses DCM APIs to pull and push data to DCM.

The same result could be achieved by manually creating each entities through the
DCM UI, but the tool leverages the APIs and Spreadsheet functionalities to
automate the most manual steps.

In order to use this tool you need to have valid access to the **DoubleClick
Campaign Manager APIs** through your Google Account, and you will need to enable
that API in a Google Cloud Project so that you can generate authenticate the
tool (see the corresponding step of Initial Setup section below).

## INITIAL SETUP

*   Create a new [Google Spreadsheet](https://sheets.google.com) and open its
    script editor (from _Tools > Script Editor_)
    -   Copy the code from code.js and utils.js in two corresponding code.gs,
        utilities.gs files in your AppScript project
    -   Enable DCM API _Resources > Advanced Google Services_ and enable the
        _DCM/DFA Reporting and Trafficking API (v2.8)_
    -   Click on _Google API Console link_ at the bottom of _Advanced Google
        Services_ window to open the Google Cloud Platform project, select
        _Library_ from the left hand menu, then search and enable the DCM API in
        the project
*   Close the script editor and spreadsheet tabs both (this is necessary so the
    custom functions appear)
*   Re-open the Go back to the Spreadsheet, click on the _DCM Functions_ menu
    and select _Setup Sheets_ for the initial tabs and header rows setup (wait
    for the script to finish)
*   Remove any tab not needed (aside from the ones created by script)
*   Input the DCM Profile ID in the setup tab (i.e. at cell C5) then select
    _Data_ from the sheet menu and select _Named Ranges...._ to set the title
    _DCMProfileID_ and value _Setup!C5_

## USAGE

*   As general rules
    *   Only manually edit columns with green headers.
    *   Columns with blue headers will be auto-populated.
    *   Columns with a header* means it's required, otherwise optional
    *   Currently the script can generate only Display placements. So Compatibility must be always Display. 
    *   For CostStructure choose one of the following: CPA, CPC, CPM, CPM_ACTIVEVIEW, FLAT_RATE_CLICKS, FLAT_RATE_IMPRESSIONS
    
*   **Create Campaigns** allows you to bulk create campaigns by filling in the 
required cells under the Green headed columns. Profile ID and Advertiser ID are required!
    1. Fill in the cells under the Green headed columns
    2. Add-ons > DCM API > Bulk Create Campaigns
    3. Wait for the Script to finish loading
    4. Campaign ID will be auto populated in column F after the Script finished running

*   **Create Placements** allows you to bulk create placements by filling in the required cells under the Green headed columns. 
Profile ID, Advertiser ID and Campaign ID are required!
    1. Fill in the cells under the Green headed columns
    2. Add-ons > DCM API > Bulk Create Placements
    3. Wait for the Script to finish loading
    4. SiteKeyName and Palcement ID will be auto populated in column B, K after the Script finished running

*   **Get Creative IDs** allows you to get the complete list of creative assets for the specified campaign. Profile ID, Advertiser ID and Campaign ID are required!
    1. Add-ons > DCM API > Get All Creatives 
    2. Wait for the Script to finish loading
    3. Creative information will be auto populated in column A, B, C, D after the Script finished running


*   **Assign Creatives** allows you to bulk assign creative IDs to placements as well as assigning a landing page in one go. Profile ID, Advertiser ID and Campaign ID are required!
    1. Add-ons > DCM API > Get Placements
    2. Wait for the Script to finish loading
    3. Placement information will be auto populated in column A:E
    4. Re-order, Filter placements to match the order in the trafficking sheet
    5. Keep only placements that you need to assign creatives for and remove placements that you don’t need by removing the entire row
    6. Paste the Creative Names from the trafficking sheet in column H
    7. Paste the ClickThrough URLs from the trafficking sheet in column J
    8. For Rich media creatives set the value ARTWORK_TYPE_HTML5 in column I
    9. For 1x1 Creatives leave column I blank
    10. Column H is not required
    11. Copy cell A1 from VLOOKUP Cheat sheet
    12. Paste the values from the copied cell into Cell F2 from the Assign Creatives sheet
    13. Remove quotation marks
    14. Drag down cell F2 to fill in the missing cells for CreativeID
    15. Add-ons > DCM API > Bulk Assign Creatives
    16. Wait for the Script to finish loading
    17. QA the set up on the DCM interface



    
