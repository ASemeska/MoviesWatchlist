
const searchBarSubmit = document.getElementById("submit-movie")
let searchBarValue = document.getElementById("movie-name")
let container = document.getElementById("container")



searchBarSubmit.addEventListener("click", (e) =>{
    e.preventDefault()
    getMovieId()
    getFullMoviedata()
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

const getFullMoviedata = async () =>{
        let moviesId = await getMovieId() //Getting full movie info
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
        const button = document.createElement("button")
        button.innerHTML = "Add to watch list"
        button.id = fullDataArray[i].imdbID
        let title = fullDataArray[i].Title
        const buttonContainer = document.getElementById(title)
        buttonContainer.appendChild(button)
        button.addEventListener("click", function (){
            fetch(`${window.origin}/user-watchlist`, {     
                method: "POST",
                credentials: "include",
                body: JSON.stringify(button.id),
                cache: "no-cache",
                headers: new Headers({
                    "content-type": "application/json"})
            })


        }
    )}


}
 //Cia siunciamas kodas i Python

           