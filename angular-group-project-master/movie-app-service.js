"use strict";

function MovieAppService($http, $q) {

    const service = this;

    service.detailedMovie = []; // [{movieObj}] - an array of one
        service.detailedMovieGenreArray = [];  // stores names corresponding to genre id#s
        service.detailedMovieGenreString = "";

    service.api_key = "1524464cc72ee93f90022d132d1d2e44";

    service.responseData = {};
/* Discover Params */
    service.pageNumber = 1;
    service.earliestReleaseDate = "";
    service.latestReleaseDate = "";
    service.genreSelection = [28,12,16,35,80,99,18,10751,14,36,27,10402,9648,10749,878,10770,53,10752,37];
    service.genresNotWanted = [];
    service.runTimeGreaterThanOrEqual = 0
    service.runTimeLessThanOrEqual = 420;
    service.vote_averageGreaterThanOrEqual = 0;
    service.vote_averageLessThanOrEqual = 10;
    service.pageLimit = 1000;


/* Query/search Params */
    service.queryMode = false;  // not sure if I want to implement this...
    service.searchQuery = "";
    service.queryPageNumber = 1;
    service.queryPageLimit = 1000;
    
    service.movieList = [];

/* Discover API interactions */

    service.callTheMovieDbApi = () => {
        return $q(function(resolve, reject){
            console.log("all the params in callTheMovieDbApi:");
            console.log(service.api_key, service.pageNumber, service.vote_averageGreaterThanOrEqual, service.earliestReleaseDate, service.latestReleaseDate, 
                service.genreSelection, service.genresNotWanted, service.runTimeLessThanOrEqual);
            $http.get('https://api.themoviedb.org/3/discover/movie', {
            params: {
                api_key: service.api_key,
                language: "en-US",
                sort_by: "popularity.desc",
                include_adult: false,
                include_video: false,
                page: service.pageNumber,
                'release_date.gte': service.earliestReleaseDate,
                'release_date.lte': service.latestReleaseDate,
                // 'with_genres': service.genreSelection,  // perhaps having both params breaks it?  i'm not sure why..
                'without_genres': service.genresNotWanted,
                'with_runtime.gte': service.runTimeGreaterThanOrEqual,
                'with_runtime.lte': service.runTimeLessThanOrEqual,
                'vote_average.gte': service.vote_averageGreaterThanOrEqual,
                'vote_average.lte': service.vote_averageLessThanOrEqual
            }
        })
            .then( (response)=>{
                response.data.results.forEach((movie)=>{ // this is to add starred boolean for watchlist usage
                    movie.starred = false;
                });
                service.responseData = response.data; // saves data to service
                resolve(response.data);  // the return of a promise
            })
        }
  )
};

service.getMovies = () => {
    return $q(function(resolve, reject) {

    service.callTheMovieDbApi()
      .then ( (response) => {
        console.log("response of callTheMovieDbApi:");
        console.log(response);
        let movies=[];

        service.pageLimitFunction() // uses service.responseData to write page limit        
          let children = response.results; //Adjust for proper API return
            children.forEach( function(child, index) {
                let isWatchlisted = ( service.isWatchlisted(child.id) !== false );
                let movieObj = {
                title: child.title,
                poster: `https://image.tmdb.org/t/p/w185/` + child.poster_path, //Change thumbnail to appropraite return from API
                description: child.overview,  // Change permalink to appropraite return from API 
                backdrop: `https://image.tmdb.org/t/p/original/` + child.backdrop_path,
                avgVote: child.vote_average,
                releaseDate: child.release_date,
                genres: child.genre_ids, // array of genre id #s
                id: child.id,
                starred: isWatchlisted // if movie ID is in the watchlistArray, it returns a number, a number !== false, so this is "true", if it returns false, false!==false is "false".
              }
              movies.push(movieObj);
              if ( index === (children.length - 1) ){
                  service.movieList = movies;
                resolve();
              }
            })
        });
    });
  }


/* Search API interactions */

service.searchTheMovieDbApi = () => {
    return $q(function(resolve, reject){
        console.log("searchQuery:");
        console.log(service.searchQuery);
        $http.get('https://api.themoviedb.org/3/search/movie', {
        params: {
            api_key: service.api_key,
            language: "en-US",
            include_adult: false,
            page: service.queryPageNumber,
            query: service.searchQuery
        }
    })
        .then( (response)=>{
            response.data.results.forEach((movie)=>{ // this is to add starred boolean for watchlist usage
                movie.starred = false;
            });
            service.responseData = response.data; // saves data to service
            resolve(response.data);  // the return of a promise
        })
    }
)
};

service.searchMovies = () => {
return $q(function(resolve, reject) {
    service.searchTheMovieDbApi()
    .then ( (response) => {
    console.log("response of searchTheMovieDbApi:");
    console.log(response);
    let movies=[];

    service.pageLimitFunction(); // uses service.responseData to write page limit        
      let children = response.results; //Adjust for proper API return
        children.forEach( function(child, index) {
            let isWatchlisted = ( service.isWatchlisted(child.id) !== false );
            let movieObj = {
            title: child.title,
            poster: `https://image.tmdb.org/t/p/w185/` + child.poster_path, //Change thumbnail to appropraite return from API
            description: child.overview,  // Change permalink to appropraite return from API 
            backdrop: `https://image.tmdb.org/t/p/original/` + child.backdrop_path,
            // avgVote: child.vote_average,
            // releaseDate: child.release_date,
            // genres: child.genre_ids, // array of genre id #s
            id: child.id,
            starred: isWatchlisted, // if movie ID is in the watchlistArray, it returns a number, a number !== false, so this is "true", if it returns false, false!==false is "false".
            genres: child.genre_ids
        }
          movies.push(movieObj);
          if ( index === (children.length - 1) ){
              service.movieList = movies;
            resolve();
          }
        })
        console.warn(service.movieList);
    });
});
}

/* Genre Land */
    service.genreOptionArray = [];  // to populate our genre selections (check & X boxes for include/exclued)
    service.genreSelectionArray = []; // houses preferred genres (initially same as genreOptionArray)
    service.genreExclusionArray = []; // houses excluded genres, initially empty
    
        service.generateGenreArray = function (){
            $http.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${service.api_key}`)
            .then( (response)=>{ // response includes headers
                response.data.genres.forEach( genre => {
                    let genreChecked = (service.isGenreChecked(genre.id));
                    genre.include = genreChecked;
                    genre.exclude = false;
                    service.genreOptionArray.push(genre); // genre is an object containing name(string) and id(number)
                    service.genreSelectionArray.push(genre.id);
                });
                service.genreSelectionArrayToString(); // stringifys Arrays
                service.genreExclusionArrayToString();
            });
        };
        service.generateGenreArray();

        service.isGenreChecked = function(genreID){  // serches watchlist array for movie, if 
            let genreChecked = true;
            service.genreExclusionArray.forEach( (genre, index) => {
                if(genre.id === genreID){
                    genreChecked = false;
                }
            })
            return genreChecked;
        };

            // builds genreSelectionArray when user checks a desiredgenre
            service.addToGenreSelectionArray = function(genre){ // genreSelection should correspond to genre's ID
                service.genreSelectionArray.push(genre);
            };
            // searches out removedGenre and splices it from the genreSelectionArray
            service.removeFromGenreSelectionArray = function(genre){
                let target = service.genreSelectionArray.indexOf(genre);
                service.genreSelectionArray.splice(target, 1);
            };

            service.genreSelectionArrayToString = function(){
                service.genreSelection = service.genreSelectionArray.join();
            };

            service.addToGenreExclusionArray = function(genre){
                service.genreExclusionArray.push(genre);
            };

            service.removeFromGenreExclusionArray = function(genre){
                let target = service.genreExclusionArray.indexOf(genre);
                service.genreExclusionArray.splice(target, 1);
            };

            service.genreExclusionArrayToString = function(){
                service.genresNotWanted = service.genreExclusionArray.join();
            };

/*watchlist logic */

    service.watchlistArray = [];

        service.addToWatchlistArray = function(movie){ // adds movies to watchlist array from movie-list component
            service.watchlistArray.push(movie);
        };

        service.removeFromWatchlistArray = function(movie){ // removes movies from watchlistArray
            let target = service.isWatchlisted(movie.id);
            if ( target === false ) {
                alert('no');
            } else {
                service.watchlistArray.splice(target, 1);
            };
        };

        service.watchlistEditor = function(movie){
            if(movie.starred === true){ // if star is filled out, add movie to watchlist array
                movie.starred = false;
                service.removeFromWatchlistArray(movie);
            }
            else if (movie.starred === false){ // if star is empty, remove from watchlist array
                movie.starred = true;
                service.addToWatchlistArray(movie);
            };
        };

        service.isWatchlisted = function(movieID){  // serches watchlist array for movie, if found, returns index number, else returns false
            let isWatchlisted = false;
            service.watchlistArray.forEach((movie, index)=>{
                if(movie.id === movieID){
                    isWatchlisted = index;
                }
            })
            return isWatchlisted;
        };

/* movie genre id to string converter */
        service.movieObjGenreArrayToString = function(movieObj){  // builds genre list from genre id#s contained in movie objects
            service.detailedMovieGenreArray = []; // empties out previous detailed movie's genres
            movieObj.genres.forEach((genre)=>{
                switch(genre) {
                    case 28: service.detailedMovieGenreArray.push("Action"); break;
                    case 12: service.detailedMovieGenreArray.push("Adventure"); break;
                    case 16: service.detailedMovieGenreArray.push("Animation"); break;
                    case 35: service.detailedMovieGenreArray.push("Comedy"); break;
                    case 80: service.detailedMovieGenreArray.push("Crime"); break;
                    case 99: service.detailedMovieGenreArray.push("Documentary"); break;
                    case 18: service.detailedMovieGenreArray.push("Drama"); break;
                    case 10751: service.detailedMovieGenreArray.push("Family"); break;
                    case 14: service.detailedMovieGenreArray.push("Fantasy"); break;
                    case 36: service.detailedMovieGenreArray.push("History"); break;
                    case 27: service.detailedMovieGenreArray.push("Horror"); break;
                    case 10402: service.detailedMovieGenreArray.push("Music"); break;
                    case 9648: service.detailedMovieGenreArray.push("Mystery"); break;
                    case 10749: service.detailedMovieGenreArray.push("Romance"); break;
                    case 878: service.detailedMovieGenreArray.push("Science Fiction"); break;
                    case 10770: service.detailedMovieGenreArray.push("TV Movie"); break;
                    case 53: service.detailedMovieGenreArray.push("Thriller"); break;
                    case 10402: service.detailedMovieGenreArray.push("Music"); break;
                    case 10752: service.detailedMovieGenreArray.push("War"); break;
                    case 37: service.detailedMovieGenreArray.push("Western"); break;
                    default: console.error("An invalid Genre ID was input to movieObjGenreArrayToString()")
                };
            })
            service.detailedMovieGenreString = service.detailedMovieGenreArray.join(", "); // converts array into a string list
            return service.detailedMovieGenreString;
        }
/* pageLimit logic */

    service.pageLimitFunction = function(){  // makes pageLimit var equal to 1000 or max pages, whichever is less
        if(service.responseData.total_pages<1000){
            service.pageLimit = service.responseData.total_pages;
            service.queryPageLimit = service.responseData.total_pages;
        }
        else if(service.responseData.total_pages>=1000) {
            service.pageLimit = 1000;
            service.queryPageLimit = 1000;
        }
    };

}

angular
    .module("MovieApp")
    .service("MovieAppService", ["$http", "$q", MovieAppService]);