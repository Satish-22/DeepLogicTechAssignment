const http = require('http');
// http modulwe comes with javascript and it provides functionality for creating http servers 
// const axios = require('axios');
const https = require('https')
// axios is javascript library for making http request 
// we will make get request in this assignment 

const server = http.createServer(async (req, res) => {
    if (req.url === '/getTimeStories' && req.method === 'GET') {
        try {
            const url = 'https://time.com';

            const request = https.request(url, { method: 'GET' }, async (response) => {
                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    if (response.statusCode === 200) {
                        const html = data;

                        const latestStories = [];
                        // Find the index of the start of the latest stories section
                        const startIndex = html.indexOf('<h2 class="latest-stories__heading">');
                        // Find the index of the end of the latest stories section
                        const endIndex = html.indexOf('</ul>', startIndex);
                        // Extract the latest stories section from the HTML
                        const latestStoriesHtml = html.substring(startIndex, endIndex + 5);
                        // Split the section into individual story items
                        const storyItems = latestStoriesHtml.split('</li>');

                        storyItems.forEach((item) => {
                            // Find the index of the start of the latest storie headline section 
                            const titleStartIndex = item.indexOf('<h3 class="latest-stories__item-headline">') + 42;
                            // Find the index of the end of the latest stories headline section
                            const titleEndIndex = item.indexOf('</h3>', titleStartIndex);

                            const title = item.substring(titleStartIndex, titleEndIndex).trim();
                            // Find the index of the start of the mentioned link
                            const linkStartIndex = item.indexOf('<a href="') + 9;
                            // Find the index of the end of the mentioned link
                            const linkEndIndex = item.indexOf('">', linkStartIndex);
                            // generate link
                            const link = url + item.substring(linkStartIndex, linkEndIndex);
                            // push it into the array 
                            latestStories.push({ title, link });
                        });

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(latestStories.slice(0, 6)));
                    } else {
                        res.writeHead(response.statusCode, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Failed to retrieve the page' }));
                    }
                });
            });

            request.on('error', (error) => {


                console.error(error);


                res.writeHead(500, { 'Content-Type': 'application/json' });


                res.end(JSON.stringify({ error: 'Internal server error' }));
            });

            request.end();
        } catch (error) {
            console.error(error);


            res.writeHead(500, { 'Content-Type': 'application/json' });


            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });


        res.end(JSON.stringify({ error: 'Make request at localhost:3000/getTimeStories' }));
    }
});

const port = 3000;
server.listen(port, () => {

    console.log(`Server is running on http://localhost:${port}`);
    
});


