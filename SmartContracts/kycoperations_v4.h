contract KycOperations{
  
struct Customer{
    
      //NI number of the customer
        bytes32  niNumber;
        //Holds true if kyc done otherwise false
        bool  kycCompletedByCustomer;
        //Holds driving license number
        bytes32 drivingLicenseNumber;
        //holds electricity bill number
        bytes32 electricityBillNumber;
        
        uint validDateFrom;
        
        bool kycCompletedByBank;
        
        bytes32 phoneNumber;
      
        bytes32 custAddress;
        bytes32 emailAddress;
    }
    struct Bank{
         bytes32 bankName;
         uint acceptedDate;
         bytes32 bicCode;
         address bankAddress;
         bool kycCompletedByBank;
    }
   // address banker;
    Customer c;
    mapping (bytes32 => Bank) public  banksParticipated;
    mapping (uint => bytes32) public  banksIndex;
    uint bankCount;
    function KycOperations (bytes32  paramNiNumber,bytes32 paramDrivingLicenseNumber,
    bytes32 paramElectricityBillNumber,bytes32 custAddress,bytes32 phoneNumber,
    bytes32 emailAddress) public{
        
       // banker=msg.sender;
        //Assigns reference
      
        c.niNumber=paramNiNumber;
        c.drivingLicenseNumber=paramDrivingLicenseNumber;
        c.electricityBillNumber=paramElectricityBillNumber;
        c.custAddress=custAddress;
        c.kycCompletedByCustomer=false;
        c.kycCompletedByBank=false;
        c.phoneNumber=phoneNumber;
        c.emailAddress=emailAddress;
       // c.banksParticipated
       
    }
    
    function  getCustomerKycInfo() returns(bytes32  paramNiNumber,bytes32 paramDrivingLicenseNumber,
    bytes32 paramElectricityBillNumber,bytes32 custAddress,bytes32 phoneNumber,bool kycCompletedByCustomer,
    bool kycCompletedByBank,
    bytes32 emailAddress,uint validDateFrom){
        paramNiNumber=c.niNumber;
        paramDrivingLicenseNumber=c.drivingLicenseNumber;
        custAddress=c.custAddress;
        paramElectricityBillNumber=c.electricityBillNumber;
        phoneNumber=c.phoneNumber;
        kycCompletedByCustomer=c.kycCompletedByCustomer;
        kycCompletedByBank=c.kycCompletedByBank;
        emailAddress=c.emailAddress;
        validDateFrom=c.validDateFrom;
    }
    
    function getKycStatusOfCustomerForBank(bytes32 bicCode) 
    returns (bytes32 bankName,bytes32 bicCode1,address bankAddr,bool kycCompletedByBank,uint acceptedDate){
        Bank b=banksParticipated[bicCode];
        bankName=b.bankName;
        bicCode1=b.bicCode;
        bankAddr=b.bankAddress;
        kycCompletedByBank=b.kycCompletedByBank;
        acceptedDate=b.acceptedDate;
    }
        function getAllBanksAssociatedWithCustomer() constant
    returns (bytes32[] banks ){
         banks = new bytes32[](bankCount);
         for(uint i=0;i<bankCount;i++)
        {
           banks[i]=banksIndex[i];
        }
    }
    
 
    function kycCompletedByCustomer() returns (bool){
             c.kycCompletedByCustomer=true;
           //  kycCompleted("kyc completed for customer");
            return true;
     
    }
    function kycCompletedByBank(bytes32 bicCode,bytes32 bankName) returns (bool){
            if(c.kycCompletedByCustomer==true){
                
                  if(banksParticipated[bicCode].bicCode==bicCode){
                      Bank b=banksParticipated[bicCode];
                      b.kycCompletedByBank=true;
                      b.acceptedDate=now;
                      
                  }
                  else{
                        Bank b2= banksParticipated[bicCode];
                        b2.bicCode=bicCode;
                        b2.bankName=bankName;
                        b2.kycCompletedByBank=true;
                        b2.acceptedDate=now;
                        b2.bankAddress=msg.sender;
                      banksIndex[bankCount]=b2.bicCode;
                      bankCount++;
                  }

                c.kycCompletedByBank=true;
                c.validDateFrom=now;
                      
                return true;
            }
            else{
                return false;
            }

    }
    function   updateKycStatusForAllBanks(bool status) returns (bool){
        for(uint i=0;i<bankCount;i++)
        {
            Bank b=banksParticipated[banksIndex[i]];
           b.kycCompletedByBank=false;
        }
    }
    function changeAddress(bytes32 paramAddress)  returns (bool){
        c.custAddress=paramAddress;
        updateKycStatusForAllBanks(false);
        c.kycCompletedByBank=false;
        c.kycCompletedByCustomer=false;
        return true;
        
    }
    
     function changePhoneNumber(bytes32 paramPhoneNumber)  returns (bool){
        c.phoneNumber=paramPhoneNumber;
         updateKycStatusForAllBanks(false);
          c.kycCompletedByBank=false;
          c.kycCompletedByCustomer=false;
        return true;
        
    }
    
    function  checkKycDone() returns (bool){
        bool result=c.kycCompletedByBank && c.kycCompletedByCustomer;
        return result;
    }
    
}