// Description:
//  BlockChain script
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   what/which is contract address/address of <NINUMBER>   - returns contract address of customer with given NI Number
var common = require("./commonscript.js");
var web3 = common.web3(common.bankNode);
module.exports = function(robot) {
    robot.hear(/(what|which) is (contract address|address) of (.*?)$/i, function(msg) {
        var customerNiNumber = msg.match[3];
        var mapperContractAbi = common.mapperContractAbi;
        var mapperContractAddress = common.mapperContractAddress;
        var nullAddress = common.nullAddress;
        var custNotFoundMsg = common.customerNotFoundMessage;
        var mappercontract = web3.eth.contract(mapperContractAbi).at(mapperContractAddress, function(error, result) {
            if (!error) {
                mappercontract = result;
                mappercontract.getCustomerAccountAddress.call(customerNiNumber, function(error, result) {
                    if (!error) {
                        if (result == nullAddress) {
                            msg.send(custNotFoundMsg);
                        } else {
                            msg.send(result);
                        }
                    } else {
                        console.error(error);
                    }
                })

            } else {
                console.error(error);
            }
        });

    });
}