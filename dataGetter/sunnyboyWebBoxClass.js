var request = require('request');

var defaultDataObj = {
    powerNow: "",
    powerNowUnit: "",
    powerToday: "",
    powerTodayUnit: "",
    powerTotal: "",
    powerTotalUnit: ""
}
var defaultSunnyWebBoxIP = "10.50.0.50";

class sunnyWebBox {
    /**
     * Connects to a sunnyboy webbox to read data from Solar Inverter
     * @param {string} IPaddress Ip address of the sunnyweb box (10.50.0.50)
     */
    constructor(IPaddress = defaultSunnyWebBoxIP) {
        this.dtaObj = defaultDataObj;
        this.ipaddress = IPaddress;
    }

    /**
     * request data from the solar inverter and returns a function with the result data in dtaObj.
     * Also sets this.dtaObj to current values.
     * @param {function(errNumber, errTxt, dtaObj)} callbackFunction 
     */
    updateValues(callbackFunction = function (errNumber, errTxt, dtaObj) { console.log(dtaObj); }) {
        getValues(this.dtaObj, this.ipaddress, callbackFunction);
    };

};

function getValues(dataObj, ipAdd = defaultSunnyWebBoxIP, rtnFunction = function (errNumber, errTxt, dtaObj) { console.log(dtaObj); }) {
    var errNumber = 0
    var errTxt = "";
    var RP = JSON.stringify(RPC = {
        "version": "1.0",
        "proc": "GetPlantOverview",
        "id": "1",
        "format": "JSON"
    });
    request.post({
        url: 'http://' + ipAdd + '/rpc',
        body: 'RPC=' + RP
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsonData = JSON.parse(body);
            dataObj.powerNow = jsonData.result.overview[0].value;
            dataObj.powerNowUnit = jsonData.result.overview[0].unit;
            dataObj.powerToday = jsonData.result.overview[1].value;
            dataObj.powerTodayUnit = jsonData.result.overview[1].unit;
            dataObj.powerTotal = jsonData.result.overview[2].value;
            dataObj.powerTotalUnit = jsonData.result.overview[2].unit;

        } else {
            errNumber = 2;
            errTxt = 'ERROR in getInstantValues(), may be a network issue or problem with URL\n\t' + error;
        }
        rtnFunction(errNumber, errTxt, dataObj);
    });
};

module.exports = sunnyWebBox;