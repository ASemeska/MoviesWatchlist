
const searchBarSubmit = document.getElementById("submit-movie")
let searchBarValue = document.getElementById("movie-name")
let container = document.getElementById("container")
const watchlistBtn = document.getElementById("watchlist-btn")
const loader = document.getElementById("tetrominos")
loader.style.display= "none"

const watchlistArray = []



searchBarSubmit.addEventListener("click", async (e) =>{
    e.preventDefault()
    enableLoader()
    await getFullMoviedata(getMovieId())
    disableLoader()
    searchBarValue.value = "" 
    

})


const enableLoader = () =>{
    console.log("Tuscia")
    loader.style.display = "block"
}

const disableLoader = () =>{
    if(container.innerHTML != ""){
        loader.style.display = "none"
            if(loader.style.display= "none"){
                searchBarSubmit.addEventListener("click", () => container.innerHTML = "" )
        }
    }
    else{
        console.log("rip")
    }    
}





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
            <div id = "${title}" class="post-container">
                <div class="post-content-container">
                    <div class ="title-direcctor">
                        <h1 class = "title">${title}</h1>
                        <h2 class = "director">${director}</h1>
                    </div>
                    <img src="${poster}" alt="Movie poster">
                    <p class = "small-text">Cast: ${actors} <br><br> Released: ${released} <br><br> Runtime: ${runtime} <br><br> Rating: ${imdbRating} ⭐ <br><br> Movie Plot: ${plot}</p> 
                </div>
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
        const button_create = document.createElement("button")
        const button_delete = document.createElement("button")
        button_create.innerHTML = "Add to watch list"
        button_delete.innerHTML = "Remove from watchlist"
        button_create.value = fullDataArray[i].imdbID
        button_delete.value = fullDataArray[i].imdbID
        button_create.className = "btn btn-secondary post-content-container-btn"
        button_delete.className = "btn btn-danger post-content-container-btn"
        button_delete.style.display = "none"
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

