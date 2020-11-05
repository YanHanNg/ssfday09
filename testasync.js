const fetch = require('node-fetch');
const withQuery = require('with-query').default;
const md5 = require('md5');

const API_KEY = process.env.PUBLIC_KEY;
const MARVEL_DEV_BASEURL = 'https://gateway.marvel.com';

const getMarvCharacter = async () => {

    let ts = new Date().getTime();
    let hash = md5(ts + process.env.PRIVATE_KEY + process.env.PUBLIC_KEY);

    const apiPath = MARVEL_DEV_BASEURL + '/v1/public/characters';
    const url = withQuery(apiPath, {
        ts,
        apikey: process.env.PUBLIC_KEY,
        hash
    })

    let results = await fetch(url);
    let characters = await results.json();
    return parseInt(characters.data.results[0].id);
};

getMarvCharacter().then(data => {
    console.info(data);
})