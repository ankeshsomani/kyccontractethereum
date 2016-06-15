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
//   bank address of <BICCODE>   - returns ethereum address of bank with given BIC Code
var common = require("./commonscript.js");
var web3 = common.web3(common.bankNode);

module.exports = function(robot) {
    robot.hear(/(bank address) of (.*?)$/i, function(msg) {
        var bicCode = msg.match[2];
        var bankContractAbi = common.bankContractAbi;
        var bankContractAddress = common.bankContractAddress;

        web3.eth.contract(bankContractAbi).at(bankContractAddress, function(error, result) {
            if (!error) {
                var bankContract = result;
                bankContract.getBankAccountAddress.call(bicCode, function(error, result) {
                    if (!error) {

                        msg.send(result);
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