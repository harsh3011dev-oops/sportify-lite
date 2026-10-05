// Variables
const trackGrid = document.getElementById('track-grid');
const loader = document.getElementById('loader');
const trackCountEl = document.getElementById('track-count');
const searchInput = document.getElementById('search-input');

// Audio Player Elements
const audio = document.getElementById('audio-element');
const playPauseBtn = document.getElementById('play-pause-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const volumeBar = document.getElementById('volume-bar');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playerCover = document.getElementById('player-cover');

let currentTracks = [];
let isPlaying = false;

// 1. Fetch and Parse TSV Data
async function loadCatalog() {
    try {
        // Fetch the TSV file (Assuming simple HTTP server)
        const response = await fetch('./data/catalog_inventory.tsv');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const text = await response.text();
        parseTSV(text);
    } catch (error) {
        console.error('Error loading catalog:', error);
        loader.innerHTML = '<p style="color:red">Error loading data. Run Python server: `python3 -m http.server`</p>';
    }
}

function parseTSV(tsv) {
    const lines = tsv.split('\n');
    const headers = lines[0].split('\t');
    
    const tracks = [];
    
    // Parse up to 200 tracks for the prototype UI to avoid DOM overload
    for (let i = 1; i < lines.length && i < 201; i++) {
        const line = lines[i];
        if (!line.trim()) continue;
        
        const values = line.split('\t');
        if (values.length >= 10) {
            tracks.push({
                serial_no: values[0],
                id: values[1],
                title: values[2],
                artist: values[3],
                album: values[4],
                language: values[6],
                genre: values[7],
                audio_url: values[9],
                cover_url: values[10] || 'https://via.placeholder.com/200'
            });
        }
    }
    
    currentTracks = tracks;
    trackCountEl.textContent = lines.length - 2; // Real TSV total
    
    renderTracks(tracks);
}

// 2. Render UI
function renderTracks(tracks) {
    loader.style.display = 'none';
    trackGrid.innerHTML = '';
    
    tracks.forEach((track, index) => {
        const card = document.createElement('div');
        card.className = 'track-card';
        card.onclick = () => playTrack(track);
        
        // Ensure image URL is clean
        const cover = track.cover_url.startsWith('http') ? track.cover_url : 'https://via.placeholder.com/200';
        
        card.innerHTML = `
            <div class="track-cover-wrapper">
                <img src="${cover}" alt="Cover" class="track-cover" onerror="this.src='https://via.placeholder.com/200'">
                <div class="play-overlay">
                    <i class="fa-solid fa-circle-play"></i>
                </div>
                <div class="track-badge">${track.language}</div>
            </div>
            <h4 class="track-title">${track.title}</h4>
            <p class="track-artist">${track.artist}</p>
        `;
        
        trackGrid.appendChild(card);
    });
}

// 3. Audio Hot-Linking & Playback
function playTrack(track) {
    // Zero-Cost Hot-Linking Magic happens here
    audio.src = track.audio_url;
    audio.play();
    
    // Update Player UI
    playerTitle.textContent = track.title;
    playerArtist.textContent = track.artist;
    playerCover.src = track.cover_url.startsWith('http') ? track.cover_url : 'https://via.placeholder.com/60';
    
    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    isPlaying = true;
}

playPauseBtn.onclick = () => {
    if (!audio.src) return;
    
    if (isPlaying) {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    } else {
        audio.play();
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }
    isPlaying = !isPlaying;
};

// Progress Bar
audio.ontimeupdate = () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress || 0;
    
    currentTimeEl.textContent = formatTime(audio.currentTime);
    if(audio.duration) {
        totalTimeEl.textContent = formatTime(audio.duration);
    }
};

progressBar.onchange = () => {
    const time = (progressBar.value / 100) * audio.duration;
    audio.currentTime = time;
};

// Volume
volumeBar.onchange = () => {
    audio.volume = volumeBar.value / 100;
};

// Search (Client-side fast search)
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = currentTracks.filter(t => 
        t.title.toLowerCase().includes(term) || 
        t.artist.toLowerCase().includes(term) ||
        t.language.toLowerCase().includes(term)
    );
    renderTracks(filtered);
});

// Helper
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Init
loadCatalog();
