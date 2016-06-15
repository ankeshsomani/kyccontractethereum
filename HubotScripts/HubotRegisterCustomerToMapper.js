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
// register <NINUMBER> to <CONTRACT ADDRESS> -registers customer with provided NI number to the contract address  in Mapper Directory.
var common = require("./commonscript.js");
var web3 = common.web3(common.bankNode);

module.exports = function(robot) {
    robot.hear(/(register) (.*?) to (.*?)$/i, function(msg) {



        var customerNiNumber = msg.match[2];
        var customerContractAddress = msg.match[3];
        //var customerNiNumber='NI2';
        //var customerContractAddress='0x0f2f0ffecfffd10c56bea718b71fd1cee3891e26';
        var primary;
        var mapperContractAbi = common.mapperContractAbi;
        var mapperContractAddress = common.mapperContractAddress;
        var nullAddress = common.nullAddress;
        var passwordPrimaryAccount = common.primaryPassword(common.bankNode);
        var custNotFoundMsg = common.customerNotFoundMessage;
        var miningRequiredMsg = common.miningRequiredMessage;
        var mappercontract = web3.eth.contract(mapperContractAbi).at(mapperContractAddress, function(error, result) {
            if (!error) {
                mappercontract = result;
                mappercontract.getCustomerAccountAddress.call(customerNiNumber, function(error, result) {
                    if (!error) {
                        console.log('result 11 is ' + result);
                        var addressBinded = result;
                        if (addressBinded == nullAddress) {

                            web3.eth.getAccounts(function(error, result) {
                                if (!error) {

                                    primary = result[0]
                                    web3.personal.unlockAccount(primary, passwordPrimaryAccount, function(error, result) {
                                        if (!error) {
                                            mappercontract.addCustomer(customerNiNumber, customerContractAddress, {
                                                from: primary,
                                                gas: 300000
                                            }, function(error, result) {
                                                if (!error) {


                                                    var out = "Transaction Address is " + result;
                                                    msg.send(out);
                                                    msg.send(miningRequiredMsg);
                                                    //console.log(out);
                                                    //console.log("Mining is required for processing the above transaction");
                                                } else {
                                                    console.error(error);
                                                }
                                            });

                                        } else {
                                            console.error(error);
                                        }
                                    });
                                } else {
                                    console.error(error);
                                }
                            });
                        } else {
                            msg.send(customerNiNumber + ' is already registered with ' + addressBinded + '.');
                            //	 console.log('NI number is already registered with an address.');
                        }
                    } else {
                        console.error(error);
                    }
                });

            } else {
                console.error(error);
            }
        });

    });
}