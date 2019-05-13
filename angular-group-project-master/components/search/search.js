"use strict";

function SearchController(MovieAppService, $scope, $interval, $q) { 
    const ctrl = this;
    ctrl.service = MovieAppService;

/* a watcher for all the params to refresh the page on change */

    ctrl.hasUpdated = false;

    $scope.service = MovieAppService;

    $scope.$watch('service.queryMode', function( newValue, oldValue ) { // triggers gets in respons to queryMode
        if (newValue === true){
            $scope.$watchGroup(['service.queryPageNumber'], function( newValue, oldValue ) {
                console.warn("search watcher"); // why does this run 2x on init?
                console.warn("service.queryMode=true, getting from searchMovies()");
                ctrl.queryHasUpdated = true; // triggers searchMovies on interval
            },true);
        }
        else if (newValue === false){
            $scope.$watchGroup(['service.pageNumber', 'service.vote_averageGreaterThanOrEqual', 'service.earliestReleaseDate', 'service.latestReleaseDate','service.genreSelectionArray', 'service.genresNotWanted', 'service.runTimeGreaterThanOrEqual', 'service.runTimeLessThanOrEqual', 'service.ote_averageGreaterThanOrEqual', 'service.vote_averageLessThanOrEqual'], function( newValue, oldValue ) {
                console.warn("discovery watcher"); // why does this run 2x on init?
                console.warn("service.queryMode=false, getting from getMovies()")
                ctrl.hasUpdated = true;  // triggers getMovies on interval
                ctrl.service.searchQuery = "";  // clears the searchquery for discovery mode
            },true);
        }
    },true);

    // watcher just for the discover params
    $scope.$watchGroup([, 'service.vote_averageGreaterThanOrEqual', 'service.earliestReleaseDate', 'service.latestReleaseDate','service.genreSelectionArray', 'service.genresNotWanted', 'service.runTimeGreaterThanOrEqual', 'service.runTimeLessThanOrEqual', 'service.ote_averageGreaterThanOrEqual', 'service.vote_averageLessThanOrEqual'], function( newValue, oldValue ) {
        ctrl.hasUpdated = true;  // triggers getMovies on interval
    },true);


    $interval(function(){
        if (ctrl.hasUpdated === true){ 
            ctrl.service.getMovies();
            ctrl.hasUpdated = false;
            ctrl.service.queryMode = false; // toggles off queryMode, which empties string.
        }
        if (ctrl.queryHasUpdated === true){
            ctrl.service.searchMovies();
            ctrl.queryHasUpdated = false;
        }
        if(ctrl.service.searchQuery === ""){  // this is triggering discover mode when navigating from a search more-info
            ctrl.service.queryMode = false;
        }
        if(ctrl.service.searchQuery !== ""){
            ctrl.service.queryMode = true;
        }
    }, 200);

/* genre checkbox logic */

    ctrl.genreOptionArray = ctrl.service.genreOptionArray  // will changes to ctrl.genreOptionArray affect service.genreOptionArray?
    ctrl.callGenerateGenreArray = function(){
        return ctrl.service.generateGenreArray();
    };

    ctrl.checkboxIncludeFunction = function(genre){
        genre.include = !genre.include; // toggles true/false on checkbox click - default is true
        genre.exclude = !genre.include; // ensures that if a genre is included, it is not excluded.
        if (genre.include === true){  // if genre is included, add it to the genreSelectionArray
            ctrl.service.addToGenreSelectionArray(genre.id);
        }
        if (genre.include === false){  // if genre is not included, cut it from the genreSelectionArray
            ctrl.service.removeFromGenreSelectionArray(genre.id);
        }
        if (genre.exclude === true){ // if genre is excluded, add it to the genreExclusionArray
            ctrl.service.addToGenreExclusionArray(genre.id);
        }
        if (genre.exclude === false){  // if genre isn't excluded, cut it from the genreExclusionArray
            ctrl.service.removeFromGenreExclusionArray(genre.id);
        }
        ctrl.service.genreSelectionArrayToString(); // convert the arrays to strings that can be passed as params
        ctrl.service.genreExclusionArrayToString();
    };

    ctrl.genreExclusionArray = ctrl.service.genreExclusionArray;
    ctrl.genreSelectionArray = ctrl.service.genreSelectionArray;

/* scrollbar settings */

    $scope.timevalue=0;
    $scope.timevaluemin =0;
    $scope.timevaluemax=420;
    $scope.ratingvalue=0;
    $scope.max=10;
    $scope.min=0;
    
}


angular
.module('MovieApp')  
.component('search', {
    template: `

    <h1 id="search-filter">Search Your Favorite Movie</h1>
    <input id="search-input" placeholder="Movie Name" type="text" ng-value="$ctrl.service.searchQuery" ng-model="$ctrl.service.searchQuery" ng-model-options='{ debounce: 1000 }' ng-change='$ctrl.service.searchMovies()' class="movieLength ranges"/>

    <h1 id="result-filter" ng-click="shown=!shown">Discover The Perfect Movie<h1>
    <div name="search-spec-form" id="search-spec-form" ng-hide="!shown">

        <!--Genres-->
        <div class="genre-option-box" ng-repeat="genre in $ctrl.genreOptionArray">
            <label class="genre-option">{{genre.name}}</label>
            <div class="checkbox-box">
                <label class="checkbox-container genre-inclusion-checkbox-container">
                    <input class="genre-inclusion-checkbox checkbox" type="checkbox" ng-checked="genre.include" name="genre-inclusion[]" ng-click="$ctrl.checkboxIncludeFunction(genre)" />
                </label>
            </div>
        </div>

        <!--Runtime-->
        <div class="questions">
            <div class="stuff">
                <p class="length-question">How long can you handle sitting in the dark? (in minutes)</p>
                <input class="movieLength ranges" type="range" name="range" ng-model="$ctrl.service.runTimeLessThanOrEqual" min="{{timevaluemin}}"  max="{{timevaluemax}}"> 
                <input class="lengthInput inputs" type="number" ng-model="$ctrl.service.runTimeLessThanOrEqual" min="{{timevaluemin}}"  max="{{timevaluemax}}">
            </div>
    

        <!--Rating-->
            <div class="stuff">
                <p class="rating-question">Lowest rated movie your willing to see?\n(on a scale of 0-10)</p>
                <input class="movieRatings ranges" type="range" name="range" ng-model="$ctrl.service.vote_averageGreaterThanOrEqual" min="{{min}}"  max="{{max}}">
                <input class="ratingInput inputs" type="number" ng-model="$ctrl.service.vote_averageGreaterThanOrEqual" min="{{min}}"  max="{{max}}">
            </div>
        </div>
        <button id="close-button" ng-click="shown=!shown">Collapse Filters</button>
    </div>
        `,
    controller: SearchController
});