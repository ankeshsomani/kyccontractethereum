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
  //   update address of customer <NINUMBER> to <NEWADDRESS>  - returns contract address of customer with given NI Number
  var common = require("./commonscript.js");
  var web3 = common.web3(common.bankNode);
  module.exports = function(robot) {
      robot.hear(/(update address) of customer (.*?) to (.*?)$/i, function(msg) {
          var customerNiNumber = msg.match[2];
          var newAddress = msg.match[3];
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
                          if (result == nullAddress) {
                              msg.send(custNotFoundMsg);
                          } else {
                              var customerContractAddress = result;
                              web3.eth.getAccounts(function(error, result) {
                                  if (!error) {
                                      var custKycContractAbi = common.kycContractAbi;
                                      primary = result[0]
                                      web3.eth.contract(custKycContractAbi).at(customerContractAddress, function(error, result) {
                                          if (!error) {
                                              var kycoperations = result;
                                              web3.personal.unlockAccount(primary, passwordPrimaryAccount, function(error, result) {
                                                  if (!error) {
                                                      kycoperations.changeAddress(newAddress, {
                                                          from: primary,
                                                          gas: 300000
                                                      }, function(error, result) {
                                                          if (!error) {
                                                              var out = "Transaction Address is " + result;
                                                              msg.send(out);
                                                              msg.send(miningRequiredMsg);

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

                                  } else {}
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
          //msg.send(customerNiNumber);
      });
  }