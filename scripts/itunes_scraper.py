import urllib.request
import json
import csv
import time
import uuid

terms = ["bollywood", "punjabi", "hollywood", "lofi", "arijit singh", "atif aslam", "ed sheeran", "taylor swift", "justin bieber", "honey singh", "badshah", "shreya ghoshal", "kumar sanu", "udit narayan", "lata mangeshkar", "kishore kumar", "ar rahman", "pritam", "vishal dadlani", "neha kakkar", "sonu nigam", "shaan", "kk", "b praak", "darshan raval", "armaan malik", "zayn", "dua lipa", "charlie puth", "selena gomez", "ariana grande", "billie eilish", "the weeknd", "drake", "eminem", "post malone", "travis scott", "kendrick lamar", "j cole", "bad bunny", "j balvin", "maluma", "ozuna", "daddy yankee", "rosalia", "karol g", "shakira", "jennifer lopez", "enrique iglesias", "ricky martin", "marc anthony", "romeo santos", "prince royce", "luis fonsi", "cnco", "cd9", "reik", "camila", "sin bandera", "mana", "cafe tacvba", "zoe", "molotov", "kinky"]

def scrape_itunes():
    tsv_file = "data/mega_inventory.tsv"
    
    # Read existing titles to prevent duplicates
    existing_titles = set()
    try:
        with open(tsv_file, 'r', encoding='utf-8') as f:
            reader = csv.reader(f, delimiter='\t')
            for row in reader:
                if len(row) > 1:
                    existing_titles.add(row[1].lower())
    except FileNotFoundError:
        pass

    with open(tsv_file, 'a', encoding='utf-8', newline='') as f:
        writer = csv.writer(f, delimiter='\t')
        
        total_added = 0
        for term in terms:
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
                    
                    # Highest quality cover
                    cover = item.get('artworkUrl100', '').replace('100x100bb', '600x600bb')
                    
                    if title.lower() in existing_titles:
                        continue
                        
                    # Fake YouTube URL to bypass the flutter logic
                    search_query = f"{title} {artist}".replace(' ', '+')
                    audio_url = f"https://www.youtube.com/watch?v={search_query}"
                    track_id = str(uuid.uuid4())
                    
                    writer.writerow([track_id, title, artist, album, duration_str, cover, audio_url])
                    existing_titles.add(title.lower())
                    added += 1
                    total_added += 1
                    
                print(f"Scraped {added} unique tracks for '{term}' from iTunes.")
                time.sleep(2)  # be nice to API
            except Exception as e:
                print(f"Error scraping '{term}': {e}")
                time.sleep(5)
                
        print(f"Done! Total {total_added} tracks added.")

if __name__ == "__main__":
    scrape_itunes()
