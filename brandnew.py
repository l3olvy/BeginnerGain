# import sys    
# sys.stdout.reconfigure(encoding='utf-8')
  
# import requests
# import json
# import threading
# import time

# <<<<<<< HEAD
# =======
# with open('C:\\Users\\goeun\\Desktop\\news_dict.json','r', encoding='utf-8') as json_file:
# 	json_data = json.load(json_file)

# print(json.dumps(json_data, ensure_ascii=False))

# sys.stdout.flush()


import sys    
sys.stdout.reconfigure(encoding='utf-8')
  
import requests
import json
import threading
import time

client_id = 'Y3sv5KN6S5FsNI5C6tQf'
client_secret = 'BSP96j5skc'
 
url = 'https://openapi.naver.com/v1/search/news.json'
title = '?query=' + 'it ict ai sw'
option = '&sort=date&display=10'

naver_open_api = url + title + option
#print(naver_open_api)

header_params = {"X-Naver-Client-Id":client_id, "X-Naver-Client-Secret":client_secret} 

res = requests.get(naver_open_api, headers=header_params)

if res.status_code == 200:
   data = res.json()
   news_dict = []
   for index, item in enumerate(data['items']):
      title = item['title']
      description = item['description']
      link = item['link']
      pubDate = item['pubDate']
      news_dict.append({'title':title, 'description':description, 'link':link, 'pubDate':pubDate})
        
else:
   print ("Error Code:", res.status_code)

# with open('news_dict.json','w', encoding='utf-8') as newsdata:
#    print(json.dump(news_dict,newsdata, ensure_ascii=False, indent='\t'))

# with open('news_dict.json','r', encoding='utf-8') as json_file:
#    json_data = json.load(json_file)

print(json.dumps(news_dict, ensure_ascii=False))

sys.stdout.flush()