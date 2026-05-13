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
    except requests.exceptions.ConnectionError:
        print('No response from server')
        raise
    except requests.exceptions.RequestException as e:
        print(f'Request setup error: {e}')
        raise


def process_jobs(r):
    while True:
        # blocking pop - waits until a job appears in the list
        job = r.blpop('satellite_jobs', timeout=0)
        
        if job:
            print('We got a new job!')
            _, data = job
            payload = json.loads(data)
            user_id = payload['user_id']
            satellites = []
            for gcs in payload['gcs']:
                lat = gcs['lat']
                lng = gcs['lng']
                alt = gcs['alt']
                gcs_satellites =  fetch_satellites_above(lat, lng, alt)
                satellites.extend(gcs_satellites['above'])

            print('publishing data')
            r.publish('user-updates', json.dumps({
                'user_id': str(user_id),
                'type': 'satellite_data',
                'data': satellites
            }))
            

if __name__ == '__main__':
    r = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    username=USERNAME,
    password=PASSWORD
    )

    process_jobs(r)
