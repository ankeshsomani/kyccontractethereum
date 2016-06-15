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
//  check kyc for <NI NUMBER> -check kyc for provided NI NUMBER and returns true or false
var common = require("./commonscript.js");
var web3 = common.web3(common.bankNode);



module.exports = function(robot) {
    robot.hear(/(check kyc) for (.*?)$/i, function(msg) {

        var custContractAddress;

        var primary;
        var customerNiNumber = msg.match[2];
        var mapperContractAbi = common.mapperContractAbi;
        var mapperContractAddress = common.mapperContractAddress;
        var nullAddress = common.nullAddress;
        var passwordPrimaryAccount = common.primaryPassword(common.bankNode);
        var custNotFoundMsg = common.customerNotFoundMessage;
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

                                    primary = result[0];
                                    var custKycContractAbi = common.kycContractAbi;

                                    web3.eth.contract(custKycContractAbi).at(custContractAddress, function(error, result) {
                                        if (!error) {
                                            var kycoperations = result;
                                            web3.personal.unlockAccount(primary, passwordPrimaryAccount, function(error, result) {
                                                if (!error) {
                                                    kycoperations.checkKycDone.call({
                                                        from: primary,
                                                        gas: 300000
                                                    }, function(error, result) {
                                                        if (!error) {
                                                            var out = result + "";
                                                            msg.send(out);


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