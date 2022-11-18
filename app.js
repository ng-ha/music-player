// 1.Render songs
// 2.Scroll Top
// 3.Play/Pause/Seek 
// 4.CD rotate
// 5.Next/Prev
// 6.Random
// 7.Next/Prev when ended
// 8.Active song
// 9.Scroll active song into view
// 10.Play song when click
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'author_nguyenha'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const song = $('song')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const duration = $('.duration')
const currentTime = $('.current-time')
const volume = $('#volume')
const textVolume = $('.text-volume')
const volumeOffBtn = $('.volume-off-btn')
const volumeUpBtn = $('.volume-up-btn')
const darkModeBtn = $('#darkmode-btn')

function openOption() {
    $('.playme').classList.add('open')
    setTimeout(function() {
        $('.playme').classList.remove('open')
    },3000)
}

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    randomIndex: [],
    isRepeated: false,
    volumeSong: 100,
    isDarkMode: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key,value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    songs: [
        {
            name: 'Day One',
            singer: 'Hans Zimmer',
            path: './mp3/DayOne-HansZimmer.mp3',
            image: './img/interstella.jpg'
        },
        {
            name: 'Hymn To The Sea',
            singer: 'James Horner',
            path: './mp3/HymnToTheSea-JamesHorner.mp3',
            image: './img/hymntothesea.jfif'
        },
        {
            name: 'ABCDEFU',
            singer: 'Gayle',
            path: './mp3/abcdefu-gayle.mp3',
            image: './img/Gayle_-_ABCDEFU.png'
        },
        {
            name: 'Die For You',
            singer: 'Joji',
            path: './mp3/Die-For-You-Joji.mp3',
            image: './img/die-for-you-joji-lyrics-200.jpg'
        },
        {
            name: 'Glimpse Of Us',
            singer: 'Joji',
            path: './mp3/Glimpse-Of-Us.mp3',
            image: './img/glimpse-of-us.jfif'
        },
        {
            name: 'Cornfield Chase',
            singer: 'Hans Zimmer',
            path: './mp3/CornfieldChase-HansZimmer.mp3',
            image: './img/interstella.jpg'
        },
        {
            name: 'Head In The Clouds',
            singer: 'JustNgoc, Rion',
            path: './mp3/Head-In-The-Clouds-JustNgoc-Rion.mp3',
            image: './img/head-in-the-clouds.jfif'
        },
        {
            name: 'Late Night Talking',
            singer: 'Harry Styles',
            path: './mp3/Late-Night-Talking-Harry-Styles.mp3',
            image: './img/Harry_Styles_-_Late_Night_Talking.png'
        },
        {
            name: 'Living Hell',
            singer: 'Bella Poarch',
            path: './mp3/Living-Hell-Bella-Poarch.mp3',
            image: './img/Living-hell.jfif'
        },
        {
            name: 'S.T.A.Y',
            singer: 'Hans Zimmer',
            path: './mp3/S.t.a.y.-HansZimmer.mp3',
            image: './img/interstella.jpg'
        },
        {
            name: 'Old Love',
            singer: 'Yuri, Putri Dahlia',
            path: './mp3/Old-Love-Yuji-Putri-Dahlia.mp3',
            image: './img/old-love.jfif'
        },
        {
            name: 'Star Walkin\'',
            singer: 'Lil Nas X',
            path: './mp3/Star-Walkin-Lil-Nas-X.mp3',
            image: './img/star-walking.jfif'
        },
        {
            name: 'That\'s Hilarious',
            singer: 'Charlie Puth',
            path: './mp3/That\'s-Hilarious-Charlie-Puth.mp3',
            image: './img/thats-hilarious.jfif'
        },
        {
            name: 'When I Get Old',
            singer: 'Christopher, Chung Ha',
            path: './mp3/when-i-get-old-Christopher-chung-ha.mp3',
            image: './img/when-i-get-old.jfif'
        },
        {
            name: 'Where We\'re Going',
            singer: 'Hans Zimmer',
            path: './mp3/WhereWe\'ReGoing-HansZimmer.mp3',
            image: './img/interstella.jpg'
        }
    ],
    render: function() {
        const htmls = this.songs.map((song,index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''} ${this.isDarkMode ? 'darkmode' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option" onclick="openOption()">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this,'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
        // console.log(app.currentSong)

    },
    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        const cdThumbAnimate = cdThumb.animate([{transform: 'rotate(360deg)'}],{
            duration: 10000,
            iterations: Infinity
        })
        // console.log(cdThumbAnimate)
        cdThumbAnimate.pause()


        document.onscroll = function(e) { 
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        audio.ontimeupdate = function() {
           if (audio.duration) {
                progress.value = audio.currentTime / audio.duration * 100
           }
            const min = Math.floor(audio.currentTime / 60)
            const sec = Math.round(audio.currentTime - Math.floor(audio.currentTime / 60) * 60)
            currentTime.textContent = min.toString().padStart(2,'0') + ':' + sec.toString().padStart(2,'0')   
        }
        progress.oninput = function() {
            const seekTime = this.value * audio.duration /100
            audio.currentTime =  seekTime
        }
        nextBtn.onclick = function() {
            if (_this.isRandom) {
               _this.playRandomSong()
            } else (
                _this.nextSong()
            )
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }
        randomBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomIndex = []
            }
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom',_this.isRandom)
            this.classList.toggle('active',_this.isRandom)
        }
        repeatBtn.onclick = function() {
            _this.isRepeated = !_this.isRepeated
            _this.setConfig('isRepeated', _this.isRepeated)
            this.classList.toggle('active',_this.isRepeated)
        }
        audio.onended = function() {
            if (_this.isRepeated) {
                audio.play()
            } else{
                nextBtn.click()
            }
        }
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode && !e.target.closest('.option')) {
                _this.currentIndex = Number.parseInt(songNode.dataset.index)
                _this.setConfig('currentIndex', _this.currentIndex)
                _this.loadCurrentSong()
                _this.render()
                audio.play()
            }
        }
        volume.oninput = function() {
            audio.volume = volume.value/100
            _this.volumeSong = volume.value
            _this.setConfig('volumeSong',_this.volumeSong)
            textVolume.textContent = `Volume: ${volume.value}`
            textVolume.classList.add('active')
            setTimeout(function() {
                textVolume.classList.remove('active')
            },800)
        }
        audio.onvolumechange = function() {
            volume.value = audio.volume * 100
            _this.volumeSong = volume.value
            _this.setConfig('volumeSong',_this.volumeSong)
            textVolume.textContent = `Volume: ${volume.value}`
            textVolume.classList.add('active')
            setTimeout(function() {
                textVolume.classList.remove('active')
            },800)
        }
        volumeOffBtn.onclick = function() {
            volume.value = 0
            audio.volume = volume.value
            _this.volumeSong = volume.value
            _this.setConfig('volumeSong',_this.volumeSong)
            textVolume.textContent = `Volume: ${volume.value}`
            textVolume.classList.add('active')
            setTimeout(function() {
                textVolume.classList.remove('active')
            },800)
        }
        volumeUpBtn.onclick = function() {
            volume.value = 100
            audio.volume = 1
            _this.volumeSong = volume.value
            _this.setConfig('volumeSong',_this.volumeSong)
            textVolume.textContent = `Volume: ${volume.value}`
            textVolume.classList.add('active')
            setTimeout(function() {
                textVolume.classList.remove('active')
            },800)
        }
        darkModeBtn.onclick =function() {
            _this.isDarkMode = !_this.isDarkMode
            _this.setConfig('isDarkMode',_this.isDarkMode)
            _this.toggleDarkMode()
        }
        $('.info-btn').onclick = function() {
            $('.modal').classList.toggle('open')
        }
        $('.modal button').onclick = function() {
            $('.modal').classList.remove('open')
        }
    },
    toggleDarkMode: function() {
        
        darkModeBtn.classList.toggle('darkmode',this.isDarkMode)
        $('.dashboard').classList.toggle('darkmode',this.isDarkMode)
        $('header h2').classList.toggle('darkmode',this.isDarkMode)
        $$('.control .btn').forEach(function(a) {
            a.classList.toggle('darkmode',app.isDarkMode)
        })
        $('.volume-off-btn').classList.toggle('darkmode',this.isDarkMode)
        $('.volume-up-btn').classList.toggle('darkmode',this.isDarkMode)
        $('.current-time').classList.toggle('darkmode',this.isDarkMode)
        $('.duration').classList.toggle('darkmode',this.isDarkMode)
        $$('.song').forEach(function(a) {
            a.classList.toggle('darkmode',app.isDarkMode)
        })
        $('.main').classList.toggle('darkmode',this.isDarkMode)
        $('html').classList.toggle('darkmode',this.isDarkMode)

    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        },300) 
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom || false
        this.isRepeated = this.config.isRepeated || false
        randomBtn.classList.toggle('active',this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeated)

        this.volumeSong = this.config.volumeSong || 100
        audio.volume =  this.volumeSong/100
        volume.value = this.volumeSong 

        this.currentIndex = this.config.currentIndex || 0
        this.isDarkMode = this.config.isDarkMode || false
        this.toggleDarkMode()
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        
        audio.onloadedmetadata = function() {
            const min = Math.floor(audio.duration / 60)
            const sec = Math.round(audio.duration - Math.floor(audio.duration / 60) * 60)
            duration.textContent = min.toString().padStart(2,'0') + ':' + sec.toString().padStart(2,'0')
            console.log('loaded metadata, audio duration:',audio.duration)
        }
    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.setConfig('currentIndex', this.currentIndex)
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.setConfig('currentIndex', this.currentIndex)
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        if (this.randomIndex.length === this.songs.length - 1) {
            this.randomIndex = []
        }
        this.randomIndex.push(this.currentIndex)
        do {
            newIndex = Math.floor(Math.random() * (this.songs.length)) 
        } while (this.randomIndex.includes(newIndex))
        console.log(this.randomIndex)
        this.currentIndex = newIndex
        this.setConfig('currentIndex', this.currentIndex)
        this.loadCurrentSong()

    },
    start: function() {
        this.defineProperties()
        this.handleEvents()

        this.loadConfig()
        this.loadCurrentSong()
        this.render()
    },


}

app.start()
