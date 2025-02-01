// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LandRegistry {
    struct Land {
        uint id;
        address owner;
        string location;
        uint price;
        bool isForSale;
    }

    mapping(uint => Land) public lands;
    mapping(address => uint[]) public ownerLands;
    uint public landCount = 0;

    event LandRegistered(uint id, address owner, string location, uint price);
    event OwnershipTransferred(uint id, address previousOwner, address newOwner);
    event LandListedForSale(uint id, uint price);
    event LandSaleCanceled(uint id);

    modifier onlyOwner(uint _id) {
        require(lands[_id].owner == msg.sender, "Not the owner");
        _;
    }

    function registerLand(string memory _location, uint _price) public {
        landCount++;
        lands[landCount] = Land(landCount, msg.sender, _location, _price, false);
        ownerLands[msg.sender].push(landCount);
        emit LandRegistered(landCount, msg.sender, _location, _price);
    }

    function listLandForSale(uint _id, uint _price) public onlyOwner(_id) {
        lands[_id].isForSale = true;
        lands[_id].price = _price;
        emit LandListedForSale(_id, _price);
    }

    function cancelLandSale(uint _id) public onlyOwner(_id) {
        lands[_id].isForSale = false;
        emit LandSaleCanceled(_id);
    }

    function transferOwnership(uint _id, address _newOwner) public payable {
        require(lands[_id].isForSale, "Land not for sale");
        require(msg.value >= lands[_id].price, "Insufficient payment");

        address previousOwner = lands[_id].owner;
        lands[_id].owner = _newOwner;
        lands[_id].isForSale = false;

        payable(previousOwner).transfer(msg.value);
        emit OwnershipTransferred(_id, previousOwner, _newOwner);
    }

    function getLandsByOwner(address _owner) public view returns (uint[] memory) {
        return ownerLands[_owner];
    }
}
