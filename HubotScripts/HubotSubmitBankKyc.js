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
//  submit bank kyc for <NI NUMBER> from <BANKBICCODE> <BANK ETHEREUM ACCOUNT PASSWORD>-submits kyc from  bank side  for provided NI number and bank BIC Code
var common = require("./commonscript.js");
var web3 = common.web3(common.bankNode);


module.exports = function(robot) {
    robot.hear(/(submit bank kyc for )(.*?) from (.*?) (.*?)$/i, function(msg) {
        var customerNiNumber = msg.match[2];
        var bankBicCode = msg.match[3];
        var bankPassword = msg.match[4];
        var primary;

        var mapperContractAbi = common.mapperContractAbi;
        var mapperContractAddress = common.mapperContractAddress;
        var nullAddress = common.nullAddress;
        var passwordPrimaryAccount = common.primaryPassword(common.bankNode);
        var custNotFoundMsg = common.customerNotFoundMessage;
        var miningReqdMsg = common.miningRequiredMessage;
        var mappercontract = web3.eth.contract(mapperContractAbi).at(mapperContractAddress, function(error, result) {
            if (!error) {
                mappercontract = result;
                mappercontract.getCustomerAccountAddress.call(customerNiNumber, function(error, result) {
                    if (!error) {
                        if (result == nullAddress) {

                            msg.send(custNotFoundMsg);
                        } else {
                            var custContractAddress = result;

                            web3.eth.getAccounts(function(error, result) {
                                if (!error) {

                                    primary = result[0]
                                    var bankContractAbi = common.bankContractAbi;
                                    var bankDirectoryContractAddress = common.bankContractAddress;
                                    web3.eth.contract(bankContractAbi).at(bankDirectoryContractAddress, function(error, result) {
                                        if (!error) {
                                            var bankdirectorycontract = result;
                                            var bankNotFoundMsg = common.bankNotFoundMsg;
                                            bankdirectorycontract.getBankInfo.call(bankBicCode, function(error, result) {
                                                if (!error) {
                                                   
                                                    if (result[1] == '0x0000000000000000000000000000000000000000000000000000000000000000') {
                                                        msg.send(bankNotFoundMsg);
                                                    } else {
                                                        var bankName = web3.toAscii(result[0]).replace(/\u0000/g, '');
                                                        var bankAddress = result[2];
                                                        var custKycContractAbi = common.kycContractAbi;
                                                        web3.eth.contract(custKycContractAbi).at(custContractAddress, function(error, result) {
                                                            if (!error) {
                                                                var kycoperations = result;
                                                                web3.personal.unlockAccount(bankAddress, bankPassword, function(error, result) {
                                                                    if (!error) {
                                                                        kycoperations.kycCompletedByBank(bankBicCode, bankName, {
                                                                            from: bankAddress,
                                                                            gas: 300000
                                                                        }, function(error, result) {
                                                                            if (!error) {
                                                                                var out = "Transaction Address is " + result;
                                                                                msg.send(out);
                                                                                msg.send(miningReqdMsg);


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