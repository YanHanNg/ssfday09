const fetch = require('node-fetch');
const withQuery = require('with-query').default;
const md5 = require('md5');

const API_KEY = process.env.PUBLIC_KEY;
const MARVEL_DEV_BASEURL = 'https://gateway.marvel.com';

let ts = new Date().getTime();
let hash = md5(ts + process.env.PRIVATE_KEY + process.env.PUBLIC_KEY);
let apiPath = MARVEL_DEV_BASEURL + '/v1/public/characters';
const url = withQuery(apiPath, {
    ts,
    apikey: process.env.PUBLIC_KEY,
    hash,
    nameStartsWith: process.argv[2]
})

fetch(url).then(results => {
    return results.json();
})
.then(results => {
    if(results.data.count <= 0)
        return Promise.reject('Result not found');
    let charId = parseInt(results.data.results[0].id);

    let apiPath = MARVEL_DEV_BASEURL + `/v1/public/characters/${charId}`;
    const url = withQuery(apiPath, {
        ts,
        apikey: process.env.PUBLIC_KEY,
        hash
    })
    
    return fetch(url);
})
.then(results=> {
    return results.json();
})
.then(results=> {
    if(results.data.count <= 0)
        return Promise.reject('Result not found');
    
    console.info(results.data.results[0]);
    return results.data.results[0];
})
.catch(err => {
    console.error('Error', err);
})
