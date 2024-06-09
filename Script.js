let currentSong=new Audio();
let songs;

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/Songs/")
    let response = await a.text();
    console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/Songs")[1])
        }
    }
    return (songs)

}

const playMusic = (track,pause=false) => {
    console.log("Track:", track); 
    currentSong.src = "/songs/" + track;
    if(!pause){
        currentSong.play();
    }
    
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
}




async function main() {
    //geting the song
     songs = await getSongs();
    playMusic(songs[0],true)
    
     //Show all the song in the playlist
    let songUL=document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs){
        songUL.innerHTML=songUL.innerHTML+ ` <li><img class="invert" src="Music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")} </div>
                                <div>Vivek</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img class="invert" src="Play.svg" alt="">

                            </div> </li>`;
   
    }
    // Atach an event listner to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            let trackName = e.querySelector(".info").firstElementChild.innerHTML;
            console.log("Track name:", trackName); // Add this line to check the track name
            playMusic(trackName);
          
        });
    });

    // Atach an event listner to play, next and prevoius

    document.getElementById("play").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            document.getElementById("play").src = "Pause.svg";
        } else {
            currentSong.pause();
            document.getElementById("play").src = "Play.svg";
        }
    });


    //listen for time update

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / 
    ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left =(currentSong.currentTime/currentSong.duration)*100+"%"
    });

    function secondsToMinutesSeconds(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;

        
    }

    // add an event for deekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100 
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime=((currentSong.duration)*percent)/100;
    });

    // add an event listner for previous and next
    previous.addEventListener("click",()=>{
        console.log(currentSong)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }

    });


    next.addEventListener("click", () => {
        console.log("next was clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index+1)>length){
            playMusic(songs[index+1])
        }

        

    });


}

main();
playMusic();

