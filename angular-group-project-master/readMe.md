Here's our Rubric, we have chosen the movie option.

ANGULAR PROJECT: MOVIE OPTION

Task: Use The Movie DB API to build an Angular app for searching and saving movies.

API: https://www.themoviedb.org/documentation/api

Build Specifications
1. Allow users to filter movies based on at least three criteria (e.g.: rating, genre, length).
    genre: checkboxes to include/exclude movies
    length & rating - scrollbars and input fields

2. Display movies that match the user’s selected criteria.
    watchlist page - this functinality has been achieved in search2 branch

3. Allow users to select individual movies to see more details.
    we show/hide the movie synopsis by use of ngShow/ngHide, perhaps more information should be given?

4. Allow users to mark moves from the results for a watchlist.
    watchlist array that is built from user selction - in the service

5. Include a separate route where users can
    a. See a list of movies they’ve marked for the watchlist
        this has been achieved with watchlist tab
    b. Select individual movies to see more details
        "More Details" link on the posts which populate a page with all the movie specific data
    c. Remove items from the watchlist
        Achieved on search2 w/ watchlist.

6. Do not implement log in. Built as if a user is already logged in.
        completely ignore this point?

7. Use at least three components:
    a. searchCriteria the criteria selection
    b. movieList for the list of results
    c. watchlistPage for the watchlist route

8. Must have a good user experience on desktop browsers. Mobile styling is not required.
    check - don't use this on mobile


Wishlist:
    scrollbars, more params (search box?)
    
    search by movie name - in progress
    
    Videos:
        https://www.themoviedb.org/talk/5451ec02c3a3680245005e3c?language=en-US
        https://api.themoviedb.org/3/movie/157336/videos?api_key=1524464cc72ee93f90022d132d1d2e44
        https://www.youtube.com/watch?v={{video key}} - if its youtube

BugHunt:
    after searching, on routing - query mode remains activated, but the ng-repeat repopulates with discovery    titles and not query titles

    query mode deactivates when search field is emptied, but doesn't repopulate the ng-repeat
    

Notes on searchBranch:
    the watch function is overriding the search function ... will need to find a way to page through the search results w/o resetting the search results, perhaps modified pageforward/backward functions?
    more thoughts:  use an alt pageNumber tracker for pageforward/backward functions, maybe a discover/search toggle for showing movie results?  if service.searchQuery = "", discovery: true, else discovery: false?