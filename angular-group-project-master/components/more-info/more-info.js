"use strict";

function MoreInfoController(MovieAppService) {

    const ctrl = this;
    ctrl.service = MovieAppService;
    ctrl.watchlistEditor = ctrl.service.watchlistEditor;
    
    }

angular
.module('MovieApp')  
.component('moreInfo', {
    template: `
    <div id="detailed-movie-container" ng-repeat="movie in $ctrl.service.detailedMovie">

        <!-- absolutely positioned elements -->
        <img id="detailed-backdrop" ng-src="{{movie.backdrop}}"> <!-- page background? -->

        <!-- relatively positioned elements -->
        <div id="detailed-info-pane"> <!-- translucent white background? -->
            <div class="star-container" id="detailed-star-container">
                <i class="material-icons star" id="detailed-star-empty" ng-hide="movie.starred" ng-click="$ctrl.watchlistEditor(movie)">star_border</i>
                <i class="material-icons star" id="detailed-star-full" ng-show="movie.starred" ng-click="$ctrl.watchlistEditor(movie)">star</i>
            </div>
            <h1 class="movie-title title" id="detailed-title">{{movie.title}}</h1>
            <p class ="movie-description description" id="detailed-movie-description">{{movie.description}}</p>
            <p id="detailed-genres">Genres: <span class="detailed-genre-list">{{$ctrl.service.movieObjGenreArrayToString(movie)}}</span><p>
            <p id="detailed-vote-avg">User Rating: {{movie.avgVote}}</p>
        </div>
    </div>
        `,
    controller: MoreInfoController
});