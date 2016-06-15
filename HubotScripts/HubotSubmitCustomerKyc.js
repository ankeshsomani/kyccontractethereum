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
//  submit customer kyc for <NI NUMBER> -submits kyc from  customer side  for provided NI NUMBER
var common = require("./commonscript.js");
var web3 = common.web3(common.bankNode);

module.exports = function(robot) {
    robot.hear(/(submit) (customer kyc) for (.*?)$/i, function(msg) {

        var custContractAddress;
        
        var primary;
        var customerNiNumber = msg.match[3];
        var mapperContractAbi = common.mapperContractAbi;
        var mapperContractAddress = common.mapperContractAddress;
        var nullAddress = common.nullAddress;
        var passwordPrimaryAccount = common.primaryPassword(common.bankNode);
        var custNotFoundMsg = common.customerNotFoundMessage;
        var miningRequiredMessage = common.miningRequiredMessage;
        var mappercontract = web3.eth.contract(mapperContractAbi).at(mapperContractAddress, function(error, result) {
            if (!error) {
                mappercontract = result;
                mappercontract.getCustomerAccountAddress.call(customerNiNumber, function(error, result) {
                    if (!error) {
                        if (result == nullAddress) {
                            msg.send(custNotFoundMsg);
                        } else {
                            custContractAddress = result;

                            web3.eth.getAccounts(function(error, result) {
                                if (!error) {
                                    var custKycContractAbi = common.kycContractAbi;
                                    primary = result[0]
                                    web3.eth.contract(custKycContractAbi).at(custContractAddress, function(error, result) {
                                        if (!error) {
                                            var kycoperations = result;
                                            web3.personal.unlockAccount(primary, passwordPrimaryAccount, function(error, result) {
                                                if (!error) {
                                                    kycoperations.kycCompletedByCustomer({
                                                        from: primary,
                                                        gas: 300000
                                                    }, function(error, result) {
                                                        if (!error) {
                                                            var out = "Transaction Address is " + result;
                                                            msg.send(out);
                                                            msg.send(miningRequiredMessage);

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
                                    console.error(error);
                                }
                            });




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