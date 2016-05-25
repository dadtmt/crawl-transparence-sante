# Crawl Transparence Sante

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

Make sure you have [PhantomJS](http://phantomjs.org/) installed.

Make sure you have [CasperJS](http://casperjs.org/) installed.

Before typing the following command make sure there is no cap.txt file in the folder

```sh
casperjs crawl.js
```

## Usage

### Filling the search form

Search for the casper.start method and modify the following :

```js
this.fill('form#form',{
  'form:codePostalEntreprise' : '51100',
  'form:villeEntreprise': 'REIMS'
},false);
```

### Provide captcha in a text file

When the captcha is needed you will see this message

```sh
Captcha found ! Check captcha.png and create a cap.txt file containing the captcha.
```

Open the captcha.png file and type the captcha in a cap.txt file
