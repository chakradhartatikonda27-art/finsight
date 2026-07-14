"""
Pings Render every 10 minutes to prevent spin-down.
Run this on your Mac while the app is in use:
python3 keep_alive.py
"""
import time
import urllib.request

URL = "https://finsight-api-mp97.onrender.com/health"

while True:
    try:
        res = urllib.request.urlopen(URL, timeout=10)
        print(f"Ping OK — {res.status}")
    except Exception as e:
        print(f"Ping failed — {e}")
    time.sleep(600)  # 10 minutes
