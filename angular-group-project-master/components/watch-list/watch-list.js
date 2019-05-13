"use strict";

function WatchListController(MovieAppService) { 
    const ctrl = this;
    const service = MovieAppService;
    ctrl.watchlistArray = service.watchlistArray;
    ctrl.watchlistEditor = service.watchlistEditor

    /* more info */
    ctrl.infoFunction = function(movie){ // saves selected movie to service as href directs to moreInfo route
        service.detailedMovie = []; // clears out any previous movies pushed in.
        service.detailedMovie.push(movie);  // adds the new movie obj to the array
    };
}

angular
.module('MovieApp')  
.component('watchList', {
    template: `
    <!--Watchlist-->
    <div id="watchlist-container">
        <div class="movie-post" ng-repeat="movie in $ctrl.watchlistArray">
        <div class="title-container">
            <h1 class="movie-title title" ng-click="show=!show">{{movie.title}}</h1>
            <div class="spacer"></div>
            <div class="star-container">
                <i class="material-icons star" ng-hide="movie.starred" ng-click="$ctrl.watchlistEditor(movie)">star_border</i>
                <i class="material-icons star" ng-show="movie.starred" ng-click="$ctrl.watchlistEditor(movie)">star</i>
            </div>
        </div>

        <img class="movie-poster image" alt="movie poster" ng-src="{{movie.poster}}" ng-click="show=!show" fallback-src="../assets/sorry-image-not-available.jpg"></img>
        <p class ="movie-description description" ng-hide="!show">Synopsis:\n{{movie.description}}</p>
        <a class = "more-info" href="#!/moreInfo" ng-click="$ctrl.infoFunction(movie)">More Info...</a>
        </div>
    </div>
        `,
    controller: WatchListController
});