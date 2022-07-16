const formInput = document.getElementById("form-container")
const searchBar = document.getElementById("movie-name")
const postsContainer = document.getElementById("posts-container")
const emptyImg = document.getElementById("empty-img")
const emptyContainer = document.getElementById("empty-container")
let postsArray = []



formInput.addEventListener("click", (e) =>{
    console.log("clicked")
    e.preventDefault()
    fetch(`http://www.omdbapi.com/?s=${searchBar.value}&apikey=33902d14`)
    .then(res => res.json())
    .then(data =>{
        let foundData = data.Search
        for( i = 0 ; i < 10; i++){
            let idValue = foundData[i].imdbID
            fetch(`http://www.omdbapi.com/?i=${idValue}&apikey=33902d14`)
            .then(res => res.json())
            .then(data =>{
                postsArray.push(data)
                renderPosts()   
                
            })
        }
        searchBar.value = ""
        console.log(postsArray)
})
   
})

const renderPosts = () =>{
    let html = ""
    emptyImg.style.display ="none"
    emptyContainer.style.display = "none"
    for(let post of postsArray){
        html += `
        <h3 class "title">${post.Title}</h3>
        
        `
    }
    postsContainer.innerHTML = html  
}
