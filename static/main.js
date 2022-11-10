
const searchBarSubmit = document.getElementById("submit-movie")
let searchBarValue = document.getElementById("movie-name")
let container = document.getElementById("container")



searchBarSubmit.addEventListener("click", (e) =>{
    e.preventDefault()
    awaitMovie()
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
    console.log(data)
    movieArray = data.Search
    return movieArray

}

getMovies().catch(error => {
    error.message
})

const awaitMovie = async () =>{
    const result = await getMovies()
    console.log(result[0].Poster)
    for (entry in result){
      container.innerHTML += `<div id = "poster-container${entry}">
      <h1>${result[entry].Title}</h1>
      <p>${result[entry].Year}</p>
      <img src =${result[entry].Poster}>
      </div>
      `
    }
}