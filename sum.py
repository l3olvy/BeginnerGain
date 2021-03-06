import sys    
sys.stdout.reconfigure(encoding='utf-8')

import json, re
from konlpy.tag import Komoran
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import normalize

komoran = Komoran()
  
def komoran_tokenizer(sent):
    words = komoran.pos(sent) # 품사표 부착
    words = ' '.join(w for w, p in words if ('NN' in p or 'XR' in p or 'VA' in p or 'VV' in p or 'VV' in p)) #NN:명사 XR:어근 VA:형용사 VV:동사
    return words

# TextRank 알고리즘
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

sents = sys.argv[1]

sents = re.split('[.|!|?],', sents)

nouns = []
for sent in sents:
    nouns.append(komoran_tokenizer(sent))

tfidf_vectorizer = TfidfVectorizer() # TF-IDF 객체선언

tfidf_mat = tfidf_vectorizer.fit_transform(nouns).toarray()
sent_graph = np.dot(tfidf_mat, tfidf_mat.T)

sent_rank_idx = get_ranks(sent_graph)
sorted_sent_rank_idx = sorted(sent_rank_idx, key=lambda k: sent_rank_idx[k], reverse=True)

summary = []
index=[]
for idx in sorted_sent_rank_idx[:3]:
    index.append(idx)
index.sort()
for idx in index:
	summary.append({"sum": sents[idx]})

print(json.dumps(summary))

sys.stdout.flush()