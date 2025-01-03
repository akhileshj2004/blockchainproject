let web3;
let contract;
let userAddress;

// Replace with your deployed contract address
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const contractABI = [
    // Add your contract ABI here
];

async function init() {
    try {
        if (typeof window.ethereum !== 'undefined') {
            web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAddress = (await web3.eth.getAccounts())[0];
            contract = new web3.eth.Contract(contractABI, contractAddress);
        } else {
            throw new Error("Please install MetaMask");
        }
    } catch (error) {
        console.error("Initialization error:", error);
        document.getElementById("status").innerText = error.message;
    }
}

async function submitRegistration() {
    try {
        const name = document.getElementById("name").value;
        const srn = document.getElementById("srn").value;
        const email = document.getElementById("email").value;

        await contract.methods.registerUser(name, srn, email)
            .send({ from: userAddress });

        const otp = generateOtp();
        const otpHash = web3.utils.sha3(otp);
        await contract.methods.generateOtp(userAddress, otpHash)
            .send({ from: userAddress });

        // Store OTP temporarily (in production, send via email)
        sessionStorage.setItem('currentOtp', otp);

        document.getElementById("status").innerText = "OTP generated. Please verify.";
        document.getElementById("otpForm").style.display = "block";
    } catch (error) {
        console.error("Registration error:", error);
        document.getElementById("status").innerText = error.message;
    }
}

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function verifyOtp() {
    try {
        const otp = document.getElementById("otp").value;
        await contract.methods.verifyOtp(userAddress, otp)
            .send({ from: userAddress });

        document.getElementById("status").innerText = "Registration verified successfully!";
        document.getElementById("otpForm").style.display = "none";
        sessionStorage.removeItem('currentOtp');
    } catch (error) {
        console.error("Verification error:", error);
        document.getElementById("status").innerText = error.message;
    }
}

window.onload = init;