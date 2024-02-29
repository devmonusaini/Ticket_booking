var accounts = null;
var provider = null;
var myContract = null;
var signer = null;
var price = null;
var walletConnect = false;
var ABI;
var test;
var isAdmin = false;
const ContractAddress = "0x4aBE44351ed9d1efC1F26509240eb988BA1D1ac8";
// const ContractAddress = "0xaB2F4375c05806d2afB122DecC90f98792cd6C66";

fetch("./abi.json")
	.then((response) => response.json())
	.then((data) => {
		// Use the parsed JSON data
		ABI = data;
		console.log(data);
	})
	.catch((error) => {
		// Handle any errors that occur during the fetch request
		console.error("Error in ABI loading :", error);
	});

// Get today's date in the format YYYY-MM-DD
let today = new Date().toISOString().split("T")[0];
// Set the minimum date for the input element
document.getElementById("dateInput").setAttribute("min", today);

document.getElementById("customerMenu").style.display = "none";
document.getElementById("adminMenu").style.display = "none";

document.addEventListener("DOMContentLoaded", async function () {
	console.log("Connect started");
	if (window.ethereum) {
		if (window.ethereum.isMetaMask || window.ethereum.isTrust) {
			try {
				provider = new ethers.providers.Web3Provider(window.ethereum);
				let accounts = await provider.send("eth_requestAccounts", []);
				signer = provider.getSigner();
				accounts = accounts[0];
				console.log("account : ", accounts, typeof accounts);

				myContract = new ethers.Contract(ContractAddress, ABI, signer);
				let totalTickets = await myContract.totalTickets();
				let ownerAddress = await myContract.owner();
				console.log("owner : ", accounts, ownerAddress);
				if (accounts.toLowerCase() === ownerAddress.toLowerCase()) {
					isAdmin = true;
					console.log("Caller is Owner");
				} else {
					isAdmin = false;
					console.log("Caller is not Owner");
				}
				console.log("totalTickets : ", totalTickets);
				document.getElementById("totalTickets1").innerText = totalTickets;
				document.getElementById("totalTickets2").innerText = totalTickets;

				price = await myContract.PRICE();
				document.getElementById("price").innerText = price / 10 ** 18;

				// document.getElementById("userAddress").innerText = accounts[0];
				// document.getElementById("balance").innerText =
				(await signer.getBalance()) / 10 ** 18;
			} catch (error) {
				console.error("Error with MetaMask or Trust Wallet:", error);
			}
		} else {
			alert("Please select a location to download");
			// location.replace("https://metamask.io/download/");
		}
	} else {
		alert("Please install MetaMask");
		// location.replace("https://metamask.io/download/");
	}
});

// Login page login here
document.getElementById("login").addEventListener("click", async function () {
	await signMessage();
	if (isAdmin) {
		document.getElementById("loginMenu").style.display = "none";
		document.getElementById("adminMenu").style.display = "block";
	} else {
		document.getElementById("loginMenu").style.display = "none";
		document.getElementById("customerMenu").style.display = "block";
	}
	walletConnect = true;
});

// Logout for Admin
document
	.getElementById("admin-logout")
	.addEventListener("click", async function () {
		document.getElementById("adminMenu").style.display = "none";
		document.getElementById("customerMenu").style.display = "none";
		document.getElementById("loginMenu").style.display = "block";
	});

// Logout for Customer
document
	.getElementById("customer-logout")
	.addEventListener("click", async function () {
		document.getElementById("adminMenu").style.display = "none";
		document.getElementById("customerMenu").style.display = "none";
		document.getElementById("loginMenu").style.display = "block";
	});

// Admin Function start from here ****************************
// Assign Seat Number Login Here
document
	.getElementById("assignSeatButton")
	.addEventListener("click", async function () {
		try {
			// Get the input values
			const ticketNumber = document.getElementById(
				"assignSeatTicketNoInput"
			).value;
			const seatNumber = document.getElementById("assignSeatNoInput").value;

			if (ticketNumber && seatNumber) {
				const tx = await myContract.assignSeatNumber(ticketNumber, seatNumber);
				// Wait for the transaction to be confirmed
				await tx.wait();
				// Display a success message
				alert("Assign Seat Successfully!");
			} else {
				alert("Invalid data!");
			}
		} catch (error) {
			const e = extractExecutionRevertedMessage(error.toString());
			if (e) {
				alert(e);
				return;
			}
			// Display an error message if the transaction fails
			console.error("Error assign seat:", error);
			alert(error.toString());
			if (error.data.message) {
				alert(error.data.message);
			} else {
				alert(error);
			}
		}
	});

document
	.getElementById("assignSpaceshipButton")
	.addEventListener("click", async function () {
		try {
			const ticketNumber = document.getElementById(
				"assignSpaceshipTicketNoInput"
			).value;
			const assignSpaceshipNoInput = document.getElementById(
				"assignSpaceshipNoInput"
			).value;
			// alert("assignSpaceshipButton Clicked!", ticketNumber);
			if (ticketNumber && assignSpaceshipNoInput) {
				const tx = await myContract.assignSpaceshipNumber(
					ticketNumber,
					assignSpaceshipNoInput
				);
				// Wait for the transaction to be confirmed
				await tx.wait();
				// Display a success message
				alert("Assign Spaceship Successfully!");
			} else {
				alert("Invalid data!");
			}
		} catch (error) {
			const e = extractExecutionRevertedMessage(error.toString());
			if (e) {
				alert(e);
				return;
			}
			console.error("Error assign spaceship:", error);
			alert(error.toString());
			if (error.data.message) {
				alert(error.data.message);
			} else {
				alert(error);
			}
		}
	});

// transferOwnership functionality
document
	.getElementById("transferOwnershipButton")
	.addEventListener("click", async function () {
		try {
			const data = document.getElementById("transferOwnershipInput").value;
			if (data) {
				if (confirm("Do you want to transfer ownership!")) {
					const tx = await myContract.transferOwnership(data);
					// Wait for the transaction to be confirmed
					await tx.wait();
					// Display a success message
					alert("Ownership transfer Successfully!");
				} else {
					alert("Transfer Ownership Reverted!");
				}
			} else {
				alert("Invalid data!");
			}
		} catch (error) {
			const e = extractExecutionRevertedMessage(error.toString());
			if (e) {
				alert(e);
				return;
			}
			console.error("Error assign spaceship:", error);
			alert(error.toString());
			if (error.data.message) {
				alert(error.data.message);
			} else {
				alert(error);
			}
		}
	});

document.addEventListener("DOMContentLoaded", () => {
	const getDetailsButton = document.getElementById("getDetailsButton1");
	getDetailsButton.addEventListener("click", async () => {
		try {
			const ticketNumber = document.getElementById("ticketNoInput1").value;
			if (!ticketNumber) {
				alert("Enter a valid ticket number");
				return;
			}

			// Assume myContract is your instantiated ethers.js contract instance
			const ticketDetails = await myContract.getTicketDetails(ticketNumber);
			console.log("Ticket Details:", ticketDetails[0]);
			// Update your UI or perform any other actions with the ticket details

			const inputText = ticketDetails[0];
			const firstFourChars = inputText.substring(0, 4);
			const lastFourChars = inputText.substring(inputText.length - 8);
			const result = `${firstFourChars}...${lastFourChars}`;
			console.log(result); // Output: 0xdFF3...A6Cf

			document.getElementById("user-address1").innerText = result;
			document.getElementById("user-name1").innerText = ticketDetails[1];
			document.getElementById("user-age1").innerText = ticketDetails[2];
			document.getElementById("user-gender1").innerText = ticketDetails[3];
			document.getElementById("user-country1").innerText = ticketDetails[4];
			document.getElementById("user-price1").innerText = "4,50,000 USD";
			// ticketDetails[5] / 10 ** 18 + " ETH";

			// Convert to milliseconds by multiplying by 1000
			const epochMilliseconds = ticketDetails[6] * 1000;

			// Create a new Date object with the epochMilliseconds
			const date = new Date(epochMilliseconds);

			// Format the date as you want (e.g., "YYYY-MM-DD HH:MM:SS")
			const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
				.toString()
				.padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
			console.log("formattedDate : ", formattedDate);
			document.getElementById("user-date1").innerText = formattedDate;
			document.getElementById("user-duration1").innerText = ticketDetails[7];
			document.getElementById("user-seat-number1").innerText = ticketDetails[8];
			document.getElementById("user-spaceship1").innerText = ticketDetails[9];
		} catch (error) {
			const e = extractExecutionRevertedMessage(error.toString());
			if (e) {
				alert(e);
				return;
			}
			console.error("Error getting ticket details:", error);
			console.log("E : ", error);
			alert(error.toString());
			test = error;
			// Handle errors
			if (error.data.message) {
				alert(error.data.message);
			} else {
				alert(error);
			}
		}
	});
});
// Admin Function end here ****************************

// Customer Functions start from here ****************************
// Book Now functionality
document.getElementById("bookNow").addEventListener("click", async function () {
	try {
		// Get the input values
		const username = document.getElementById("usernameInput").value;
		const age = document.getElementById("ageInput").value;
		const gender = document.getElementById("genderSelect").value;
		const country = document.getElementById("countrySelect").value;
		const date = document.getElementById("dateInput").value;
		const epochTime = Date.parse(date) / 1000; // Convert milliseconds to seconds

		if (username && age && gender && country && epochTime) {
			console.log(username, age, gender, country, epochTime);

			// Call the bookTicket function of your smart contract
			// const valueInWei = ethers.utils.parseEther();
			const tx = await myContract.bookTicket(
				username,
				age,
				gender,
				country,
				epochTime,
				{
					value: await myContract.PRICE(),
				}
			);

			// Wait for the transaction to be confirmed
			await tx.wait();

			// Display a success message
			alert("Ticket booked successfully!");
			let totalTickets = await myContract.totalTickets();
			document.getElementById("totalTickets1").innerText = totalTickets;
			document.getElementById("totalTickets2").innerText = totalTickets;
		} else {
			alert("Invalid data!");
		}
	} catch (error) {
		// Display an error message if the transaction fails
		console.error("Error booking ticket:", error);
		alert(error.toString());
		if (error.data.message) {
			alert(error.data.message);
		} else {
			alert(error);
		}
	}
});

document.addEventListener("DOMContentLoaded", () => {
	const getDetailsButton = document.getElementById("getDetailsButton2");
	getDetailsButton.addEventListener("click", async () => {
		try {
			const ticketNumber = document.getElementById("ticketNoInput2").value;
			if (!ticketNumber) {
				alert("Enter a valid ticket number");
				return;
			}

			// Assume myContract is your instantiated ethers.js contract instance
			const ticketDetails = await myContract.getTicketDetails(ticketNumber);
			console.log("Ticket Details:", ticketDetails[0]);
			// Update your UI or perform any other actions with the ticket details

			const inputText = ticketDetails[0];
			const firstFourChars = inputText.substring(0, 4);
			const lastFourChars = inputText.substring(inputText.length - 8);
			const result = `${firstFourChars}...${lastFourChars}`;
			console.log(result); // Output: 0xdFF3...A6Cf

			document.getElementById("user-address2").innerText = result;
			document.getElementById("user-name2").innerText = ticketDetails[1];
			document.getElementById("user-age2").innerText = ticketDetails[2];
			document.getElementById("user-gender2").innerText = ticketDetails[3];
			document.getElementById("user-country2").innerText = ticketDetails[4];
			document.getElementById("user-price2").innerText = "4,50,000 USD";
			// ticketDetails[5] / 10 ** 18 + " ETH";

			// Convert to milliseconds by multiplying by 1000
			const epochMilliseconds = ticketDetails[6] * 1000;

			// Create a new Date object with the epochMilliseconds
			const date = new Date(epochMilliseconds);

			// Format the date as you want (e.g., "YYYY-MM-DD HH:MM:SS")
			const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
				.toString()
				.padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
			console.log("formattedDate : ", formattedDate);
			document.getElementById("user-date2").innerText = formattedDate;
			document.getElementById("user-duration2").innerText = ticketDetails[7];
			document.getElementById("user-seat-number2").innerText = ticketDetails[8];
			document.getElementById("user-spaceship2").innerText = ticketDetails[9];
		} catch (error) {
			const e = extractExecutionRevertedMessage(error.toString());
			if (e) {
				alert(e);
				return;
			}
			console.error("Error getting ticket details:", error);
			console.log("E : ", error);
			alert(error.toString());
			test = error;
			// Handle errors
			if (error.data.message) {
				alert(error.data.message);
			} else {
				alert(error);
			}
		}
	});
});

// Check User Balance Function
document
	.getElementById("checkBalanceButton")
	.addEventListener("click", async function () {
		try {
			let inputAddress = document.getElementById("newWalletInput").value;
			if (!inputAddress) {
				alert("Enter a valid wallet address");
				return;
			}
			// Call the balanceOf function of your smart contract
			let balance = await provider.getBalance(inputAddress);
			// return ethers.utils.formatEther(balance);
			console.log("Balance:", balance.toString());
			document.getElementById("userBalance").innerText =
				"User Balance : " +
				ethers.utils.formatEther(balance).toString() +
				" ETH";
		} catch (error) {
			const e = extractExecutionRevertedMessage(error.toString());
			if (e) {
				alert(e);
				return;
			}
			console.error("Error getting ticket details:", error);
			console.log("E : ", error);
			alert(error.toString());
			test = error;
			// Handle errors
			if (error.data.message) {
				alert(error.data.message);
			} else {
				alert(error);
			}
		}
	});

function extractExecutionRevertedMessage(errorMessage) {
	const regex = /execution reverted: ([^,]+),\"data\":{\"originalError\"/;
	const match = errorMessage.match(regex);
	if (match) {
		const messageWithQuotes = match[1];
		const messageWithoutQuotes = messageWithQuotes.replace(/"/g, "");
		return messageWithoutQuotes;
	}
	return null;
}

async function signMessage() {
	try {
		// Sign the message using the signer
		const signature = await signer.signMessage("Login!");
		// Output the signature
		console.log("Signature:", signature);
	} catch (error) {
		console.error("Error signing message:", error);
	}
}

// Function to handle account change event
async function handleAccountsChanged(accounts) {
	if (accounts.length > 0) {
		const newAddress = accounts[0];
		console.log("New wallet address:", newAddress);

		document.getElementById("customerMenu").style.display = "none";
		document.getElementById("adminMenu").style.display = "none";
		document.getElementById("loginMenu").style.display = "block";

		if (window.ethereum.isMetaMask || window.ethereum.isTrust) {
			try {
				provider = new ethers.providers.Web3Provider(window.ethereum);
				let accounts = await provider.send("eth_requestAccounts", []);
				signer = provider.getSigner();
				accounts = accounts[0];
				console.log("account : ", accounts, typeof accounts);

				myContract = new ethers.Contract(ContractAddress, ABI, signer);
				let totalTickets = await myContract.totalTickets();
				let ownerAddress = await myContract.owner();
				console.log("owner : ", accounts, ownerAddress);
				if (accounts.toLowerCase() === ownerAddress.toLowerCase()) {
					isAdmin = true;
					console.log("Caller is Owner");
				} else {
					isAdmin = false;
					console.log("Caller is not Owner");
				}
				console.log("totalTickets : ", totalTickets);
				document.getElementById("totalTickets1").innerText = totalTickets;
				document.getElementById("totalTickets2").innerText = totalTickets;

				price = await myContract.PRICE();
				document.getElementById("price").innerText = price / 10 ** 18;

				// document.getElementById("userAddress").innerText = accounts[0];
				// document.getElementById("balance").innerText =
				(await signer.getBalance()) / 10 ** 18;
			} catch (error) {
				console.error("Error with MetaMask or Trust Wallet:", error);
			}
		} else {
			alert("Please select a location to download");
			// location.replace("https://metamask.io/download/");
		}
	} else {
		console.log("Wallet disconnected");
		// Handle wallet disconnect event
	}
}

// Listen for MetaMask account change events
window.ethereum.on("accountsChanged", handleAccountsChanged);
