import sys    
sys.stdout.reconfigure(encoding='utf-8')

import json, re
from konlpy.tag import Komoran
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

komoran = Komoran()
tfidf_vectorizer = TfidfVectorizer() # TF-IDF 객체선언

def komoran_tokenizer(sent):
    words = komoran.pos(sent) # 품사표 부착
    words = ' '.join(w for w, p in words if ('NN' in p or 'XR' in p or 'VA' in p or 'VV' in p or 'VV' in p)) #NN:명사 XR:어근 VA:형용사 VV:동사
    return words

def init(sents):
    nouns = []
    summary = []
    for sent in sents:
        nouns.append(komoran_tokenizer(sent))
    tfidf_mat = tfidf_vectorizer.fit_transform(nouns).toarray()
    sent_graph = np.dot(tfidf_mat, tfidf_mat.T)
    key_sents_idx = sorted(get_ranks(sent_graph))
    for idx in key_sents_idx:
        summary.append({"sum": sents[idx]})
    print(json.dumps(summary))

# TextRank 알고리즘
def get_ranks(graph, d=0.85): 
    matrix_size = graph.shape[0]
    for i in range(matrix_size):
        graph[i, i] = 0 
        cols_sum = np.sum(graph[:,i])
        if cols_sum != 0:
            graph[:, i] /= cols_sum
    ranks = np.array([1 for i in range(matrix_size)])
    for i in range(10):
        ranks = (1-d) + d * np.dot(graph, ranks) 
        if i == 9:
            index = {idx:i for idx, i in enumerate(ranks)}
            sorted_index = sorted(index, key=lambda k: index[k], reverse=True)
    return sorted_index[:3]

sents = sys.argv[1]
sents = re.split('[.|!|?],', sents)
init(sents)

sys.stdout.flush()