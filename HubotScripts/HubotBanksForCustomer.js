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
//  banks associated/banks for <NI NUMBER> -returns bank information of customer with provided NI Number
var common = require("./commonscript.js");
var web3 = common.web3(common.bankNode);

module.exports = function(robot) {
    robot.hear(/(banks associated|banks) for (.*?)$/i, function(msg) {
        var custContractAddress;
        var mapperContractAbi = common.mapperContractAbi;
        var mapperContractAddress = common.mapperContractAddress;
        var nullAddress = common.nullAddress;
        var passwordPrimaryAccount = common.primaryPassword(common.bankNode);
        var custNotFoundMsg = common.customerNotFoundMessage;
        var primary;
        var customerNiNumber = msg.match[2];
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

                                    primary = result[0]
                                    var custKycContractAbi = common.kycContractAbi;
                                    web3.eth.contract(custKycContractAbi).at(custContractAddress, function(error, result) {
                                        if (!error) {
                                            var kycoperations = result;
                                            web3.personal.unlockAccount(primary, passwordPrimaryAccount, function(error, result) {
                                                if (!error) {
                                                    kycoperations.getAllBanksAssociatedWithCustomer.call({
                                                        from: primary,
                                                        gas: 300000
                                                    }, function(error, result) {
                                                        if (!error) {

                                                            var ar = result;
                                                            for (var x = 0; x < ar.length; x++) {
                                                                var branchCode = web3.toAscii(ar[x]).replace(/\u0000/g, '');
                                                                kycoperations.getKycStatusOfCustomerForBank.call(branchCode, {
                                                                    from: primary,
                                                                    gas: 300000
                                                                }, function(error, result) {
                                                                    if (!error) {
                                                                        var out = "";
                                                                        var ar2 = result;


                                                                        out = common.constructBankDetailsForCustomer(ar2,web3);
                                                                        msg.send("\n" + out + "\n");
                                                                    } else {
                                                                        console.error(error);
                                                                    }

                                                                });


                                                            }


                                                        } else {
                                                            console.error(error);
                                                        }
                                                    });

                                                } else {
                                                    console.error(error);
                                                }
                                            });


                                            // msg.send(result);
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