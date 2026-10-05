import sqlite3
import csv
import sys
import os

def migrate():
    tsv_path = 'data/mega_inventory.tsv'
    db_path = 'data/inventory.db'

    if not os.path.exists(tsv_path):
        print("TSV file not found.")
        sys.exit(1)

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Create tables
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS tracks (
        id TEXT PRIMARY KEY,
        title TEXT,
        artist TEXT,
        album TEXT,
        duration TEXT,
        cover_url TEXT,
        audio_url TEXT
    )
    ''')

    cursor.execute('''
    CREATE VIRTUAL TABLE IF NOT EXISTS tracks_fts USING fts5(
        title,
        artist,
        content='tracks',
        content_rowid='rowid'
    )
    ''')

    # Read and insert data
    print("Reading TSV...")
    count = 0
    with open(tsv_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter='\t')
        
        # Prepare batch insert
        tracks_data = []
        for row in reader:
            if len(row) >= 7:
                tracks_data.append(tuple(row[:7]))
                count += 1
                if count % 10000 == 0:
                    cursor.executemany('INSERT OR IGNORE INTO tracks VALUES (?, ?, ?, ?, ?, ?, ?)', tracks_data)
                    tracks_data = []
                    print(f"Inserted {count} records...")

        if tracks_data:
            cursor.executemany('INSERT OR IGNORE INTO tracks VALUES (?, ?, ?, ?, ?, ?, ?)', tracks_data)

    print(f"Total inserted: {count}")
    
    print("Rebuilding FTS index...")
    cursor.execute("INSERT INTO tracks_fts(tracks_fts) VALUES('rebuild')")
    
    conn.commit()
    conn.close()
    print("Migration complete!")

if __name__ == "__main__":
    migrate()
