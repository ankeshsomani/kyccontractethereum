contract BankDirectoryContract{
    
    mapping (bytes32 => Bank) public  banks;
    mapping (uint => bytes32) public  bankIndex;
    uint bankCount;
       struct Bank{
         bytes32 bankName;
         address bankAddress;
         bytes32 bicCode;
    }
    function addBank(bytes32 bicCode,address bankAddress,bytes32 bankName){
      Bank bank= banks[bicCode];
      bank.bankAddress=bankAddress;
      bank.bankName=bankName;
      bank.bicCode=bicCode;
      bankIndex[bankCount]=bicCode;
      bankCount++;
    }
    function getAllBanks() constant
    returns (bytes32[] banks ){
         banks = new bytes32[](bankCount);
         for(uint i=0;i<bankCount;i++)
        {
           banks[i]=bankIndex[i];
        }
    }
    function removeBank(bytes32 bicCode1) returns(bool){
        if(banks[bicCode1].bicCode==bicCode1){
           
            for(uint i=0;i<bankCount;i++)
            {
               if(bankIndex[i]==bicCode1){
                   delete bankIndex[i];
                   break;
               }
            }
            bankCount=bankCount-1;
             delete banks[bicCode1];
        }
        return true;
    }
    function getBankInfo(bytes32 bicCode1) returns (bytes32 bankName,bytes32 bicCode,
         address bankAddress){
        Bank bank= banks[bicCode1];
        bankName=bank.bankName;
        bicCode=bank.bicCode;
        bankAddress=bank.bankAddress;
    }
    function getBankAccountAddress(bytes32 bicCode) returns (address addr){
        addr=banks[bicCode].bankAddress;
    }
    
}