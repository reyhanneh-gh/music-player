// -------------------------accordion menu---------------------------
let li = document.querySelectorAll('.lgScreen>ul>li')
let acc = document.querySelectorAll(".accMenu")
let downIcon = document.querySelectorAll('.down')
acc.forEach((val, index) => {
    let accSub = val.querySelector('ul')
    let h = accSub.clientHeight

    accSub.style.height = '0px'
    accSub.style.paddingInline = '20px'
    accSub.style.overflow = 'hidden'
    accSub.setAttribute('data-status', 0)

    val.addEventListener('click', () => {
        let status = accSub.getAttribute('data-status')
        if (status == 0) {

            accSub.style.height = h + 'px'
            accSub.style.transition = '.5s'
            accSub.setAttribute('data-status', 1)
            val.children[1].style.transform = 'rotate(180deg)'
            val.children[1].style.transition = '.5s'

        } else {
            accSub.style.height = '0px'
            accSub.style.transition = '.5s'
            accSub.setAttribute('data-status', 0)
            val.children[1].style.transform = 'rotate(0deg)'
            val.children[1].style.transition = '.5s'

        }

    })
})

// // ------------------most played section fetch api----------------------
let mostPlayedUl = document.getElementById("mostPlayed")
let audio = document.getElementById("audio")

let cover = document.querySelector("#player>figure>img")
let songName = document.querySelector("#player>figcaption>h3")
let bandName = document.querySelector("#player>figcaption>h6")
let songDuration = document.querySelectorAll("#player>section>span")
let progressBar = document.getElementById("progress")

// btns
const playBtn = document.getElementById("play")
const prevBtn = document.getElementById("prev")
const nextBtn = document.getElementById("next")
const volBtn = document.getElementById("volBtn")
const volumeBar = document.getElementById("vol")
const repeatBtn = document.getElementById("repeatBtn")

let mySong = []
let currentIndex = 0
let isPlaying = false
let isRepeat = false

fetch("src/assets/tracks.json")
    .then(response => response.json())
    .then(data => {
        data.forEach((val, index) => {
            console.log(val)
            mySong = data

            const mostPlayedLi = document.createElement('li')
            mostPlayedLi.innerHTML = `
                <figure class="size-[40px] rounded-[5px] overflow-hidden shadow shadow-[#211212]">
                <img src="${val.image}" alt="" class="object-cover">
                </figure>
                <h5>${val.title}</h5>
                <span class="absolute right-2 top-[50%] translate-y-[-50%]">${val.duration}</span>
                `
            mostPlayedUl.appendChild(mostPlayedLi)

            // ----------------------player section--------------------------

            mostPlayedLi.addEventListener("click", () => {
                playSong(index)
            })
            // ----------------------search--------------------------
            let searchBtn = document.getElementById("searchBtn")
            let searchInp = document.getElementById("search")
            let searchSection = document.getElementById("searchSection")

            searchBtn.addEventListener("click", () => {
                let mySearch = searchInp.value.trim().toLowerCase()
                searchSection.innerHTML = ""

                let result = data.filter(song =>
                    song.title.toLowerCase().includes(mySearch) ||
                    song.artist.toLowerCase().includes(mySearch)
                )

                if (result.length === 0) {
                    searchSection.innerText = "No results found."
                    searchSection.style.display = "block"
                    return
                }

                result.forEach(resVal => {
                    let searchLi = document.createElement("li")
                    searchLi.innerHTML = `
                        <h3>${resVal.title}</h3>
                        <h4 class="text-end">${resVal.artist}</h4>
                         `
                    searchLi.addEventListener("click", () => {
                        let i = data.indexOf(resVal)
                        playSong(i)
                        searchSection.style.display = "none"
                    })

                    searchSection.appendChild(searchLi)
                })

                searchSection.style.display = "block"
            })
        })

    })
    .catch(err => {
        console.log("data not found.")

    })

function playSong(index1) {
    cover.src = mySong[index1].image
    songName.innerText = mySong[index1].title
    bandName.innerText = mySong[index1].artist
    audio.src = mySong[index1].track_link
    currentIndex = index1
    songDuration.forEach((val1, i) => {
        if (i == 1) {
            val1.innerText = mySong[index1].duration
        }
    })

    audio.play()
    playBtn.classList.remove("bi-play-fill")
    playBtn.classList.add("bi-pause-fill")
    isPlaying = true
}

playBtn.addEventListener("click", () => {
    if (!isPlaying) {
        audio.play()
        playBtn.classList.remove("bi-play-fill")
        playBtn.classList.add("bi-pause-fill")
        isPlaying = true
    } else {
        audio.pause()
        playBtn.classList.remove("bi-pause-fill")
        playBtn.classList.add("bi-play-fill")
        isPlaying = false
    }
})

prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--
        playSong(currentIndex)
    }
})

nextBtn.addEventListener("click", () => {
    if (currentIndex < mySong.length - 1) {
        currentIndex++
        playSong(currentIndex)
    }
})
// ------------------ Progress Bar ----------------------
audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100
        progressBar.style.width = percent + "%"

        let min = Math.floor(audio.currentTime / 60)
        let sec = Math.floor(audio.currentTime % 60).toString().padStart(2, "0")
        songDuration.forEach((val1, i) => {
            if (i == 0) {
                val1.innerText = min + ":" + sec
            }
        })
    }
})
progressBar.parentElement.addEventListener("click", (e) => {
    const width = e.target.clientWidth
    const clickProgress = e.offsetX
    audio.currentTime = (clickProgress / width) * audio.duration
})

// ------------------ Repeat ----------------------
repeatBtn.addEventListener("click", () => {
    if (!isRepeat) {
        repeatBtn.classList.remove("text-red-200")
        repeatBtn.classList.add("text-red-500")
        isRepeat = true
    } else {
        repeatBtn.classList.remove("text-red-500")
        repeatBtn.classList.add("text-red-200")
        isRepeat = false
    }
})


audio.addEventListener("ended", () => {
    if (isRepeat) {
        playSong(currentIndex)
    } else if (currentIndex < mySong.length - 1) {
        playSong(currentIndex + 1)
    }
})