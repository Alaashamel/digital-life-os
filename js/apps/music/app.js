/* ============================================================
   Digital Life OS - Music Player
   Web Audio API with animated visualizer
   ============================================================ */

const MusicApp = {
    playlist: [],
    currentTrack: 0,
    isPlaying: false,
    volume: 0.7,
    window: null,
    audioContext: null,
    analyser: null,
    dataArray: null,
    canvas: null,
    animationId: null,
    
    init(window) {
        this.window = window;
        this.loadPlaylist();
        this.initAudio();
        this.render();
        Notifications.success('Music', 'Music Player launched');
    },
    
    loadPlaylist() {
        this.playlist = Storage.get('dlos_music_playlist', [
            { id: '1', title: 'Welcome', artist: 'Digital Life OS', duration: '3:45' },
            { id: '2', title: 'Synthwave Dreams', artist: 'Neon Vibes', duration: '4:22' },
            { id: '3', title: 'Digital Horizon', artist: 'Cyber Pulse', duration: '3:58' }
        ]);
    },
    
    initAudio() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.analyser = this.audioContext.createAnalyser();
                this.analyser.fftSize = 256;
                this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            } catch (e) {
                console.log('Web Audio API not available');
            }
        }
    },
    
    play() {
        this.isPlaying = true;
        this.startVisualizer();
        this.render();
    },
    
    pause() {
        this.isPlaying = false;
        this.render();
    },
    
    next() {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.render();
    },
    
    previous() {
        this.currentTrack = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
        this.render();
    },
    
    startVisualizer() {
        if (!this.canvas || !this.analyser) return;
        
        const ctx = this.canvas.getContext('2d');
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);
            
            if (this.analyser) {
                this.analyser.getByteFrequencyData(this.dataArray);
            } else {
                // Simulate frequency data if Web Audio not available
                for (let i = 0; i < this.dataArray.length; i++) {
                    this.dataArray[i] = Math.random() * 200;
                }
            }
            
            ctx.fillStyle = 'rgba(13, 13, 13, 0.2)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            const barWidth = this.canvas.width / this.dataArray.length;
            let x = 0;
            
            for (let i = 0; i < this.dataArray.length; i++) {
                const barHeight = (this.dataArray[i] / 255) * this.canvas.height;
                const hue = (i / this.dataArray.length) * 360;
                ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
                ctx.fillRect(x, this.canvas.height - barHeight, barWidth - 1, barHeight);
                x += barWidth;
            }
        };
        
        animate();
    },
    
    render() {
        const content = this.window.getContent();
        const track = this.playlist[this.currentTrack];
        
        content.innerHTML = `
            <div class=\"music-app\">
                <div class=\"player-header\">
                    <h2>Now Playing</h2>
                    <p class=\"track-title\">${track.title}</p>
                    <p class=\"track-artist\">${track.artist}</p>
                </div>
                
                <canvas id=\"visualizer\" class=\"visualizer\"></canvas>
                
                <div class=\"player-controls\">
                    <button onclick=\"MusicApp.previous()\" class=\"btn btn-icon\">⏮️</button>
                    <button onclick=\"MusicApp.${this.isPlaying ? 'pause' : 'play'}()\" class=\"btn btn-icon btn-primary\">
                        ${this.isPlaying ? '⏸️' : '▶️'}
                    </button>
                    <button onclick=\"MusicApp.next()\" class=\"btn btn-icon\">⏭️</button>
                </div>
                
                <div class=\"player-info\">
                    <span>Track ${this.currentTrack + 1}/${this.playlist.length}</span>
                    <span>${track.duration}</span>
                </div>
                
                <div class=\"playlist\">
                    <h3>Playlist</h3>
                    ${this.playlist.map((t, i) => `
                        <div class=\"playlist-item ${i === this.currentTrack ? 'active' : ''}\"
                             onclick=\"MusicApp.currentTrack = ${i}; MusicApp.render();\">
                            <span class=\"item-num\">${i + 1}</span>
                            <span class=\"item-title\">${t.title}</span>
                            <span class=\"item-artist\">${t.artist}</span>
                        </div>
                    `).join('')}
                </div>
                
                <style>
                    .music-app { display: flex; flex-direction: column; height: 100%; }
                    .player-header { text-align: center; padding: 15px; border-bottom: 1px solid var(--border-color); }
                    .player-header h2 { margin: 0; font-size: 14px; color: var(--text-secondary); }
                    .track-title { margin: 8px 0 4px 0; font-size: 16px; font-weight: 600; }
                    .track-artist { margin: 0; font-size: 12px; color: var(--text-secondary); }
                    .visualizer { width: 100%; height: 150px; margin: 15px 0; background: var(--bg-secondary); border-radius: 8px; }
                    .player-controls { display: flex; justify-content: center; gap: 10px; padding: 15px; border-bottom: 1px solid var(--border-color); }
                    .btn-primary { color: var(--accent-color); font-size: 24px; }
                    .player-info { text-align: center; font-size: 12px; color: var(--text-secondary); padding: 10px; }
                    .playlist { flex: 1; overflow-y: auto; padding: 10px; }
                    .playlist h3 { margin: 0 0 10px 0; font-size: 12px; }
                    .playlist-item { padding: 8px; background: var(--bg-tertiary); border-radius: 4px; margin-bottom: 5px; cursor: pointer; transition: all var(--transition-fast); display: flex; gap: 10px; align-items: center; }
                    .playlist-item:hover { background: var(--accent-color); color: var(--bg-primary); }
                    .playlist-item.active { background: var(--accent-color); color: var(--bg-primary); font-weight: 600; }
                    .item-num { width: 24px; text-align: center; font-size: 12px; }
                    .item-title { flex: 1; font-size: 12px; }
                    .item-artist { font-size: 10px; color: var(--text-secondary); }
                </style>
            </div>
        `;
        
        this.canvas = document.getElementById('visualizer');
        if (this.isPlaying) {
            setTimeout(() => this.startVisualizer(), 100);
        }
    }
};
