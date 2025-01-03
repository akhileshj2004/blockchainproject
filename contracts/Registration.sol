// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Registration {
    struct User {
        string name;
        string srn;
        string email;
        bool isRegistered;
    }

    mapping(address => User) public users;

    constructor() {} // Empty constructor

    event UserRegistered(address userAddress);
    event OtpGenerated(address userAddress);
    event OtpVerified(address userAddress);

    function registerUser(string memory _name, string memory _srn, string memory _email) public {
        require(!users[msg.sender].isRegistered, "User already registered");
        users[msg.sender] = User(_name, _srn, _email, true);
        emit UserRegistered(msg.sender);
    }

    function generateOtp(address user, string memory _otpHash) public {
        require(users[user].isRegistered, "User not registered");
        require(!users[user].otpVerified, "User already verified");
        users[user].otpHash = _otpHash;
        emit OtpGenerated(user);
    }

    function verifyOtp(address user, string memory _otp) public {
        require(users[user].isRegistered, "User not registered");
        require(!users[user].otpVerified, "Already verified");
        require(keccak256(abi.encodePacked(_otp)) == keccak256(abi.encodePacked(users[user].otpHash)), "Invalid OTP");
        users[user].otpVerified = true;
        emit OtpVerified(user);
    }
}