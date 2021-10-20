import React from 'react';

import classes from './Movie.module.css';

const Movie = (props) => { //used to return list of movies after mapping 
  return (
    <li className={classes.movie}>
      <h2>{props.title}</h2>
      <h3>{props.releaseDate}</h3>
      <p>{props.openingText}</p>
    </li>
  );
};

export default Movie;
