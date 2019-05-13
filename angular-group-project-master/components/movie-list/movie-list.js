"use strict";

function MovieListController(MovieAppService, $interval) {

    const ctrl = this;
    ctrl.service = MovieAppService;
    ctrl.movieList = ctrl.service.movieList;

/* page forward/back functions */
/* discovery page functions */
    ctrl.pageBack = function(){
        console.log("pageBack() pressed")
            if (ctrl.service.pageNumber>1){
            ctrl.service.pageNumber -= 1;
            }
            if (ctrl.service.pageNumber<=1){
                console.error("1 is the lowest possible page number")
            }
            if(ctrl.service.pageNumber>=ctrl.service.pageLimit){
                console.log(ctrl.service.pageNumber);
                console.error("There aren't that many pages! You might want to enter a lower value in the page search.")
            }
    };

    ctrl.pageForward = function(){
        console.log("pageForward() pressed");
            console.log(`ctrl.service.queryMode: ${ctrl.service.queryMode}\nctrl.service.pageNumber: ${ctrl.service.pageNumber}\nctrl.service.pageLimit${ctrl.service.pageLimit}`);
            if(ctrl.service.pageNumber<ctrl.service.pageLimit){
                ctrl.service.pageNumber += 1;
            }
            else if(ctrl.service.pageNumber>=ctrl.service.pageLimit){
                console.error("There aren't that many available pages!")
            }
    }

/* search page functions */

ctrl.searchPageBack = function(){
    console.log("searchPageBack() pressed")
        if (ctrl.service.queryPageNumber>1){
        ctrl.service.queryPageNumber -= 1;
        console.log(`ctrl.service.queryMode: ${ctrl.service.queryMode}\nctrl.service.queryPageNumber: ${ctrl.service.queryPageNumber}\nctrl.service.pageLimit${ctrl.service.pageLimit}`);
        ctrl.service.searchMovies(); // because I can't get the watcher to trigger on queryPageNumber change    
    }
        if (ctrl.service.queryPageNumber<=1){
            console.error("1 is the lowest possible page number")
        }
        if(ctrl.service.queryPageNumber>=ctrl.service.pageLimit){
            console.log(ctrl.service.queryPageNumber);
            console.error("There aren't that many pages! You might want to enter a lower value in the page search.")
        }
};

ctrl.searchPageForward = function(){
    console.log("searchPageForward() pressed");
        // console.log(`ctrl.service.queryMode: ${ctrl.service.queryMode}\nctrl.service.queryPageNumber: ${ctrl.service.queryPageNumber}\nctrl.service.pageLimit${ctrl.service.pageLimit}`);
        if(ctrl.service.queryPageNumber<ctrl.service.pageLimit){
            ctrl.service.queryPageNumber += 1;
            console.log(`ctrl.service.queryMode: ${ctrl.service.queryMode}\nctrl.service.queryPageNumber: ${ctrl.service.queryPageNumber}\nctrl.service.pageLimit${ctrl.service.pageLimit}`);
            ctrl.service.searchMovies(); // because I can't get the watcher to trigger on queryPageNumber change    
        }
        else if(ctrl.service.queryPageNumber>=ctrl.service.pageLimit){
            console.error("There aren't that many available pages!")
        }
}

/* watchlist button - moved logic to service for use by watch-list component*/

    ctrl.watchlistEditor = ctrl.service.watchlistEditor

/* movie list generator - moved logic to service for reference by search module*/

    ctrl.movieList = ctrl.service.movieList;
    ctrl.getMovies = ctrl.service.getMovies
     
/* more info functions */

    ctrl.infoFunction = function(movie){ // saves selected movie to service as href directs to moreInfo route
        ctrl.service.detailedMovie = []; // clears out any previous movies pushed in.
        ctrl.service.detailedMovie.push(movie);  // adds the new movie obj to the array
    };

}

angular
.module('MovieApp')  
.component('movieList', {
    template: `
    <!--Movie Display (title, poster, rating, description)-->
    <div id="movie-list-container">
        <div class="movie-post" ng-repeat="movie in $ctrl.service.movieList">
            <div class="title-container">
                <h1 class="movie-title title" ng-click="show=!show">{{movie.title}}</h1>
                <div class="spacer"></div>
                <div class="star-container">
                    <i class="material-icons star" ng-hide="movie.starred" ng-click="$ctrl.watchlistEditor(movie)">star_border</i>
                    <i class="material-icons star" ng-show="movie.starred" ng-click="$ctrl.watchlistEditor(movie)">star</i>
                </div>
            </div>
            
            <img class="movie-poster image" id="more" alt="movie poster" ng-src="{{movie.poster}}" fallback-src="https://www.kargomaster.com/pub/media/catalog/product/placeholder/default/sorry-image-not-available.jpg" ng-click="show=!show"></img>
            <a class = "more-info" href="#!/moreInfo" ng-click="$ctrl.infoFunction(movie)">More Info</a>

            <p class ="movie-description description" ng-hide="!show">Synopsis:\n{{movie.description}}</p>
        </div>
    </div>

    <!--Discovery Page Number Selector-->
    <div id="page-number-container" ng-if="!$ctrl.service.queryMode">
        <div id="page-box-1">
            <p id="page-limit-text">(Discovery) Page Limit: {{$ctrl.service.pageLimit}}</p>

        </div>
        <div id="page-box-2">
            <i class="material-icons arrows" ng-click="$ctrl.pageBack()">arrow_back</i>
            <input id="page-selection-input" type="number" min="1" max="{{$ctrl.service.pageLimit}}" step="1" ng-model="$ctrl.service.pageNumber" ng-value="$ctrl.service.pageNumber">
            <i class="material-icons arrows" ng-click="$ctrl.pageForward()">arrow_forward</i>
        </div>
    </div>

    <!--Search Page Number Selector-->
    <div id="page-number-container" ng-if="$ctrl.service.queryMode">
        <div id="page-box-1">
            <p id="page-limit-text">(Search) Page Limit: {{$ctrl.service.responseData.total_pages}}</p>

        </div>
        <div id="page-box-2">
            <i class="material-icons arrows" ng-click="$ctrl.searchPageBack()">arrow_back</i>
            <input id="page-selection-input" type="number" min="1" max="{{$ctrl.service.responseData.total_pages}}" step="1" ng-value="$ctrl.service.queryPageNumber" ng-model="$ctrl.service.queryPageNumber" ng-model-options='{ debounce: 200 }' ng-change='$ctrl.service.searchMovies()'>
            <i class="material-icons arrows" ng-click="$ctrl.searchPageForward()">arrow_forward</i>
        </div>
    </div>
        `,
    controller: MovieListController
});