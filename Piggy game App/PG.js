'use strict';

// selecting elements
const player0EL = document.querySelector('.player--0');
const player1EL = document.querySelector('.player--1');

const score0EL = document.querySelector('#score--0');

// this is another way to select html id element. which is the getElementbyId method. doing it this way we dont need to to add the hashtag.
const score1EL = document.getElementById('score--1');

const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');


const diceEL = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');


// starting conditions
score0EL.textContent = 0;
score1EL.textContent = 0;
current0El.textContent =0;
current1El.textContent =0;

// here we add the applied style from ccs that set hidden to none, which means that the dice will not show, later on we will remove the css applied to allow the dice to show when an event (click) is performed.
diceEL.classList.add('hidden');

// this has to be outside the function in the global scope because it will be set to zero each time the function undergo the function of the click.
let currentScore = 0;

// array to store players score 
let scores = [0,0];
// active current player
let activePlayer = 0;

// this is called a state variable because we set it true or false here in the global scope and within blocks of codes if we wanted the conditon to be false we can simply just set it within that block to false 
let playing = true;


const init = function (){
 

score0EL.textContent = 0;
score1EL.textContent = 0;
current0El.textContent =0;
current1El.textContent =0;

scores = [0, 0];
currentScore = 0;
activePlayer = 0;
playing = true;


player0EL.classList.remove('player--winner');
player1EL.classList.remove('player--winner');
player0EL.classList.add('player--active');
player1EL.classList.remove('player--active');

diceEL.classList.add('hidden');

}

init();


// switch player function so keep the code dry, hence there are more than one occassion that the switching a player will talke place 
const switchPlayer = function(){

    document.getElementById(`current--${activePlayer}`).textContent = 0;
       currentScore = 0;

       // bascially in here the logic is, if and we're checking whether right now it is player 0. So if it is then here the result of this whole operator, so which again is all of this, then the result will be 1. And so then activePlayer will be equal to 1, but if this is false here, so if the player is actually 1, well then the active player will become 0. And so essentially this allows us to switch from zero to 1.
       activePlayer = activePlayer === 0 ? 1 : 0;
       
       // toggle method on classlist bascially will add the class if it is not there and if it is there, it will remove it. so bascially, what will happen is, when the switch happens all the property on the player active class will be added or removed depending on what player is the add one out of player0EL and player1EL.
       player0EL.classList.toggle('player--active');
       player1EL.classList.toggle('player--active');
};

// btn roll functionality 

btnRoll.addEventListener('click',function(){

    if(playing){
    // 1. generate a random dice roll
   const dice = Math.trunc(Math.random() * 6 ) + 1;

   // 2. display dice 

    // in the css we style the hidden class and assign the display to none meaning that it will no show. here manipulating css we use classlist to remove the hidden class when the event click is carried out. this will display and bascially remove the css style that was none to display. 
    diceEL.classList.remove('hidden');

    // bascially we use the src method on the diceEL which is we have assigned above and point at the class of dice. because this class is a img so a source, we can manipulate the content of the image and in this case we assign the image to dice which generate a random number, so in this case it will generate random image from those image sources.
    diceEL.src = `dice-${dice}.png`;

   // 3. check for rolled 1

   if (dice !== 1){
       // add dice to current score
       currentScore+= dice;

      // this will set the score dynamically to whoever is the active player. above in the globe scope we define a variable actve player which is an array that will contain the score of the players and the reason for this is because array starts at zero and so thats why we have the class name current as current --0 and current--1 because the current --0 will be for postion 0 in the array and current --1 will be for position 1 in the array
       document.getElementById(`current--${activePlayer}`).textContent = currentScore;
      
       

   }else {
       // swtich to next player, this will allow us to switch either to zero or 1, because there the two players are defined as active player 0 and active player 1 in the the html section. the documrnt . getElementById will reset the current players score back to zero once the dice roll is one, and then the next player turn will begin. we call the function here because there is a switch player function already with has the logic of how the swtich will work.
       
       switchPlayer();

   }
    }
});


btnHold.addEventListener('click', function(){
    if (playing){

    // add current score to the active players score

     // scores [1] = score[1] + current scores, when we click the hold button, this will bascially add the scores of the active player to there current score
    scores[activePlayer] += currentScore;
   
    // this will display the scores of the active player, so bascially will display the value of their total score that that round once the click on the hold button
    document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];

    // check if players score is >=100
    if (scores[activePlayer] >=100){
        // finish the game 

        // in the global scope we set the varible to playing true, now here we change it to false to end the game
        playing = false;

        // this will add the hidden class, so basically hide the dice when someone wins the game.
        diceEL.classList.add('hidden');

        // so here when there is a winner there is a class called player--winner which is styled in css to turn black, so here we say if the active player wins add this class and then because of player active class style is still present we remove it.
        document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');

    }else{ 
// switch to the next player, all we need to do here is to call the function switch player.
    switchPlayer();

    }

    }
});


// so we just pass the init function here as seperated by commas as javascript engine will be the one to call the function for us. so when the btnNew is clicked as that is the event, it will also excute the functionlaities of the function 'init'
btnNew.addEventListener('click', init );
