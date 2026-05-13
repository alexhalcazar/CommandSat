from dotenv import load_dotenv
from pathlib import Path
import os
import redis
import json
import time
import psycopg
import psycopg_pool

load_dotenv(Path(__file__).parent.parent / '.env')

BASE_URL = 'https://api.n2yo.com/rest/v1/satellite/'
API_KEY = os.getenv('N2YO_API_KEY')
REDIS_HOST = os.getenv('REDIS_HOST')
REDIS_PORT = os.getenv('REDIS_PORT')
USERNAME = os.getenv('REDIS_USERNAME')
PASSWORD = os.getenv('REDIS_PASSWORD')
pool = psycopg_pool.ConnectionPool(conninfo=os.getenv("DATABASE_URL"))

TIMEOUT = 30  # Demo Purposes Only

def get_active_users():
    # Connect to an existing database
    with pool.connection() as conn:

        # Open a cursor to perform database operations
        with conn.cursor(row_factory=psycopg.rows.dict_row) as cur:
            # Query the database and obtain data as Python objects.
            cur.execute("""
                SELECT 
                    u.user_id,
                    u.username,
                    u.email,
                    gcs.gcs_id,
                    gcs.latitude,
                    gcs.longitude,
                    gcs.altitude
                FROM users u
                LEFT JOIN ground_control_stations gcs ON gcs.user_id = u.user_id
                WHERE u.is_active = TRUE
            """)
            rows = cur.fetchall()

            users = {}
            for row in rows:
                user_id = row['user_id']

                if user_id not in users:
                    users[user_id] = {
                        'user_id':  user_id,
                        'username': row['username'],
                        'email':    row['email'],
                        'gcs': []
                    }

                if row['gcs_id'] is not None:
                    users[user_id]['gcs'].append({
                        'gcs_id': row['gcs_id'],
                        'lat':  row['latitude'],
                        'lng': row['longitude'],
                        'alt':  row['altitude'],
                    })

            return list(users.values())


def queue_n2yo_jobs(r):
    while True:
        active_users = get_active_users()
        print('Our active users', active_users)
        for user in active_users:
            job = {
               'user_id': user['user_id'],
               'gcs': user['gcs']
            }
            print('Sending Updates')
            r.rpush('satellite_jobs', json.dumps(job))
        time.sleep(TIMEOUT)


if __name__ == '__main__':
    r = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    username=USERNAME,
    password=PASSWORD
    )
    queue_n2yo_jobs(r)
