var casper = require('casper').create({
 	verbose: false,
    logLevel: 'debug'
});
var fs = require('fs'),
	utils = require('utils'),
	parsedFile = 'cap.txt',
	res = '';

/**
 * Parse the current page
 * Extract the table data
 * Write data in csv file
 * If the next button is enabled click on it, wait and parse the new page (recursive call)
 */
var parseOnePage = function () {
	//casper.capture('page.png');
	var nbResults = this.evaluate(function() {
	    return document.querySelector(".results").innerHTML;
	});
    this.echo('Results count: '+nbResults);

    var lines = this.evaluate(function(){
    	var myLines = '';
    	jQuery.each(document.querySelectorAll('tr'),function(k,e){
    		var $elem = $(e),
				csvSep = ';',
				csvEndLine = '\n';
    		if ($elem.hasClass('even') || $elem.hasClass('odd')){
    			var myLine = '';
    			//get entreprise
    			myLine += $elem.find('td').eq(0).find('a').text()+csvSep;
    			//get type de benificiaires
    			myLine += $elem.find('td').eq(1).text()+csvSep;
    			//get  benificiaire
    			myLine += $elem.find('td').eq(2).find('a').text()+csvSep;
    			//get  date
    			myLine += $elem.find('td').eq(3).text()+csvSep;
    			//get  nature
    			myLine += $elem.find('td').eq(4).text()+csvSep;
    			//get  montant
    			myLine += $elem.find('td').eq(5).text()+csvSep;
    			//fin de ligne
    			myLine += csvEndLine;
    			myLines += myLine;
    		}
    	});
    	return myLines;
    });

    this.echo('lines:'+lines);
    //res += lines;
    fs.write('res.csv',lines,"wa");
    this.echo('click Suivant');
    //if suivant is enabled
    if(this.getElementsAttribute("input[value='Suivant']","disabled")!="disabled") {
    	//click next
    	this.click("input[value='Suivant']");

	    casper.waitUntilVisible(
			'ul.pagination',
			parseOnePage,
			function onTimeout(){
				this.echo("Time out! Can't find pagination Bye!");
				this.exit();
			}, 30000
		);
    }

}

/**
 * Start casper on the search page
 * Fill the form and click on the submit button
 */
casper.start('https://www.transparence.sante.gouv.fr/flow/interrogationAvancee?execution=e3s1', function() {
    this.echo('Page: '+this.getTitle());
    //fill the form without submitting (automatic submission doesnt work we need a click on this one)
    this.fill('form#form',{
    	'form:codePostalEntreprise' : '51100',
    	'form:villeEntreprise': 'REIMS'
    },false);
    this.click('input.btn-action');

});

/**
 * When captcha is receveid
 * Wait for a cap.txt file containing the captcha string
 * Fill the captcha form and click
 */
casper.waitForResource(
	"captcha.jpg",
	function then() {
	    this.capture('captcha.png');
	    this.echo('Captcha found ! Check captcha.png and create a cap.txt file containing the captcha.');
	    this.waitFor(
			function check(){
				return fs.exists(parsedFile);
			},
			function then(){
				var content = fs.read(parsedFile);
				this.echo('Captcha:'+ content);
				this.fill('form#j_idt22',{
			    	'j_idt22:j_captcha_response' : content
			    },false);
			    this.click("[name='j_idt22:j_idt42']");
			},
			function onTimeout(){
				this.echo("Time out! Can't find captcha Bye!");
				this.exit();
			},
			120000
		);
	},
	function onTimeout() {
	    this.capture('timeout-captcha.png');
	    this.warn('Timeout ! Captcha not found');
	    this.exit();
	}
);

/**
 * When pagination is visible (we received the first page)
 * Call the recursive parseOnePage function
 */
casper.waitUntilVisible(
	'ul.pagination',
	parseOnePage,
	function onTimeout(){
		this.echo("Time out! Can't find pagination Bye!");
		this.exit();
	}, 30000
);



casper.then(function(){
	this.echo('This is the end');
});

casper.run();
