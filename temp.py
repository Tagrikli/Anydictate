from datetime import datetime, timedelta
import time

now = datetime.now()
nowstr = now.strftime("%d%m%Y")

a = datetime.strptime(nowstr, "%d%m%Y")

print(now - timedelta(days=1) > a)