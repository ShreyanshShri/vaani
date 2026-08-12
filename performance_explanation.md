# Vaani Speed Optimizations: Explainer Guide

This guide explains the performance features implemented in the Vaani digital nurse assistant.

---

## 1. Embedding Caching

### What it is
Whenever the AI needs to store or search a memory (e.g., *"I have high blood pressure"*), it cannot read plain text. We must convert that text into a mathematical list of numbers (called an **Embedding**) using Google’s Gemini API over the internet.

### The Problem
Making a network request to Google's cloud servers takes time (typically **300ms–500ms**). Repeated queries over the course of a conversation compound this delay.

### The Optimization (Redis Cache)
The first time we translate a text into numbers, we generate a unique MD5 hash of that text and save it in our super-fast, in-memory database (**Redis**). If the AI needs to process that statement again, we bypass Google's API entirely and read the numbers from Redis in **< 1ms**.

* **Real-world Analogy**: Instead of walking to the library to translate a word every time you read it, you write the translation on a post-it note and stick it directly on your desk.

---

## 2. Qdrant Filter Indexing

### What it is
Qdrant is the vector database that holds semantic memories. Since this app supports multiple users, when we search memories, we filter the results (e.g., *"Only show memories belonging to User A"*).

### The Problem
Without indexing, Qdrant has to scan **every single memory in the database** to check who it belongs to before performing the search. As more users join the app, this check becomes a performance bottleneck.

### The Optimization (Payload Indexing)
We created a keyword payload index on the `userId` field. This instructs Qdrant to organize memories by user ID automatically. Now, Qdrant instantly narrows down its search scope to only the target user's memories, ignoring all other users' data.

* **Real-world Analogy**: If you want to find Alice's medical file, instead of searching through a messy pile of thousands of loose papers in a box, you walk over to a filing cabinet, pull open the drawer labeled **"Alice"**, and search only the papers in that folder.

---

## 3. MongoDB Query Indexing

### The Problem
MongoDB stores our structured medical events. Every time we retrieve events, the system queries the collection matching the `userId` and sorting by the `timestamp` descending. Without indexes, MongoDB performs a slow full collection scan.

### The Optimization (Compound Indexing)
We added a compound index `{ userId: 1, type: 1, timestamp: -1 }` on startup. This acts like a book index, allowing MongoDB to fetch the user's sorted records in $O(\log N)$ time, speeding up the baseline query from **~15ms to ~0.37ms (a 39x speedup)**.
