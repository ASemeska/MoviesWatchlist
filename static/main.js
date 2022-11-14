
const searchBarSubmit = document.getElementById("submit-movie")
let searchBarValue = document.getElementById("movie-name")
let container = document.getElementById("container")
const watchlistBtn = document.getElementById("watchlist-btn")
const watchlistArray = []




searchBarSubmit.addEventListener("click", (e) =>{
    e.preventDefault()
    getFullMoviedata(getMovieId())
    container.innerHTML = ""
    searchBarValue.value = ""  
    
})

const getMovies = async () =>{
    let response = await fetch(`http://www.omdbapi.com/?s=${searchBarValue.value}&apikey=33902d14
    `)
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`
        throw new Error(message)   
    }
    let data = await response.json()
    if(data.Response == 'False'){
        const displayMessage = `An error has occured: ${data.Error} Please search again`
        container.innerHTML = displayMessage
    }
    movieArray = data.Search
    return movieArray

}

const getMovieId = async () =>{  //Getting movie id
    let result = await getMovies()
    let moviesIdList = []
    for (entry in result){
        moviesIdList.push(result[entry].imdbID)
    }
    
    return moviesIdList
}

class MoviePost{
    constructor(title, director,actors, released, imdbRating, runtime, plot, poster, imdbID){
       this.title = title
       this.director = director
       this.actors = actors
       this.released = released
       this.imdbRating = imdbRating
       this.runtime = runtime
       this.plot = plot
       this.poster = poster
       this.imdbID = imdbID
    }
    getMovieHtml(){
        const {title, director,actors, released, imdbRating, runtime, plot, poster,imdbID,} = this
        return `
            <div id = "${title}">
            <h1>${title}</h1>
            <h2>${director}</h1>
            <img src="${poster}" alt="Movie poster">
            <p>Cast: ${actors} Released: ${released} Runtime: ${runtime} Rating: ${imdbRating}</p> 
            <p>${plot}</p>
            </div>
        `
        
    }
}


const getFullMoviedata = async (i) =>{
    let moviesId = await i //Getting full movie info
    let fullDataArray = []
    for (let id in moviesId){
       let response = await fetch (`http://www.omdbapi.com/?i=${moviesId[id]}&apikey=33902d14`)
       let data = await response.json()
       fullDataArray.push(data)
    }
    
    fullDataArray.forEach((movie) => {
        let post = new MoviePost(movie.Title,movie.Director, movie.Actors, movie.Released, movie.imdbRating,movie.Runtime,movie.Plot,movie.Poster, movie.imdbID)
        container.innerHTML += post.getMovieHtml()
    })
    
    for(let i = 0; i < 10; i++){
        console.log(fullDataArray[i].Title)
        const button_create = document.createElement("button")
        const button_delete = document.createElement("button")
        button_create.innerHTML = "Add to watch list"
        button_delete.innerHTML = "Remove from watchlist"
        button_create.value = fullDataArray[i].imdbID
        button_delete.value = fullDataArray[i].imdbID
        button_create.id = "button_create-"+fullDataArray[i].imdbID
        button_delete.id = "button_delete-"+fullDataArray[i].imdbID
        let title = fullDataArray[i].Title
        const buttonContainer = document.getElementById(title)
        buttonContainer.appendChild(button_create)
        buttonContainer.appendChild(button_delete)
        button_create.addEventListener("click", () =>{
            fetch(`${window.origin}/user-watchlist`, {     
                method: "POST",
                credentials: "include",
                body: JSON.stringify(button_create.value),
                cache: "no-cache",
                headers: new Headers({
                    "content-type": "application/json"})
            })
            button_create.style.display ="none"
            button_delete.style.display = "block"
        })
        button_delete.addEventListener("click", () =>{
            fetch(`${window.origin}/remove-user-watchlist`, {     
                method: "POST",
                credentials: "include",
                body: JSON.stringify(button_delete.value),
                cache: "no-cache",
                headers: new Headers({
                    "content-type": "application/json"})
            })
            button_delete.style.display ="none"
            button_create.style.display = "block"
        })


    }

}

// Watchlist //

watchlistBtn.addEventListener("click", async () =>{
    await getFullMoviedata(fetchBackEndData())


})

const fetchBackEndData = async () =>{
    let response = await fetch(`${window.origin}/display-watchlist`)
    let data = await response.json()
    uniqueEntries = [...new Set(data.map(a => a))]
    return uniqueEntries
}
// const fetchBackEndData = () =>{
//   let movieId = JSON.parse("{{ response | tojson | safe}}")
//   console.log(movieId)
// }

