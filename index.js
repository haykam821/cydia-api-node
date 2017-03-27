/**
 * cydia-api-node
 * @version 1.0.1
 * @author 1Conan <me@1conan.com> (https://1conan.com)
 */
const jsdom = require("jsdom");
const request = require("superagent");
const repos = require("./repos.json");
const querystring = require("querystring");

const useragent = "cydia-api-node/0.1.0";

let self = module.exports = {};

/**
 * @desc Searches for tweaks
 * @param {string} keyword
 * @return {object} results
 */
self.search = function(keyword) {
	
	return new Promise(function(resolve, reject){
        const query = querystring.stringify({query: keyword});
        const req = request.get(`https://cydia.saurik.com/api/macciti?${query}`)
        .set("User-Agent", useragent);
        
        req.then((res) => {
            if(res.text == "{\"results\":[]}") {
                return resolve(false);
            }
			const result = res.body;
            const results = result.results;
            return resolve(results);        
        });
    });

}

/**
 * @desc Retrieves price for package
 * @param {string} pkgnme
 * @return {number}
 */
self.getPrice = function(pkgname) {
    return new Promise(function(resolve, reject){
        const query = querystring.stringify({query: pkgname});
        const req = request.get(`https://cydia.saurik.com/api/ibbignerd?${query}`)
        .set("User-Agent", useragent);
        
        req.then((res) => {
            let price;
            if(res.text == "null") {
                price = 0;
            } else {
                price = Math.round(res.body.msrp * 100) / 100;
            }
            return resolve(price);        
        });
    });
};
    
/**
 * @desc Retrieves info for package
 * @param {string} displayname - Package Display Name or Package Name
 * @return {object/bool} - (display, name ,section, summary, version) / false for not found tweaks
 */
self.getInfo = function(displayname) {
    return new Promise(function(resolve, reject){
        const query = querystring.stringify({query: displayname});
        const req = request.get(`https://cydia.saurik.com/api/macciti?${query}`)
        .set("User-Agent", useragent);

        req.then((res) => {
            if(res.text == "{\"results\":[]}") {
                return resolve(false);
            }
            const result = res.body;
            const results = result.results;
            const resultsLength = results.length; 
            let foundTweak = false;
            for(let i = 0; i < resultsLength; i++){
                if(results[i].display !== null) {
                    if(displayname.toLowerCase() === results[i].display.toLowerCase()) {
                        foundTweak = true;
                        return resolve(results[i]);
                    }  
                    if(displayname.toLowerCase() === results[i].name.toLowerCase()) {
                        foundTweak = true;
                        return resolve(results[i]);
                    }
                }    
            }
            if(!foundTweak) {
                return resolve(false);
            }
        });
    });
};

/**
 * @desc
 * @param {string} pkgnamae
 * @return {bool/object}
 */
self.getRepo = function(pkgname) {
    return new Promise(function(resolve, reject){
        const pkg = querystring.escape(pkgname);
        const link = `http://cydia.saurik.com/package/${pkg}`;
        const path = './/panel/footer/p/span[2]';
        
        jsdom.env({
            url: link,
            userAgent: useragent,
            done: function(err, window) {
                if(err) {
                    return resolve(false);
                }
                const document = window.document;
                const result = document.evaluate(path, document.body, null, 2, null);
                const repo = result.stringValue;
                window.close();
                return resolve({name:repo, link: repos[`${repo}`]});
            }
        });
    });
}

/**
 * @desc Get all info for Package
 * @param {string} displayname - Package Display Name or Package Name
 * @return {object/bool} - (display, name ,section, summary, version, price) / false for not found tweaks
 */
 self.getAllInfo = function(displayname) {
    return new Promise(function(resolve, reject){
        let info = self.getInfo(displayname).then((info) => {
            if(!info) {
                return resolve(false);
            } else {
                const price = self.getPrice(info.name).then(price => {
                    info.price = price;
                    const repo = self.getRepo(info.name).then(repo => {
						info.repo = repo;
                        return resolve(info);
                    });
                });
            }
        });
     });
};