---
layout: post
title: Advanced RAG Techniques for Production Systems
date: 2024-11-25 09:00:00
description: Exploring cutting-edge approaches to building robust RAG applications
tags: NLP RAG LLM production
categories: research
---

## Beyond Basic RAG

While basic RAG systems provide a solid foundation, production applications require more sophisticated approaches to handle complex queries, ensure reliability, and maintain performance at scale.

## Hierarchical RAG

### Concept

Hierarchical RAG organizes documents in a tree structure, enabling multi-level retrieval:

```python
class HierarchicalRAG:
    def __init__(self):
        self.summary_index = {}  # Document summaries
        self.chunk_index = {}    # Detailed chunks
    
    def index_document(self, doc_id: str, content: str):
        # Generate summary
        summary = self.summarize(content)
        self.summary_index[doc_id] = {
            'embedding': self.embed(summary),
            'text': summary
        }
        
        # Create chunks
        chunks = self.chunk_text(content)
        self.chunk_index[doc_id] = [
            {'embedding': self.embed(chunk), 'text': chunk}
            for chunk in chunks
        ]
    
    def retrieve(self, query: str, k: int = 5):
        # Step 1: Find relevant documents via summaries
        query_emb = self.embed(query)
        relevant_docs = self.search_summaries(query_emb, k=3)
        
        # Step 2: Retrieve detailed chunks from relevant docs
        chunks = []
        for doc_id in relevant_docs:
            doc_chunks = self.search_chunks(
                doc_id, 
                query_emb, 
                k=k//3
            )
            chunks.extend(doc_chunks)
        
        return chunks
```

## Query Decomposition

Break complex queries into simpler sub-queries:

```python
from typing import List, Dict

class QueryDecomposer:
    def __init__(self, llm):
        self.llm = llm
    
    def decompose(self, complex_query: str) -> List[str]:
        prompt = f"""
        Break down this complex question into simpler sub-questions:
        
        Question: {complex_query}
        
        Sub-questions (one per line):
        """
        
        response = self.llm.generate(prompt)
        sub_queries = [q.strip() for q in response.split('\n') if q.strip()]
        return sub_queries
    
    def answer_with_decomposition(self, query: str):
        # Decompose query
        sub_queries = self.decompose(query)
        
        # Answer each sub-query
        sub_answers = []
        for sq in sub_queries:
            context = self.retrieve(sq)
            answer = self.generate_answer(sq, context)
            sub_answers.append({
                'question': sq,
                'answer': answer,
                'context': context
            })
        
        # Synthesize final answer
        final_answer = self.synthesize(query, sub_answers)
        return final_answer
```

## Self-RAG: Self-Reflective Retrieval

Implement a system that critiques and refines its own retrievals:

```python
class SelfRAG:
    def __init__(self, llm, retriever):
        self.llm = llm
        self.retriever = retriever
    
    def is_retrieval_needed(self, query: str) -> bool:
        """Determine if retrieval is necessary"""
        prompt = f"""
        Does this question require external knowledge to answer?
        Question: {query}
        Answer with YES or NO:
        """
        response = self.llm.generate(prompt).strip().upper()
        return response == "YES"
    
    def assess_relevance(self, query: str, document: str) -> float:
        """Score document relevance"""
        prompt = f"""
        Rate the relevance of this document to the question (0-10):
        
        Question: {query}
        Document: {document}
        
        Relevance score:
        """
        score = float(self.llm.generate(prompt).strip())
        return score / 10.0
    
    def verify_answer(self, query: str, answer: str, context: str) -> bool:
        """Verify if answer is supported by context"""
        prompt = f"""
        Is this answer fully supported by the given context?
        
        Context: {context}
        Question: {query}
        Answer: {answer}
        
        Respond with SUPPORTED or NOT_SUPPORTED:
        """
        response = self.llm.generate(prompt).strip().upper()
        return response == "SUPPORTED"
    
    def generate_with_reflection(self, query: str):
        # Check if retrieval is needed
        if not self.is_retrieval_needed(query):
            return self.llm.generate(query)
        
        # Retrieve documents
        docs = self.retriever.retrieve(query, k=10)
        
        # Filter by relevance
        relevant_docs = [
            doc for doc in docs
            if self.assess_relevance(query, doc['text']) > 0.7
        ]
        
        if not relevant_docs:
            return "Insufficient information to answer the question."
        
        # Generate answer
        context = "\n\n".join([d['text'] for d in relevant_docs])
        answer = self.llm.generate(f"Context: {context}\n\nQuestion: {query}")
        
        # Verify answer
        if not self.verify_answer(query, answer, context):
            # Retry with different approach
            answer = self.llm.generate(
                f"Based strictly on this context, answer the question.\n"
                f"Context: {context}\nQuestion: {query}"
            )
        
        return answer
```

## Contextual Compression

Reduce retrieved context to only relevant information:

```python
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

class ContextualCompressor:
    def __init__(self, model_name: str = "facebook/bart-large-cnn"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
    
    def compress_context(self, query: str, documents: List[str]) -> str:
        """Extract only query-relevant information"""
        compressed_docs = []
        
        for doc in documents:
            # Create extraction prompt
            prompt = f"""
            Extract only the information relevant to answering this question:
            Question: {query}
            
            Document: {doc}
            
            Relevant information:
            """
            
            inputs = self.tokenizer(prompt, return_tensors="pt", max_length=1024, truncation=True)
            outputs = self.model.generate(**inputs, max_length=256)
            compressed = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            compressed_docs.append(compressed)
        
        return "\n\n".join(compressed_docs)

# Usage
compressor = ContextualCompressor()

def rag_with_compression(query: str):
    # Retrieve documents
    docs = retriever.retrieve(query, k=10)
    
    # Compress context
    compressed_context = compressor.compress_context(
        query,
        [d['text'] for d in docs]
    )
    
    # Generate with compressed context
    answer = llm.generate(f"Context: {compressed_context}\n\nQuestion: {query}")
    return answer
```

## Hybrid Retrieval Strategies

### BM25 + Dense Retrieval

```python
from rank_bm25 import BM25Okapi
import numpy as np

class HybridRetriever:
    def __init__(self, documents: List[str], embedding_model):
        self.documents = documents
        self.embedding_model = embedding_model
        
        # BM25 index
        tokenized_docs = [doc.lower().split() for doc in documents]
        self.bm25 = BM25Okapi(tokenized_docs)
        
        # Dense index
        self.doc_embeddings = embedding_model.encode(documents)
    
    def retrieve(self, query: str, k: int = 5, alpha: float = 0.5):
        # BM25 scores
        tokenized_query = query.lower().split()
        bm25_scores = self.bm25.get_scores(tokenized_query)
        bm25_scores = (bm25_scores - bm25_scores.min()) / (bm25_scores.max() - bm25_scores.min())
        
        # Dense retrieval scores
        query_embedding = self.embedding_model.encode([query])[0]
        dense_scores = np.dot(self.doc_embeddings, query_embedding)
        dense_scores = (dense_scores - dense_scores.min()) / (dense_scores.max() - dense_scores.min())
        
        # Combine scores
        hybrid_scores = alpha * dense_scores + (1 - alpha) * bm25_scores
        
        # Get top-k
        top_indices = np.argsort(hybrid_scores)[-k:][::-1]
        
        return [
            {
                'text': self.documents[i],
                'score': hybrid_scores[i],
                'bm25_score': bm25_scores[i],
                'dense_score': dense_scores[i]
            }
            for i in top_indices
        ]
```

## Re-ranking for Precision

```python
from sentence_transformers import CrossEncoder

class ReRanker:
    def __init__(self, model_name: str = "cross-encoder/ms-marco-MiniLM-L-6-v2"):
        self.model = CrossEncoder(model_name)
    
    def rerank(self, query: str, documents: List[Dict], top_k: int = 5):
        # Prepare pairs
        pairs = [[query, doc['text']] for doc in documents]
        
        # Score with cross-encoder
        scores = self.model.predict(pairs)
        
        # Add scores and sort
        for doc, score in zip(documents, scores):
            doc['rerank_score'] = float(score)
        
        reranked = sorted(documents, key=lambda x: x['rerank_score'], reverse=True)
        return reranked[:top_k]

# Usage in RAG pipeline
def advanced_rag(query: str):
    # Initial retrieval (cast wide net)
    initial_docs = retriever.retrieve(query, k=20)
    
    # Re-rank for precision
    reranker = ReRanker()
    final_docs = reranker.rerank(query, initial_docs, top_k=5)
    
    # Generate answer
    context = "\n\n".join([d['text'] for d in final_docs])
    answer = llm.generate(f"Context: {context}\n\nQuestion: {query}")
    
    return {
        'answer': answer,
        'sources': final_docs
    }
```

## Conversation-Aware RAG

Handle multi-turn conversations with context:

```python
class ConversationalRAG:
    def __init__(self, llm, retriever):
        self.llm = llm
        self.retriever = retriever
        self.conversation_history = []
    
    def rewrite_query(self, current_query: str) -> str:
        """Rewrite query with conversation context"""
        if not self.conversation_history:
            return current_query
        
        history_text = "\n".join([
            f"Q: {h['query']}\nA: {h['answer']}"
            for h in self.conversation_history[-3:]  # Last 3 turns
        ])
        
        prompt = f"""
        Given this conversation history, rewrite the current question to be standalone:
        
        History:
        {history_text}
        
        Current question: {current_query}
        
        Standalone question:
        """
        
        standalone_query = self.llm.generate(prompt).strip()
        return standalone_query
    
    def answer(self, query: str):
        # Rewrite query with context
        standalone_query = self.rewrite_query(query)
        
        # Retrieve and generate
        docs = self.retriever.retrieve(standalone_query)
        context = "\n\n".join([d['text'] for d in docs])
        
        answer = self.llm.generate(
            f"Context: {context}\n\nQuestion: {standalone_query}"
        )
        
        # Update history
        self.conversation_history.append({
            'query': query,
            'standalone_query': standalone_query,
            'answer': answer
        })
        
        return answer
```

## Monitoring and Evaluation

```python
class RAGMonitor:
    def __init__(self):
        self.metrics = []
    
    def log_retrieval(self, query: str, docs: List[Dict], answer: str):
        """Log retrieval for analysis"""
        self.metrics.append({
            'query': query,
            'num_docs_retrieved': len(docs),
            'avg_relevance_score': np.mean([d.get('score', 0) for d in docs]),
            'answer_length': len(answer),
            'timestamp': time.time()
        })
    
    def evaluate_faithfulness(self, answer: str, context: str) -> float:
        """Check if answer is grounded in context"""
        # Use NLI model or LLM-based evaluation
        prompt = f"""
        Rate how well this answer is supported by the context (0-1):
        Context: {context}
        Answer: {answer}
        Score:
        """
        score = float(self.llm.generate(prompt).strip())
        return score
    
    def get_statistics(self):
        """Return performance statistics"""
        return {
            'total_queries': len(self.metrics),
            'avg_docs_retrieved': np.mean([m['num_docs_retrieved'] for m in self.metrics]),
            'avg_relevance': np.mean([m['avg_relevance_score'] for m in self.metrics])
        }
```

## Conclusion

Advanced RAG techniques significantly improve system reliability, accuracy, and user experience. By combining multiple strategies—hierarchical retrieval, query decomposition, self-reflection, and re-ranking—we can build production-ready RAG systems that handle complex real-world scenarios.

---

*Explore more on building robust NLP systems in my research and blog posts.*
