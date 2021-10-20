import React, { useState }from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
//notes
// Sending an HTTP request is an asynchronous task....its not instant 

function App() {
  const [movies, setMovies] = useState([]); //first render is an empty array, after fetch runs and stores api data inside our state, react re renders 
  //states for handling loading and error messages
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function fetchMoviesHandler() {
    setIsLoading(true);
    setError(null);
    //built in javascript Fetch API method
    //fetch returns a promise, which allows us to react to the response or any potential errors we might get.
    fetch("https://swapi.dev/api/films")//api link
      .then((response) => {
        //response is an object with data about the response coming in from the api call (JSON)
        if (!response.ok) {
          //if something goes wrong if the response is not ok
          throw new Error("Something went wrong"); //error message to show
        }
        //no errors above, move on
        return response.json(); //data comes in as a JSON format, .json() transforms JSON response into a Javascript object we can then actually use
      })
      .then((data) => {
        //after transforming JSON format into a Javascript object, (.then) here we have our transformed data which can be stored somewhere (state)
        const transformedMovies = data.results.map((movieData) => {
          //before we store the data from an api, we can construct our own object, using only what we need from data coming from our api
          return {
            id: movieData.episode_id,
            title: movieData.title,
            openingText: movieData.opening_crawl,
            releaseData: movieData.release_date,
          };
        });
        setMovies(transformedMovies); //Storing data from api
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
        // });  e
      })
      .catch((error) => {//catch any errors.
        setError(error.message);
      });
    setIsLoading(false);
  };

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

export default App;
