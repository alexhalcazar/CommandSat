from dotenv import load_dotenv
from pathlib import Path
import os
import redis
import json
import time

load_dotenv(Path(__file__).parent.parent / '.env')

BASE_URL = 'https://api.n2yo.com/rest/v1/satellite/'
API_KEY = os.getenv('N2YO_API_KEY')
REDIS_HOST = os.getenv('REDIS_HOST')
REDIS_PORT = os.getenv('REDIS_PORT')
USERNAME = os.getenv('REDIS_USERNAME')
PASSWORD = os.getenv('REDIS_PASSWORD')

TIMEOUT = 30  # Demo Purposes Only

def queue_n2yo_jobs(r):
    while True:
        # TODO: active_users = get_active_users()  # pull from DB
        # Hard coding for Demo purposes
        active_users = [{'userId': 1, 'gcs' : [{'lat': 35.68, 'lng': 139.69, 'alt': 350}, {'lat': 34.07, 'lng': -118.17, 'alt': 350}]}]
        for user in active_users:
            job = {
               'userId': user['userId'],
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
