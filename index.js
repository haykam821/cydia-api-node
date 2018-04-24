/**
 * cydia-api-node
 * @version 1.1.0
 * @author 1Conan <me@1conan.com> (https://1conan.com)
 */
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
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
self.search = async function(keyword) {
    const query = querystring.stringify({query: keyword});
    const res = await request.get(`https://cydia.saurik.com/api/macciti?${query}`)
    .set("User-Agent", useragent);
    
    if(res.body.results.length !== 0)
        return res.body.results
    
    return false
}

/**
 * @desc Retrieves price for package
 * @param {string} pkgnme
 * @return {number}
 */
self.getPrice = async function(pkgname) {
        const query = querystring.stringify({query: pkgname});
        const res = await request.get(`https://cydia.saurik.com/api/ibbignerd?${query}`)
        .set("User-Agent", useragent);
        
        if(res.text !== `null`) {
            return Math.round(res.body.msrp * 100) / 100;
        }
        
        return 0
};
    
/**
 * @desc Retrieves info for package
 * @param {string} displayname - Package Display Name or Package Name
 * @return {object/bool} - (display, name ,section, summary, version) / false for not found tweaks
 */
self.getInfo = async function(displayname) {
        const query = querystring.stringify({query: displayname});
        const res = await request.get(`https://cydia.saurik.com/api/macciti?${query}`)
        .set("User-Agent", useragent);

        const results = res.body.results
        
        if(results.length !== 0) {
        
            for(let i = 0; i< results.length; i++) {
                if(results[i].display === null) continue
				
                if(displayname.toLowerCase() === results[i].display.toLowerCase() 
                    || displayname.toLowerCase() === results[i].name.toLowerCase()) {
                        
                    results[i].link = `http://cydia.saurik.com/package/${results[i].name}`
                    results[i].img = `http://cydia.saurik.com/icon@2x/${results[i].name}.png`
					return results[i];
                } 
            }
        }
        
        return false
};

/**
 * @desc
 * @param {string} pkgnamae
 * @return {bool/object}
 */
self.getRepo = async function(pkgname) {
        const pkg = querystring.escape(pkgname);
        const link = `http://cydia.saurik.com/package/${pkg}`;
        const path = './/panel/footer/p/span[2]';
        
        const dom = await JSDOM.fromURL(link, {userAgent: useragent})
        const document = dom.window.document
        
        const result = document.evaluate(path, document.body, null, 2, null);
        const repo = result.stringValue;
        dom.window.close();
        return {
            name: repo,
            link: repos[repo],
            addLink: `https://cydia.saurik.com/api/share#?source=${repos[repo]}`
        }
        
}

/**
 * @desc Get all info for Package
 * @param {string} displayname - Package Display Name or Package Name
 * @return {object/bool} - (display, name ,section, summary, version, price) / false for not found tweaks
 */
 self.getAllInfo = async function(displayname) {
    let info = await self.getInfo(displayname)
    if(info === false)
        return false
    
    const price = await self.getPrice(info.name)
    info.price = price
    
    const repo = await self.getRepo(info.name)
    info.repo = repo
    
    return info
};
