import urllib.request
import json
import sqlite3
import time
import uuid
import random
import string

def get_random_query():
    length = random.choice([1, 2, 3])
    return ''.join(random.choices(string.ascii_lowercase, k=length))

def scrape_infinite():
    db_path = "data/inventory.db"
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    print(f"Starting infinite scraper (Writing to SQLite database)...")

    while True:
        cursor.execute("SELECT COUNT(*) FROM tracks")
        total = cursor.fetchone()[0]
        if total >= 100000:
            print(f"Goal reached! Total tracks: {total}. Stopping scraper.")
            break
            
        term = get_random_query()
        try:
            url = f"https://itunes.apple.com/search?term={urllib.parse.quote(term)}&media=music&limit=200"
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            response = urllib.request.urlopen(req)
            data = json.loads(response.read().decode('utf-8'))
            
            added = 0
            for item in data.get('results', []):
                title = item.get('trackName', '')
                artist = item.get('artistName', '')
                album = item.get('collectionName', 'Unknown Album')
                duration_ms = item.get('trackTimeMillis', 0)
                
                if not title or not artist or duration_ms == 0:
                    continue
                    
                duration_s = duration_ms // 1000
                mins = duration_s // 60
                secs = duration_s % 60
                duration_str = f"{mins}:{secs:02d}"
                
                cover = item.get('artworkUrl100', '').replace('100x100bb', '600x600bb')
                
                # Check for duplicates in sqlite
                cursor.execute("SELECT id FROM tracks WHERE title = ? AND artist = ?", (title, artist))
                if cursor.fetchone():
                    continue
                    
                search_query = f"{title} {artist}".replace(' ', '+')
                audio_url = f"https://www.youtube.com/watch?v={search_query}"
                track_id = str(uuid.uuid4())
                
                cursor.execute('INSERT INTO tracks VALUES (?, ?, ?, ?, ?, ?, ?)', 
                               (track_id, title, artist, album, duration_str, cover, audio_url))
                # Add to FTS
                cursor.execute('INSERT INTO tracks_fts(rowid, title, artist) VALUES (last_insert_rowid(), ?, ?)',
                               (title, artist))
                added += 1
                
            conn.commit()
            print(f"Scraped {added} unique tracks for random query '{term}'")
            time.sleep(1)
        except Exception as e:
            print(f"Error scraping '{term}': {e}")
            time.sleep(5)

if __name__ == "__main__":
    scrape_infinite()
