//Load Lib
const express = require('express');
const hbs = require('express-handlebars');

const fetch = require('node-fetch');
const withQuery = require('with-query').default;
const md5 = require('md5');

//Initialise express and hbs
const app = express();
app.engine('hbs', hbs({defaultLayout: 'default.hbs'}));
app.set('view engine', 'hbs');

const PORT = parseInt(process.env.PORT) || 3000;

const MARVEL_DEV_BASEURL = 'https://gateway.marvel.com';
const LIMIT = 90;

app.get('/', async (req, res) => {
    let ts = new Date().getTime();
    let hash = md5(ts + process.env.PRIVATE_KEY + process.env.PUBLIC_KEY);
    let apiPath = MARVEL_DEV_BASEURL + '/v1/public/characters';

    let offset = parseInt(req.query['offset']) || 0;
    
    const url = withQuery(apiPath, {
        ts,
        apikey: process.env.PUBLIC_KEY,
        hash,
        limit: LIMIT,
        offset
    }) 

    fetch(url).then(results => {
        return results.json();
    })
    .then(results => {
        if(results.data.count <= 0)
        {
            res.status(200);
            res.type('text/html');
            res.send(`<h1>No Results Found</h1>`);
        }
        else
        {
            res.status(200);
            res.type('text/html');
            res.render('marvelchars', {
                marvelChars: results.data.results,
                offset,
                prevOffset: Math.max(0, offset - LIMIT),
                nextOffset: offset + LIMIT
            })
        }
    })
})

app.get('/get/:id/:type', (req, res)=> {
    let ts = new Date().getTime();
    let hash = md5(ts + process.env.PRIVATE_KEY + process.env.PUBLIC_KEY);
    let apiPath = MARVEL_DEV_BASEURL + '/v1/public/characters' + `/${req.params.id}/${req.params.type}`;

    let isComics = false;
    let isEvents = false;
    let isSeries = false;
    let isStories = false;

    if(req.params.type === 'comics')
        isComics = true;
    else if(req.params.type === 'events')
        isEvents = true;
    else if(req.params.type === 'series')
        isSeries = true;
    else if(req.params.type === 'stories')
        isStories = true;
    
    
    const url = withQuery(apiPath, {
        ts,
        apikey: process.env.PUBLIC_KEY,
        hash,
        limit: 99
    }) 

    fetch(url).then(results => {
        return results.json();
    })
    .then(results => {
        if(results.data.count <= 0)
        {
            res.status(200);
            res.type('text/html');
            res.send(`<h1>No Results Found</h1>`);
        }
        else
        {
            res.status(200);
            res.type('text/html');
            res.render('displaythumbnail', {
                type: results.data.results,
                isComics,
                isEvents,
                isSeries,
                isStories
            })
        }
    })

})

app.use(express.static(__dirname + '/public'));

app.use((req, res) => {
    res.status(200);
    res.type('text/html');
    res.send(`<h1>Invalid Route</h1>`);
})

app.listen(PORT, () => {
    console.info(`Server Started at ${new Date()}`);
})