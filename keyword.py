# node.js에서 한글 깨짐 방지
import sys    
sys.stdout.reconfigure(encoding='utf-8')
  
import json
from konlpy.tag import Komoran
from collections import Counter
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import normalize

with open('C:\\Users\\qhsl0\\NIRW_IT_link4.json', 'r', encoding='UTF-8') as json_file:
    json_data = json.load(json_file)
    
start = int(sys.argv[1])
end = int(sys.argv[2])

komoran = Komoran(userdic='./no_space.txt')

stopwords=[]
with open('./fire.txt', 'r', encoding='UTF-8') as file:
    for line in file:
        stopwords.append(line.rstrip('\n')) 

def komoran_tokenizer(sent):
    words = komoran.pos(sent)
    words = [w for w, p in words if ('NN' in p or 'SL' in p) and w not in stopwords and len(w) > 1]
    return words

rangenews = []
for news in json_data:
    if(start<=int(news['date']) <=end):
        rangenews.append(news)
    elif(int(news['date']) > end):
        break
        
sents=[]

for title in rangenews:
    sents.append(title['title'].replace(' ', '').upper())

# 문장 리스트들에서 토큰화 시켜서 단어 빈도 수 계산
counter = Counter(w for sent in sents for w in komoran_tokenizer(sent))
# 빈도수가 2번 이상인 단어들만 단어 : 빈도수 형태로 리스트화
counter = {w:c for w,c in counter.items()}
# 빈도수가 높은 순으로 단어만 sort
idx_to_vocab = [w for w, _ in sorted(counter.items(), key=lambda x:x[1], reverse=True)] 

keywords = idx_to_vocab[:10]

key=[]
for title in rangenews:
    for keyword in keywords:
        if keyword in title['title'].replace(' ', '').upper():
            key.append(keyword)
    title['keyword']= key
    key = []

for i in rangenews[::]:
    if len(i['keyword']) == 0:
        rangenews.remove(i)

rangenews.insert(0,keywords)


print(json.dumps(rangenews, ensure_ascii=False))

sys.stdout.flush()