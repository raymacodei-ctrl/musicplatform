# 🎵 Decentralized Music Platform on Stellar Soroban

## 📌 Project Description
<img width="1920" height="1008" alt="image" src="https://github.com/user-attachments/assets/6516f352-d061-4b4a-9a33-073726fa54d1" />


This project is a decentralized music platform built using Soroban smart contracts on the Stellar blockchain.

It allows artists to upload their songs by storing song metadata such as artist name, song title, and IPFS hash on-chain.
This ensures transparency, ownership proof, and censorship resistance.

The actual music files are stored on IPFS while the blockchain stores secure references.

---

## ⚙️ What it does

* Artists can upload song metadata to the blockchain
* Each song includes:

  * Artist Name
  * Song Title
  * IPFS Hash (link to decentralized storage)
* Users can fetch the complete list of uploaded songs

This creates a decentralized registry of music content.

---

## ✨ Features

* ✅ Fully decentralized music registry
* ✅ IPFS integration for media storage
* ✅ Immutable song metadata storage
* ✅ Transparent content publishing
* ✅ Simple Soroban smart contract design
* ✅ Gas efficient implementation

---

## 🔗 Deployed Smart Contract Link

https://stellar.expert/explorer/testnet/contract/CBSENIURAR4ZYZ33QDXJR6UKWUFHJKSALQZV2MJIT74WUTR3GH7JM67T
---

## 🚀 Future Improvements

* Artist wallet authentication
* Like / tip system using Stellar tokens
* Music NFT minting
* Streaming frontend UI
* Royalty distribution smart contract

---

# ⭐ VERY IMPORTANT Improvement (Smart Contract Advice) 🧠

Your contract is **good beginner level**, but for real projects you should:

### ✅ 1. Add Song ID

Right now songs are only pushed → hard to fetch one song

Better:

```rust
song.set(Symbol::new(&env,"id"), song_id);
```

---

### ✅ 2. Prevent Fake Uploads

Anyone can upload songs

Add:

* `require_auth()` for artist wallet
* ownership mapping

---

### ✅ 3. Add Events (Very Powerful in Soroban)

So frontend can detect upload instantly ⚡

```rust
env.events().publish(
    (Symbol::new(&env,"upload"),),
    title
);
```

---

### ✅ 4. Add Pagination

If 10,000 songs → `get_songs()` becomes heavy

Better:

```
get_song_by_id()
get_songs_range()
```

---

## ⭐ If you want I can next build FULL version for you 😄

Like:

🎧 Advanced Music Platform Contract
💰 Royalty Distribution Logic
❤️ Like + Tip System
🌐 React Frontend UI
🚀 Deployment Guide Step-by-Step

Just tell me 👍
