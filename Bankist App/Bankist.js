'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data



const account1 = {
	owner: 'Mike Brown',
	movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
	interestRate: 1.2, // %
	pin: 1111,

	movementsDates: [
		'2019-11-18T21:31:17.178Z',
		'2019-12-23T07:42:02.383Z',
		'2020-01-28T09:15:04.904Z',
		'2020-04-01T10:17:24.185Z',
		'2020-05-08T14:11:59.604Z',
		'2020-05-27T17:01:17.194Z',
		'2020-07-11T23:36:17.929Z',
		'2020-07-12T10:51:36.790Z',
	],
	currency: 'GBP',
	locale: 'en-GB', // de-DE
};

const account2 = {
	owner: 'Jessica Davis',
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,

	movementsDates: [
		'2020-11-01T13:15:33.035Z',
		'2020-11-30T09:48:16.867Z',
		'2020-12-25T06:04:23.907Z',
		'2022-01-25T14:18:46.235Z',
		'2022-02-04T16:33:06.386Z',
		'2022-02-05T14:43:26.374Z',
		'2022-02-06T18:49:59.371Z',
		'2022-02-07T12:01:20.894Z',
	],
	currency: 'USD',
	locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

// so here, we are looping over the movements. And so at the same time, basically we also need to loop over the movement dates,  we already have the index here. And so what we can do is to write  acc.movementsDates and then we take it at position i. So that is the current index in the movements array. And the same index is then gonna point to the equivalent date in this movements date array. So we called it for each method on one of them. So that's the movements. And then we use the current index to also get the data from some other array. we later on call this function in the displaymovement function.

function formatMovementDate(date, locale) {
	// so in this function here we create the functionality for converting timestamps to days. because when we add or substract or do any form of operation for time it returns its timestamp and then so convert that to days we use the formula.
	function calcDaysPassed(dates1, dates2) {
		return Math.round(Math.abs((dates2 - dates1) / (1000 * 60 * 60 * 24))); // formula for converting timestamp to days
	}
	// here we create a variable called dayspassed and we assign it to a call back function of the calcdayspassed function and in this we pass the new Date method and the date which is accesing the dates of the movementDte array.
	const dayspassed = calcDaysPassed(new Date(), date);
	console.log(dayspassed);

	// so here we set a condition that if the the date is today so equal to 0 meanning today then return the string Today. do do the same to return yesturday and then we say if its been more than or equal to 7 days then return the day(which is converted from timestamp to days) with the string days ago. also note that when we use 'return' with an if condtions no block is requried and the else statement is not requried neither

	if (dayspassed === 0) return `Today`;
	if (dayspassed === 1) return `Yesturday`;
	if (dayspassed <= 7) return `${dayspassed} days ago`;

	/* THIS CODE GOT IMPROVED BY THAT LINE OF CODE   
  // the date is having access to the movementDate array pointing to the index of the type. 
  const day = `${date.getDate()}`.padStart(2,0);
  const month = `${date.getMonth() + 1}`.padStart(2,0); + 1 // here we add + 1 because they are zero based.
  const year = date.getFullYear();


    return `${day}/${month}/${year}`;

    */

	// so here we just return the Intl.DateTimeFormat and inside that parenthese we usually specify the language for example 'en-GB' . but here we pass the locale in as that because then later when this function is later called or used it is called with acc.locale pointint to the locale declare in the account array and in there is an element called locale with the property set to a particular countries DateTime format.
	return new Intl.DateTimeFormat(locale).format(date);
}

// so here we create a function called formatCur which holds the functionality to convert and display the currency based on the users setting and countries's format. in the arg of this function we make it to be a reusable function as we pass on three arg which when called upon we can pass on anything depending on where we want it to point at if in some cases to an object or array. so we simiply return the new Int.NumberFormat and in the parenthese, the first arg we set to be locale, then in the second arg we create an object which includes specifying the style property to currency then set currency to currency and then we call the format and set that to be the value.

function formatCur(value, locale, currency) {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: currency,
	}).format(value);
}

const displayMovements = function (acc, sort = false) {
	containerMovements.innerHTML = '';

	const movs = sort
		? acc.movements.slice().sort((a, b) => a - b)
		: acc.movements;

	movs.forEach(function (mov, i) {
		const type = mov > 0 ? 'deposit' : 'withdrawal';

		// we basically set the current at moment date of the movementdate array pointing at index i.
		const date = new Date(acc.movementsDates[i]);

		// we create a variable called displayDate which we set to be the call back of a function called formatMovement which we pass the date. so pass the date variable above.
		// so because we use the acc to acess arrays in the displaymovement function, and the movs.forEach method is inside this function we also also use the acc to then point to the properties of the locale element found in the array.
		const displayDate = formatMovementDate(date, acc.locale);

		// so here we create a variable called formattedMov assigned to a call back function of the formatCur which holds the functioality of the displaying and converting currencies of countries. in the call back we pass on mov with acess the movement element in the account object, then we pass on acc.locale to access the locale element in the obeject and also the same for the currency. this variable is then  used in the template string and accessing those objects it will display the values of them using the functionality.
		const formattedMov = formatCur(mov, acc.locale, acc.currency);

		const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
			i + 1
		} ${type}</div>
       <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

		containerMovements.insertAdjacentHTML('afterbegin', html);
	});
};

const calcDisplayBalance = function (acc) {
	acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

	labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
	const incomes = acc.movements
		.filter((mov) => mov > 0)
		.reduce((acc, mov) => acc + mov, 0);
	labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

	const out = acc.movements
		.filter((mov) => mov < 0)
		.reduce((acc, mov) => acc + mov, 0);
	labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency); // so here we call the Math.abs for the out to remove the negative and get the absolute value.

	const interest = acc.movements
		.filter((mov) => mov > 0)
		.map((deposit) => (deposit * acc.interestRate) / 100)
		.filter((int, i, arr) => {
			// console.log(arr);
			return int >= 1;
		})
		.reduce((acc, int) => acc + int, 0);
	labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
	accs.forEach(function (acc) {
		acc.username = acc.owner
			.toLowerCase()
			.split(' ')
			.map((name) => name[0])
			.join('');
	});
};
createUsernames(accounts);

const updateUI = function (acc) {
	// Display movements
	displayMovements(acc);

	// Display balance
	calcDisplayBalance(acc);

	// Display summary
	calcDisplaySummary(acc);
};

//So this is the logic of this timer. We start with a certain number of seconds, right now that's 100 and then each time that we callback function here is called, we remove one second from that. so here we set a variable called time to 100 then inside the function we create a setInterval call back function specifeid to one second (1000) and we say that the time should decrease with each second.

function startLogoutTimer() {
	// so this tick function inside of the startLogoutTimer function contains the functionality of the countdown
	function tick() {
		// so basicaly we want to display the time in minutes so we divide the time variable by 60 because there is 60 second in a minute. we also want to see the second count down and so the remainder of the mintues are the seconds so we use the remainder function (%) to get the seconds which there is 60 second in a mintues. we use the Math.trunc to returns the integer part of a number by removing any fractional digits. we also use padStart which requires us to convert to string because padstart is a string method and so we use it to add a zero for when its a single digtial to add the zero to it. for example if the time was 8:13, the padstart will add zero to make it 08:13. so we specify the length of the padding first in this case 2 and then specify what we want to fill it with in this case 0
		const min = String(Math.trunc(time / 60)).padStart(2, 0);
		const sec = String(time % 60).padStart(2, 0);

		// in each call, print the remaining time to UI
		labelTimer.textContent = `${min}: ${sec}`;

		// so here we set a condition that when the time equal zero then we should clear the timer. so we used the method clearInterval and inside the parenthese we pass in the name of the variable of this interval call back function which in this case called timer
		if (time === 0) {
			clearInterval(timer);

			labelWelcome.textContent = `Welcome back, login to get started`;

			containerApp.style.opacity = 0;
		}

		// decrease by 1second, we also want to decrease the time here after the condition because we then when it hit zero thats when we want to clear the interval after its hit zero
		time--;
	}

	// set timer every second
	let time = 100;

	// within the startLogoutTimer function we call back the tick function that is within the StartlogoutTimer function
	tick();

	// call the timer every second
	// we then declare a variable called timer which we pass on the tick function after its being called and set that to execute every second . also note that despite the fact that we declare the variable here we actually used this variable to clear the interval when the time equal 0.
	const timer = setInterval(tick, 1000);

	// so to clear the timer we need to return it here so we can then use it in the call back function somewhere else. for example in the login .
	return timer;
}

///////////////////////////////////////
// Event handlers
// so the global variable contains the currentAccount and the timer because they will be needed to persist between different logins and different activites.
let currentAccount, timer;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100

// so here we create a variable called local and we assign it to navigator.language. what the navigator does is it will be set to use whatever lanuage the browser was set to. (i believe coming from the html).
// const locale = navigator.language;

// labelDate.textContent = new Intl.DateTimeFormat('en-US', option).format(now)

// so as you can see we pass on the locale variable as the first arg in here has we have assigned it to use the browser locale setting.
// labelDate.textContent = new Intl.DateTimeFormat(locale, option).format(now)

btnLogin.addEventListener('click', function (e) {
	// Prevent form from submitting
	e.preventDefault();

	currentAccount = accounts.find(
		(acc) => acc.username === inputLoginUsername.value
	);
	console.log(currentAccount);

	if (currentAccount?.pin === +inputLoginPin.value) {
		// Display UI and message
		labelWelcome.textContent = `Welcome back, ${
			currentAccount.owner.split(' ')[0]
		}`;
		containerApp.style.opacity = 100;

		/* THIS CODE HERE GOT IMPROVED BY THE FUNCTIONALITY BELOW.
        const now = new Date();
    
        // so here we apply the padding methof on the date and month, so usually when the date and month are displayed in with one digal for example date:3 month 1, so this means the 3rd of January basically. so to get the usual format of 03/01 we use padstart and so inside the parenthese of the padstart we specify that we want to return 2 character and then at the start of those character we specify it with 0. which will then give is the 03 for date and 01 for the month as an example.
        const day = `${now.getDate()}`.padStart(2,0);
        const month = `${now.getMonth() + 1}`.padStart(2,0); + 1 // here we add + 1 because they are zero based.
        const year = now.getFullYear();
        
        // we do the same thing with the padStart with the hour and min  
        const hour = `${now.getHours()}`.padStart(2, 0);
        const min = `${now.getMinutes()}`.padStart(2, 0);
        
        labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`
    
    */

		// so use can use the new Intl method in this case to format the time and date in a particular country, so on the Intl we specific the DateTimeFormat and inside that parenthese we specify the language and the country. and then on that we call the format method and pass in the date that we want to format.
		const now = new Date();

		// so because the Intl method assigned to the now varibale only display the date and not the hours and minutes we created an object called option and we have the elements of hour and minute with the property of set to numeric. we then pass the option object as a second arg in the Intl.DateTimeFormat method.
		const option = {
			hour: 'numeric',
			minute: 'numeric',
			day: 'numeric',
			month: 'numeric', // can also be specified to long, 2-digtal
			year: 'numeric',
			// weekday: 'long', // can also specify short, narrow
		};

		labelDate.textContent = new Intl.DateTimeFormat(
			currentAccount.locale,
			option
		).format(now);

		// Clear input fields
		inputLoginUsername.value = inputLoginPin.value = '';
		inputLoginPin.blur();

		// so if someone logs in usually the timer will count down and then if someone else logs in the timer will be counting for both so to fix two timers runnning down, we say if there is a timer running we should clear it so when someone else logins the timer would be cleared and then the timer will then execute the functionality of the StartLogout functions because we had returned the timer.
		// also note we do this before we update the UI
		if (timer) clearInterval(timer);

		// so because weve returned the time from the tick function we set timer to this call back of this function that holds the functionalty for that.
		timer = startLogoutTimer();

		// Update UI
		updateUI(currentAccount);
	}
});

btnTransfer.addEventListener('click', function (e) {
	e.preventDefault();
	const amount = +inputTransferAmount.value;
	const receiverAcc = accounts.find(
		(acc) => acc.username === inputTransferTo.value
	);
	inputTransferAmount.value = inputTransferTo.value = '';

	if (
		amount > 0 &&
		receiverAcc &&
		currentAccount.balance >= amount &&
		receiverAcc?.username !== currentAccount.username
	) {
		// Doing the transfer
		currentAccount.movements.push(-amount);
		receiverAcc.movements.push(amount);

		// adding new transfer date
		// so here we push inside the movementsDate array the current moment time and call the toISOString method to standardise the format of the dates
		currentAccount.movementsDates.push(new Date().toISOString());
		receiverAcc.movementsDates.push(new Date().toISOString());

		// Update UI
		updateUI(currentAccount);

		// so basically when we want to do some activities on the account we want to prevent being logged out and clear the timer to prevent this. so here we clear the timer using clearInterval and then we reset the timer by setting or assigning timer to the StartLogoutTimer to start the timer all over again.
		// also note that we do this after the update of the UI
		clearInterval(timer);
		timer = startLogoutTimer();
	}
});

btnLoan.addEventListener('click', function (e) {
	e.preventDefault();

	// the Math.floor method here will round up any input amount to the nearest whole number, so for example if someone requested a loan of 153.55, this will round the request to 154.
	const amount = Math.floor(inputLoanAmount.value);

	if (
		amount > 0 &&
		currentAccount.movements.some((mov) => mov >= amount * 0.1)
	) {
		// so here we set a timeout function for reqesting a loan, so when the if condition is  met on the click event, this will then execute the call back function of the timer that is specified.
		setTimeout(function () {
			// Add movement
			currentAccount.movements.push(amount);

			// adding date for the request loan
			// so here we push inside the movementsDate array the current moment time and call the toISOString method to standardise the format of the dates
			currentAccount.movementsDates.push(new Date().toISOString());

			// Update UI
			updateUI(currentAccount);

			// so basically when we want to do some activities on the account we want to prevent being logged out and clear the timer to prevent this. so here we clear the timer using clearInterval and then we reset the timer by setting or assigning timer to the StartLogoutTimer to start the timer all over again.
			// also note that we do this after the update of the UI
			clearInterval(timer);
			timer = startLogoutTimer();
		}, 3000);
	}

	inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
	e.preventDefault();

	if (
		inputCloseUsername.value === currentAccount.username &&
		+inputClosePin.value === currentAccount.pin
	) {
		const index = accounts.findIndex(
			(acc) => acc.username === currentAccount.username
		);
		console.log(index);
		// .indexOf(23)

		// Delete account
		accounts.splice(index, 1);

		// Hide UI
		containerApp.style.opacity = 0;
	}

	inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
	e.preventDefault();
	displayMovements(currentAccount.movements, !sorted);
	sorted = !sorted;
});
