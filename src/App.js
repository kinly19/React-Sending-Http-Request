import React, { useState, useEffect, useCallback}from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';
//notes
// Sending an HTTP request is an asynchronous task....its not instant 

function App() {
  const [movies, setMovies] = useState([]); //first render is an empty array, after fetch runs and stores api data inside our state, react re renders 
  //states for handling loading and error messages
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(() => { //below after useEffect, explains why we used useCallback hook
    setIsLoading(true);
    setError(null);
    //built in javascript Fetch API method
    //fetch returns a promise, which allows us to react to the response or any potential errors we might get.
    fetch("https://react-http-test-ff323-default-rtdb.europe-west1.firebasedatabase.app/movies.json")//api link
      .then((response) => {
        //response is an object with data about the response coming in from the api call (JSON)
        if (!response.ok) {
          //if the response is not ok
          throw new Error("Something went wrong"); //error message to show
        }
        //no errors above, move on
        return response.json(); //data comes in as a JSON format, .json() transforms JSON response into a Javascript object we can then actually use
      })
      .then((data) => {
        //because the data comes in as an object we want to store each object and its key pair values inside of an array
        const loadedMovies = [];

        for(const key in data){ //go through data and push each object and its key and values into own array (array object)
          loadedMovies.push({
            id:key,
            title:data[key].title,
            openingText:data[key].openingText,
            releaseData:data[key].releaseData
          });
        }
        console.log(loadedMovies)
        setMovies(loadedMovies); //Storing data from api

        //===========================================alternative mapping through an array list=====================================================
        //after transforming JSON format into a Javascript object, (.then) here we have our transformed data which can be stored somewhere (state)
        // const transformedMovies = data.results.map((movieData) => {
        //   //before we store the data from an api, we can construct our own object, using only what we need from data coming from our api
        //   return {
        //     id: movieData.episode_id,
        //     title: movieData.title,
        //     openingText: movieData.opening_crawl,
        //     releaseData: movieData.release_date,
        //   };
        // });
        //Alternative from above, instead of using a helper const, map and store new object directly inside of state  
        // .then((data) => {
        //   setMovies(data.results.map(movieData => {
        //     return {
        //       id: movieData.episode_id,
        //       title: movieData.title,
        //       openingText: movieData.opening_crawl,
        //       releaseData: movieData.release.data 
        //     }
        //   }))
        // });
        //========================================================================================================================================
      })
      .catch((error) => {//catch any errors.
        setError(error.message);
      });
    setIsLoading(false);
  },[]);

  //Hoisting -https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
  //make sure useEffect sits below our fetchMoviesHandler const
  useEffect (() => { //run our fetchMovieHandler after first render
    fetchMoviesHandler();
  },[fetchMoviesHandler]); 
  //because we pass the function as a dependency, when react re renders it creates a new function object,
  //because this function is now a new object, useEffect see the function as changed even when it hasnt.
  //we use useCallback to make the function object returned from useCallback will be the same between re-renders
  //https://aheadcreative.co.uk/articles/when-to-use-react-usecallback/ good to know link


//============ Alternative using async/await ===========================
//does the same as above, instead of chaining .then()
//we use await
//easier to read and looks cleaner

  // async function fetchMoviesHandler () {
  //   const response = await fetch ('link goes here');
  //   const data = await response.json();

  //   const transformedMovies = data.results.map((movieData) => {
  //     return {
  //       id: movieData.episode_id,
  //       title: movieData.title,
  //       openingText: movieData.opening_crawl,
  //       releaseData: movieData.release.data,
  //     };
  //   });
  //   setMovies(transformedMovies);
  // };

//=======================================================================
  
  // const dummyMovies = [ //dummy data used for mapping through and returning lists of movies
  //   {
  //     id: 1,
  //     title: 'Some Dummy Movie',
  //     openingText: 'This is the opening text of the movie',
  //     releaseDate: '2021-05-18',
  //   },
  //   {
  //     id: 2,
  //     title: 'Some Dummy Movie 2',
  //     openingText: 'This is the second opening text of the movie',
  //     releaseDate: '2021-05-19',
  //   },
  // ];

  //sending a post request
  async function addMovieHandler (movie) {
    const response = await fetch('https://react-http-test-ff323-default-rtdb.europe-west1.firebasedatabase.app/movies.json', { //url endpoint to send to.
      method: 'POST', //post method default is GET
      body: JSON.stringify(movie),
      headers: {
        'Content-type':'application/json' //firebase doesnt need this, but most requrie this extra header
      }
    });
    const data = await response.json();
    console.log(data)
  }

  //instead of writing inline checks, we can do this more elegantly.
  let content = <p>Found No Movies</p> //content variable with a default value
  //the value stored in the content variable will now differ based on the state we have.

  if (movies.length > 0){ //if we have a movie show MovieList component
    content = <MoviesList movies={movies}/>
  }

  if(isLoading){ // show loading message
    content = <p>Loading...</p>
  }
  
  if (error){ //show error message
    content = <p>{error}</p>
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler}/>
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button> {/* simple button, for running api fetch function */}
      </section>
      <section>
        {/* conditional rendering of MovieList component */}
        {/* {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>No Movies Found</p>}
        {isLoading && <p>Loading...</p>}
        {!isLoading && error && <p>{error}</p>} */}
        {content} {/* make use of content */}
      </section>
    </React.Fragment>
  );
}
//test

export default App;
