#![no_std]

use soroban_sdk::{contract, contractimpl, Env, Symbol, Vec, Map, String};

#[contract]
pub struct MusicPlatform;

#[contractimpl]
impl MusicPlatform {

    // Store a song with metadata
    pub fn upload_song(
        env: Env,
        artist: String,
        title: String,
        ipfs_hash: String
    ) {
        let key = Symbol::new(&env, "songs");

        let mut songs: Vec<Map<Symbol, String>> =
            env.storage().instance().get(&key).unwrap_or(Vec::new(&env));

        let mut song = Map::new(&env);
        song.set(Symbol::new(&env, "artist"), artist);
        song.set(Symbol::new(&env, "title"), title);
        song.set(Symbol::new(&env, "ipfs"), ipfs_hash);

        songs.push_back(song);

        env.storage().instance().set(&key, &songs);
    }

    // Get all songs
    pub fn get_songs(env: Env) -> Vec<Map<Symbol, String>> {
        let key = Symbol::new(&env, "songs");
        env.storage().instance().get(&key).unwrap_or(Vec::new(&env))
    }
}