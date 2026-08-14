from dotenv import load_dotenv
from pathlib import Path
import os
import redis
import json
import requests

load_dotenv(Path(__file__).parent.parent / '.env')

BASE_URL = 'https://api.n2yo.com/rest/v1/satellite/'
API_KEY = os.getenv('N2YO_API_KEY')
REDIS_HOST = os.getenv('REDIS_HOST')
REDIS_PORT = os.getenv('REDIS_PORT')
USERNAME = os.getenv('REDIS_USERNAME')
PASSWORD = os.getenv('REDIS_PASSWORD')

RADIUS=20
CATEGORY_ID = 0

def fetch_satellites_above(lat, lng, alt):
    try:
        url = f'{BASE_URL}/above/{lat}/{lng}/{alt}/{RADIUS}/{CATEGORY_ID}/&apiKey={API_KEY}'
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as e:
        print(f'Server response error: {e.response.status_code}')
        raise
    except requests.exceptions.ConnectionError as e:
        print(f'Could not connect to the server {e}')
        raise
    except requests.exceptions.RequestException as e:
        print(f'Request setup error: {e}')
        raise


def process_jobs(r):
    r.delete('satellite_jobs')  # clear any stale jobs on startup
    print('Queue cleared!')
    while True:
        # blocking pop - waits until a job appears in the list
        job = r.blpop('satellite_jobs', timeout=0)

        if not job:
            continue

        print('We got a new job!')
        _, data = job

        try:
            payload = json.loads(data)
        except (json.JSONDecodeError(), ValueError) as e:
            print(f'Bad payload, skipping job: {e}')
            continue
            
        user_id = payload['user_id']
        satellites_by_id = {}

        for gcs in payload['gcs']:
            lat = gcs['lat']
            lng = gcs['lng']
            alt = gcs['alt']
            gcs_satellites =  fetch_satellites_above(lat, lng, alt)

            
            for sat in gcs_satellites.get('above', []):
                satid = sat['satid']
                satellites_by_id[satid] = {
                    'satid': satid,
                    'satname': sat['satname'],
                    'launchdate': sat['launchDate'],
                    'satlat': sat['satlat'],
                    'satlng': sat['satlng'],
                    'satalt': sat['satalt'],
                }


        print('publishing data')
        print('All our satellites', satellites_by_id)
        r.publish('user-updates', json.dumps({
            'user_id': str(user_id),
            'type': 'satellite_data',
            'data': satellites_by_id
        }))
           
            

if __name__ == '__main__':
    r = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    username=USERNAME,
    password=PASSWORD
    )

    process_jobs(r)
