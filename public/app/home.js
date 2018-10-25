const collectionTitle = document.querySelectorAll(".collection__title")
const collectionContent = document.querySelectorAll(".collection__content")
const searchForm =  document.querySelectorAll(".search")
const searchBtn =  document.querySelectorAll(".search__button")
const contentTitle = document.querySelector(".content__title")
const content = document.querySelector(".content")
let page = 1
let dbSearchMovie =debounce(()=>handleScoll(handleSearch))


function handleClick(){
    collectionContent.forEach(content=>{
        content.classList.add("hide")
    })
    this.parentElement.querySelector(".collection__content").classList.remove("hide")
}

function createContetCard(data){
    const movieCard = document.createElement("div")
    movieCard.classList.add("content__card")
    movieCard.classList.add("hide")
    movieCard.id = data.id
    movieCard.innerHTML=`
    <div class="placeholder" >
        <img src="https://image.tmdb.org/t/p/w300/${data.poster_path}" alt="no pic" class="content__card__img">
    </div>
    <h3 class="content__card__title">${data.original_title}</h3>
    <label>
        <input type="checkbox" class="content__card__text_toggle" hidden>
        <p class="content__card__text">${data.overview}</p>
    </label>
    `
    content.appendChild(movieCard)
    movieCard.querySelector(".placeholder").addEventListener("click",handleMoreInfo)
    movieCard.querySelector(".content__card__title").addEventListener("click",handleMoreInfo)
    setTimeout(()=>{
        movieCard.classList.remove("hide")
    },200)
}

function handleSearch(e){
    const url ="/searchMovie"
    const contentCard = document.querySelectorAll(".content__card")
    if(this.parentElement){
        movie = this.parentElement.querySelector(".search__input").value
        e.preventDefault()
        this.parentElement.querySelector(".search__input").value =""
        contentCard.forEach(card=>card.classList.add("hide"))
        setTimeout(()=>{
            contentCard.forEach(card=>card.remove())
        },500)
        contentTitle.textContent=`serach result for "${movie}"`
        contentTitle.appendChild(document.createElement("hr"))
    }
    fetch(`${url}/${movie}/${page}`)
    .then(res=> {
        if(page===1)content.innerHTML=""
        if (res.status >= 400 && res.status < 600) {
            throw new Error("Bad response from server");
        } 
        return res.json();
    })
    .then(res=>{
        if(res.total_results === 0){
            const blank =document.createElement("div")
            blank.style.height = "100vh"
            content.appendChild(blank)
        }
        res.results.forEach(data=>createContetCard(data))
        window.addEventListener("scroll", dbSearchMovie)
    })
    .catch(err=>{
        const blank =document.createElement("div")
        blank.style.height = "100vh"
        content.appendChild(blank)
        console.log(err)
    })
}
function handleMoreInfo(){
    const id = this.parentElement.id
    show.classList.remove("hide")
    showContent.innerHTML=""   
    showContent.innerHTML=""   
    const url =`/getVideo/${id}`
    fetch(url)
    .then(res=>res.json())
    .then(res=>{
        if(res.results.length===0){
            showContent.innerHTML = "NOT FOUND VIDEO "
        }
        res.results.forEach(video=>{
            const videoCard = document.createElement("iframe")
            videoCard.classList.add("show__content__card")
            videoUrl = `https://www.youtube.com/embed/${video.key}`
            videoCard.src = videoUrl
            showContent.appendChild(videoCard)
        })
    })
}

searchBtn.forEach(btn=>{
    btn.addEventListener("click", handleSearch)
    btn.addEventListener("click", ()=>{page=1})
    btn.addEventListener("click", ()=>{
        window.removeEventListener("scroll", dbSearchMovie)
    })
    btn.addEventListener("click",()=>window.scrollTo({top: 0,}))
})

collectionTitle.forEach(title=>{
    title.addEventListener("click",handleClick)
})

function debounce(func, wait=50, immediate = true){
    var timeout;
    return function(){
        var context = this, args= arguments;
        var later = function(){
            timeout = null
            if(!immediate) func.apply(context, args)
        }
        var callNow = immediate && !timeout;
        clearTimeout(timeout)
        timeout = setTimeout(later, wait);
        if(callNow) func.apply(this, args)
    }
}