# IpTraceDemo
This app will bring information from the IP that you want to search. For this version, all the information will be based on Buenos Aires as compare point and 'USD' dollar as the central currency for the exchange.

The only thing that you have to configure is the api public key to consume the exchange public API. To do this, you have to signup (for FREE, really FREE) here https://currencylayer.com follow the steps, is really easy.

Once you have the api key, go to the root of this app, open the docker-compose.yml and set your api key right below of `REDIS_URL` env variable, like this:
`CURRENCY_LAYER_APIKEY=YOUR_API_KEY`.

## UP AND RUN
To run this application you will need Docker and Docker Compose if you do not have it, here is the website where you can download it https://www.docker.com .

Open a terminal in the root folder and run.
- $`docker-compose build`
- $`docker-compose up`

Then, go to http://localhost:3000 and enjoy!

Have fun and trace an IP!
