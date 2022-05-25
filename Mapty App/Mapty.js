'use strict';

// leaflet library that was used for the application 
/* https://leafletjs.com/SlavaUkraini/reference.html#map-factory */

// // so we defined  global variables here becuase we are going to need access to it for mupliple funcitionity in different blocks, but because we now have all our application in a class container called app we dont need these global varibale. 
// let map, mapEvent;


class Workout {

    date = new Date();

    // so for this application example we create an id using the date and we add that date to a string and then in that we slice so take the last 10 character of the string which we will use as the id.
    id = (Date.now() + '').slice(-10);

    constructor(coords, ditance, duration) {
        this.coords = coords; // [lat, lng]
        this.distance = ditance; // in km
        this.duration = duration; // in min


    }

    _setDescription() {
        // prettier-ignore - // this comment here tell prettier to ignore the next line of code
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        // so here in this method we create a property called description and this property consist of storing a string template literal and in that we convert the first char of the type so either running or cycling to uppercase and then slice the first char of the type as we made that uppercase so we dont want the lower case of it and so the slice method return the rest of the string. and then we say beasically that we want to get the current month with the getMonth method and also now we can use this to retrive any value out of our month array. and then also we want to get the current date and so used the .getDate method.
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]
            } ${this.date.getDate()}`;

    }




}


class Running extends Workout {
    type = 'running';
    constructor(coords, ditance, duration, cadence) {
        super(coords, ditance, duration)
        this.cadence = cadence;

        // so when we have a method here like this, it can immediately be returned becuase its in the constructor, so essentially we dont need to worry about returning this method in case its needed somewhere else in our app.
        this.calcPace();

        // call back for description method, and so we are able to call it in this child class because the child can have access to its parent class which this method was created.
        this._setDescription();
    }

    // so here we create a method calcpace and in this we create a new property called pace and this stores and works out the pace which is calculated by the duration divided by the distance
    calcPace() {

        this.pace = this.duration / this.distance;

        return this.pace;
    }




}

class Cycling extends Workout {
    type = 'cycling';
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;

        this.calcSpeed();

        // call back for description method, and so we are able to call it in this child class because the child can have access to its parent class which this method was created.
        this._setDescription();


    }

    // so this method is create a new property called speed which stores and out work the speed which is calculated by the distance divided by the duration and sp because we want the duration(time) in minutes we divide it by 60.
    calcSpeed() {

        this.speed = this.distance / (this.duration / 60)

        return this.speed;
    }


}


// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycling1 = new Cycling([39, -12], 27, 95, 523);
// console.log(run1, cycling1);

/////////////////////////////

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');


// APPLICATION ARCHITECTURE

class App {
    // so before the refactoring we made the map and mapEvent a global varibale becuase we  need access to it for mupliple funcitionity in different blocks but here we want everthing to do with the app inside of this App class so we make them a private instance within the class 
    #map;
    #mapZoomLevel = 13;
    #mapEvent;
    #workouts = [];
    constructor() {

        // methods called in the constructor will immedirately be returned. so all these event handlers and all these methods below.

        /* get user's position */
        // so because the constructor method is called immediately when a new object is created from the class, so in this case the class App, we pass on this method _getPostition in the constructor and so we can immediately execute the functionality of this method to load the map and get the users current loaction / postition.
        this._getPosition();

        /* get data from local storage */

        this._getLocalStorage();


        /* attach event handler */

        // so the submit event listener when something is submitted on the page. 
        // an event handler function will always have the this keyword of the dom element onto which it is attached which in this case the form element, but we want the this keyword to be pointing to the App object so we call the bind method on the newWorkout method so that it point to the this keyword which is pointing to the App object.
        form.addEventListener('submit', this._newWorkout.bind(this));


        // The change event is fired for <input>, <select>, and <textarea> elements when an alteration to the element's value is committed by the user. so here we pass in the method _toggleElevationField because this methods hold the functionality of the change. (see method for description)
        inputType.addEventListener('change', this._toggleElevationField);

        // so here we create an eventlistenr click and attached to the this element which is a parent element class called workout in the html and then we pass in this function callled moveToPopup to this event.
        containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));


    }


    _getPosition() {
        /* using Geolaction API & displaying a map using the leaflet library */

        // so this is what we use to get geolocation and also the getCurrentPosition method recieves two call back function. the first one that will be called on sucess, so whenever the browswer successfully got the coordinates of the current position of the user and the second callback function is the error call back, which is the one that is going to be called when there happened to be an error getting the coordinates.

        //the first call back function so the success call back function, so we can have a methood called _loadMap this method holds the functionality to laod the map and so we pass in this method as the success call back function to get the map up and loaded. and so JS will pass in the postiton of the user as soon as the current position is determined because the postion arg basically gets the coords of the user. also note that its this._loadMap because we are using classes.

        // so here also we have the bind method on the this._loadMap and so this is because this call back function is treated as a regular function call not as a method and so because its not us calling this function, JS calls it as a regular function call. and so in a regular function call, the this keyword is set to undefined. and so we use the bind method  because The bind() method creates a new function that, when called, has its this keyword set to the provided value. so basically we bind the this keyword to whatever we need, so the this keyword is pointing at the _loadMap, binding the this word we can then use it and get it to point to else where, when we call and use that this kwyword elsewhere.
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
                alert('could not get your location')

            })




    }


    _loadMap(position) {

        // so here we want to get the coodinate of our current location and so there is a property called coords which is a child propety of the geolocationpostion object. and so we basically use destructure to destruct the two values we want from the coords property which are the latitude and the longitude, that are repsonible for the coordinate of our location.
        const { latitude } = position.coords;
        const { longitude } = position.coords

        console.log(latitude, longitude)


        // so basically here we copied and pasted the function of using this library but adapt it to our own advantage 

        // so whatever string we pass into this map method must be the ID of an element in our HTML and it is that element that the map will be displayed. so intially that html id created on the html will be empty to start with.

        // so leaflet basically gives us this L namespace here and then this L has a couple of methods that we can use so for example the map method, the tilayer, and the marker method that all provides different functionality. 

        // so we call the setView method on the empty map and that method consist of an array which we then pass our latitude and longitude in that order which then we return our current loaction. so we create an array called coords which holds our latitude and longitude and then inside the first parameter of the setview method we pass in those coords array. the second parameter is the zoom level. setView() immediately set the new view to the desired location/zoom level hence why we pass in the coords in. and so in the class App private field, we set the mapZoomLevel to 13 and pass that variable here  
        const coords = [latitude, longitude];
        this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

        console.log(map)
        console.log(coords)

        // so tje tilelayer is bascially thr type or style of map. open street map is the common ones. and so also we can change the style of the open map tile and use a different theme and so we changed the default of .org to .fr/hot/
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);


        // so we are trying to add an event lisenter so that when a user click on a location on the map it will pin a marker on that location. but we need access to the coordinates of the point that will be clicked and we can not do that with an event listener. so to add an event lisenter. 

        //so with this map object here from the leaflet library and its an object because we are calling it on the L with is a special object created that contains different methods

        // so here we call the on method on the map object and this on method isnt from JS but from the leaflet library. so we use the on method as an event listener. so here we specify the event in the case click then second parameter that recieves a call back function. so usually in the standard way the call back function recieves an event as the arg but in this case we are going to use the event created by the leaflet so we call it mapEevent  
        this.#map.on('click', this._showform.bind(this));

        // and so we only call this method here  because we need to wait for the map to get the postition and load up the map before we are able to render a maker on the map. and so with this for each method we loop and render each of the workout on the map. 
        this.#workouts.forEach(work => {
            this._renderWorkoutMarker(work);
        });






    }

    _showform(mapE) {

        // So again, we did this one here because we don't need this map even right here in this function Which is a place where we get access to it.
        this.#mapEvent = mapE;

        // when a click on the map happens, then we want to show the form. so basically the form class on the css is set to hidden to hide the form, and so here now we removing that hidden class and making it visible.
        form.classList.remove('hidden')
        inputDistance.focus(); // the focus method is used to set the user to start at a particular place. in this case we set the focus so that the on the input form the cursor will be on that input form.

    }


    // method for hiding the form

    _hideForm() {

        // so here this will clear the value of the input form (hence .value) after the form event is executed so submitted.
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
            '';

        // so here we hide the form setting it to display none here and basically add back the hidden class from the form which by default was set to hidden.
        form.style.display = 'none'
        form.classList.add('hidden')

        // and so here we add a setinterval function and we return the form styled to display the grid so bascially to show and we set this to happen after 1 second. so basically after we submit the form the form is hidden by then after the second the form will return the content and display it.
        setInterval(function () {
            return form.style.display = 'grid';
        }, 1000)



    }

    _toggleElevationField() {

        // so here we use the closest method to get access to the closest parent element to this inputelevation that we have selected (.form__input--elevation) and so on this element we toggle so do the opposite. in this case we toggle the form__row--hidden class so then it will become visible. so so because the want either the elevation and cadence to be either visible anf the other hidden we toggle the cadence as well. as so the form__row being the closest parent elemnt to these two element will change to which ever one is selected.
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(e) {

        // so here we created a function which holds a functionality to return a finite number so checks if input is a number. and we used the every method for this because the Every method only return true if all the elements satify the conditon that we pass into the call back function. and so with this every method which is an array method hence the use of the spread (...) so whenever we use the spead operation like this we create an array and so this every method will loop over the array and then it will check if each of the numbers in the array meets the condition which in this case the conditon is for the number to be finite.
        function validInputs(...inputs) {

            return inputs.every(function (inp) {
                return Number.isFinite(inp);

            })
        }

        function allPositive(...inputs) {

            return inputs.every(function (inp) {

                return inp > 0;


            })
        }

        e.preventDefault()

        // get data from form 
        // in the html there is an attribute called value and so the content of this attribute represents the value to be submitted with the form, should this option be selected. If this attribute is omitted, the value is taken from the text content of the option element.
        const type = inputType.value;

        // so these two varibale we covert them to allow allow input of number. that what the + sign is.
        const distance = +inputDistance.value;
        const duration = +inputDuration.value

        // so here we destruct the values that are in the latlng. the latlng holds the coordinates of the location when we click on a particular spot on the map. and we use lat, lng as two variable because the latlng holds two different values one of the lat and the other for the lng. and so we attach these coordinate to the event in this case mapEvent so that when we click we get the coordinates of that location from the click.

        // and then here, we need the mapEvent. We will get access to the global variable and can then use the latitude and longitude right here in this function.
        const { lat, lng } = this.#mapEvent.latlng

        // so becuase we have two different workout, we created this global variable here so that both the running and cycling which are in different scope block can bpth have access to this here.
        let workout;


        // if workout runnung, create a running object
        // so here we check that if the type of input option is running then we created this variable cadence which will accept and store the values of the cadence

        if (type === 'running') {
            const cadence = +inputCadence.value;

            if (
                // !Number.isFinite(distance) ||
                // !Number.isFinite(duration) ||
                // !Number.isFinite(cadence)

                // so here in this condtion check, we call the function validInputs and allPositive that we created above for checking if a value is a number and its a postive number and so here we pass in the distance, duration and cadence as this function recieves an array(...inputs) so in this way we can check if all these variables that requires inputs, recieves the right type of inputs.  so then we used the (!) meaning that if this condtions are not met then return the alert message. 
                !validInputs(distance, duration, cadence) ||
                !allPositive(distance, duration, cadence)
            )
                return alert('Inputs have to be positive numbers!');

            // so here we create an object from the child class running which receives coords(the cordinates for the loaction), ditance, duration, cadence. the coords are in an arrays because we stored then in an object then destructed it and assigned it to the  #mapEvent an instance in the class which points to the this keyword. 

            // so here we asssgn the wprkout global variable to this new running object and we do the same for the cycling because its a let and so its mutatable note that this is in the if block statement because we want this to return a new object of inputted data when all these condtions are met same with the cycling also.
            workout = new Running([lat, lng], distance, duration, cadence);
        }





        // if workout cycling, create a cycling oject
        // so here we check that if the type of input option is cycling then we created this variable elevationGain which will accept and store the values of the elevation

        if (type === 'cycling') {
            const elevation = +inputElevation.value;

            if (
                !validInputs(distance, duration, elevation) ||
                !allPositive(distance, duration)
            )
                return alert('Inputs have to be positive numbers!');

            workout = new Cycling([lat, lng], distance, duration, elevation);

        }


        // Add new object to workout array
        // and so here we push the assigned cycling and running objects that is assigned to this workout into the #workouts propety that we created as an empty array in the class App.
        this.#workouts.push(workout);

        // render workout on map as marker
        // so here inside the _newworkout method we call the renderworkoutmarker method which display the marker on the map and we pass in the workout in the arg so that the workout will be displayed on the marker on the map. note that method can not be created in other method they can only be called in another method.

        this._renderWorkoutMarker(workout);

        // rendering workout on list
        this._renderWorkout(workout)

        // Hide form + clear input fields. so here in this _newworkout method we call the hideForm method.
        this._hideForm();


        // set local storage to all workout 
        this._setLocalStorage();






    }



    _renderWorkoutMarker(workout) {
        /* displaying a map marker */



        // and here also we pass in the coords array because the latitude and longitude are needed here also. so basically we pass on and put the values of the lat and lng in an array here on the marker so that when we click the marker will has the lat and lng of that location and there the marker will be pined at with the displayed message from the bindpopup method. the functionality of the bindPopup is that it creates a pop up, so a message and then binds it to the marker.

        // so the addTo method bascially hads thing to the specifed destination for example in this case we add the marker object to the map which the addTo recieve in its parenthese.



        // so note that inside the bindPopup method we using the L.popup object so this object consist of functionality that is provided in the documentation of the leaflet library and so this object consist of different property which we can specify for the Popup. 
        // so here on the L.marker we pass in the arg workout which will have access to the lat, lng (coords ) so the coordinates we need for the users location.
        L.marker(workout.coords).addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false, // popup closing when another popup is opened so the default is set to true but we dont want the popup to close when another popup is opened.
                closeOnClick: false, // prevent popups from closing but this time, whenever the user clicks on the map. the default is true but we want the opposite so set it to false.
                className: `${workout.type}-popup`, // so also there is a className property that allows a custom CSS class name to assign to the popup. so this class called 'running-popup' is styled in the css and so we passing it in. and so here also we use the arg workout to have access to the type of workout coming from either the running class or the cycling class, as this is defined in the public field in both of these child classes.


            }))
            .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`) // so this method called setPopupContent, this method is inhertied from a class called Layer that has features which can be added for the marker in the leaflet library. and this method allows for a popup of content on the marker in this case. also this method only recieves strings and so here we created a template literal as a way of passing the object into this method that only recieve string. and so here we pass in the type of worout and also with the description 
            .openPopup();



    }

    // And so what we're gonna do here is basically some DOM manipulation. So we're gonna create some markup. So basically some HTML and then we will insert that into the DOM. 
    _renderWorkout(workout) {

        // so here we used a templte literal to pass in and form a collection of data compsed with text which we will then insert and create into the html to be displayed. so here we passed in the neccessary data / object using the arg workout to have access to them whereever they are in this class App at the neccessary position neeed in format. so this here is related to both the cycling and running type.
        let html = ` <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
        <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div >
            <div class="workout__details">
                <span class="workout__icon">⏱</span>
                <span class="workout__value">${workout.duration}</span>
                <span class="workout__unit">min</span>
            </div>


        `;

        // so here we want to customise the neccessary data and format if the type is a running which will be different for if the type was cycyling.
        if (workout.type === 'running')

            // so here we say html += because we adding this to the html variable we created for this template literal.
            html +=

                `  <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>`

        if (workout.type === 'cycling')
            html += `
            <div class="workout__details">
              <span class="workout__icon">⚡️</span>
              <span class="workout__value">${workout.speed.toFixed(1)}</span>
              <span class="workout__unit">km/h</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⛰</span>
              <span class="workout__value">${workout.elevationGain}</span>
              <span class="workout__unit">m</span>
            </div>
          </li>
          `;

        // and so here we insert the html that we created conposing of these format after this child form element. and we used afterend because  the after end is Only valid if the element is in the DOM tree and has a parent element.  so the form is a child to the parent element of ul. and then this afterend will insert this html as a siblings element to form. where as the other option will insert them as either the first or last child element. 
        form.insertAdjacentHTML('afterend', html);



    }

    _moveToPopup(e) {

        // so here we create a variable and that variable basically uses the event, so the click and looks at the target so the element that is clicked and we use the closest method on this to look for the closes parent in this case the workout and so we are able to click on any element that fall within this parent element. so if any of the child or siblings element was clicked on this, it will return the everthing within the parent element.
        const workoutEl = e.target.closest('.workout')

        console.log(workoutEl)

        if (!workoutEl) return

        // so here we we write a condition and we say if the workoutEL is not the workoutEl bascially return the following which then we create a variable called workout in this block scope and so in this variable we use the find method on the #workouts which in the class App is an array and ealier we pushed the data of the workouts inside this array and so we use this method to now retrive data from that array. so in this call back function we pass in the arg work and so we use this to return and have access to the id we created somewhere in the class App  and then we say if that is equal to the event stored in the variable workoutEL,  and then get the html dataset on that id 
        const workout = this.#workouts.find(function (work) {

            return work.id === workoutEl.dataset.id

        });
        console.log(workout)

        // and so here when we click on the event, this will takes us to that particular workout on the map. and so setView() immediately set the new view to the desired location/zoom level hence why we pass in the coords in.
        this.#map.setView(workout.coords, this.#mapZoomLevel, {
            // so this setview method recieves various properties and object in its parameter. so for example it recieves this object which consist different special property which performs a particular function, this method is from the leaflet library and so will need to look up what they do on there.
            animate: true,
            pan: {
                duration: 1,
            },

        })


    }

    // And so local storage is basically a place in the browser where we can store data that will stay there even after we close the page. So storing all the workouts in local storage will happens whenever the user creates a new workout.

    // so here we have a method to use the local stroage API. local stroage is an API that the browser provides for us and that we can use.
    _setLocalStorage() {

        // and so the to use the local storage API we do this . so we have localStorage and then on this we use a method called setItem which recieves a key which we define and also a value and both requires a string input. So basically local storage is a simple key value store, and so because we want to pass in an oject for the value we use this special method called JSON.stringify which convert objects to string. and then inside the parenthese we pass in the object we are trying to convert and use.
        // this local strage API is only used for small data store and should not be used for large data usage.
        localStorage.setItem('workouts', JSON.stringify(this.#workouts))


    }

    _getLocalStorage() {

        // and so previously created a method called setocalStorage then here we create a method getLocalStorage which does the opposite and recieve and return the key that we passed when setting it. and so here we store this in a variable called data and in the getItem parameter we pass in the key we set. and so we want to convert this string (workout)back to an object. and so we use the JSON.parse method for that and inside its parameter pass in the localStorage property.
        const data = JSON.parse(localStorage.getItem('workouts'))

        // so this guard clause checks if there is actually some data  and so of course if there is nothing stored it will return undefined.
        if (!data) return;

        // And so what we want to do with this data, which is basically our array of workouts,is to restore our workouts array. So we can say, this.workouts should be equal to the data that we just read. But if we already had some data in the local storage, then, we will simply set that workouts array to the data that we had before. And so essentially we are restoring the data here across mutiple reload on the page

        this.#workouts = data;

        // and so here we render these workout data on the list. and so we want to do something for each of the workouts. And so we loop over this array, but we don't want to create a new array. And so forEach is perfect for this.

        this.#workouts.forEach(work => {
            this._renderWorkout(work);
        });



    }

    // we can then reload the page programmatically. And so then the application will look completely empty. And we can do this with location.reload. so basically the localstorage.removeItem clears data in the local storage.
    reset() {
        localStorage.removeItem('workouts');
        location.reload();
    }

}


// so here we have to create an object from the APP class and then call the _getPosition method in order for the method to be executed.
const app = new App();














