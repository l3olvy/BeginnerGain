# node.js에서 한글 깨짐 방지
import sys    
sys.stdout.reconfigure(encoding='utf-8')

import json
from konlpy.tag import Komoran
from collections import Counter
#from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import normalize

with open('C:\\Users\\qhsl0\\NIRW_IT_link4.json', 'r', encoding='UTF-8') as json_file:
    json_data = json.load(json_file)
    
start = int(sys.argv[1])
end = int(sys.argv[2])

komoran = Komoran()

#with open('C:\\Users\\qhsl0\\keywords.txt', 'r') as f:
#    lines = f.read()

def komoran_tokenizer(sent):
    #stopwords = lines.split('\n')
    stopwords =['IT', 'SW', 'it', 'sw', '대기업', '업계', '국내', '기업', '제품', '고객', '시장', '기술', '휴대폰', '장길수', '인사이드', 
    '인사', '이드', '미래', '정보', '삼성전자', '삼성', '세계', 'TV', '수정', '글로벌', '애플', 'LG', '한국', '사업', '올해', '스마트', '산업', '개막']
    words = komoran.pos(sent)
    words = ' '.join(w for w, p in words if ('NN' in p or 'SL' in p) and w not in stopwords and len(w) > 1)
    #words = ' '.join(w for w, p in words if ('NN' in p or 'SL' in p) and len(w) > 1)
    return words

rangenews = []
for news in json_data:
    if(start<=int(news['date']) <=end):
        rangenews.append(news)
    elif(int(news['date']) > end):
        break
        
list=[]

for title in rangenews:
    list.append(komoran_tokenizer(title['title']))

def build_words_graph(sentence):
    cnt_vec = CountVectorizer()
    graph_sentence = []
    cnt_vec_mat = normalize(cnt_vec.fit_transform(sentence).toarray().astype(float), axis=0)
    vocab = cnt_vec.vocabulary_
    return np.dot(cnt_vec_mat.T, cnt_vec_mat), {vocab[word] : word for word in vocab}

def get_ranks(graph, d=0.85): 
        A = graph
        matrix_size = A.shape[0]
        for id in range(matrix_size):
            A[id, id] = 0 
            link_sum = np.sum(A[:,id])
            if link_sum != 0:
                A[:, id] /= link_sum
            A[:, id] *= -d
            A[id, id] = 1
        B = (1-d) * np.ones((matrix_size, 1))
        ranks = np.linalg.solve(A, B) 
        return {idx: r[0] for idx, r in enumerate(ranks)}

words_graph, idx2word = build_words_graph(list)

word_rank_idx = get_ranks(words_graph)
sorted_word_rank_idx = sorted(word_rank_idx, key=lambda k: word_rank_idx[k], reverse=True)

keywords = []
index_w=[]

for idx in sorted_word_rank_idx[:5]:
    index_w.append(idx)

for idx in index_w:
    keywords.append(idx2word[idx])

key=[]
for title in rangenews:
    for keyword in keywords:
        if keyword.upper() in title['title'] or keyword in title['title']:
            key.append(keyword)
    title['keyword']= key
    key = []

for i in rangenews:
    if len(i['keyword']) == 0:
        rangenews.remove(i)

rangenews.insert(0,keywords)


print(json.dumps(rangenews, ensure_ascii=False))


#print(json.dumps(json_data[0]))
#print(json.dumps(json_data[1]))
sys.stdout.flush()