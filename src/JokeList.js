import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */
function JokeList({ numJokes = 5 }) {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

/* retrieve jokes from API */
  useEffect(() => {
    async function getJokes() {
      let j = [...jokes];
      let seenJokes = new Set();
      try {
        while (j.length < numJokes) {
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json"}
          });
          let { ...jokeObj } = res.data;

          if (!seenJokes.has(jokeObj.id)) {
            seenJokes.add(jokeObj.id);
            j.push({ ...jokeObj, votes: 0 });
          }
          else {
            console.log("dupicate found!");
          }
        };
        setJokes(j);
        setIsLoading(false);
      } catch(err) {
        console.error(err);
      }
    };
    if (jokes.length === 0) {
      getJokes();
    }
  }, [jokes, numJokes]);

  /* empty joke list, set to loading state, and then call getJokes */
  function generateNewJokes() {
    setJokes([]);
    setIsLoading(true);
  };
  /* change vote for this id by delta (+1 or -1) */
  function vote(id, delta) {
    setJokes(allJokes => 
      allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  }
  /* render: either loading spinner or list of sorted jokes. */
  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    )
  }
  let sortedJokes = [ ...jokes].sort((a, b) => b.votes - a.votes);

  return (
    <div className="JokeList">
      <button className="Jokelist-getmore" onClick={generateNewJokes}>Get New Jokes</button>
      {sortedJokes.map(({joke, id, votes}) => (
        <Joke text={joke} id={id} key={id} votes={votes} vote={vote} />
      ))}
    </div>
  );
}

export default JokeList;
