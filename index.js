// Generated by CoffeeScript 1.9.1
(function() {
  var NUM_TO_COMPANY_URL, QUERY_URL, companyNames, query, querystring, request, status;

  querystring = require("querystring");

  request = require("request");

  require("colors");

  companyNames = require("./lib/company.json");

  status = require("./lib/status.json");

  NUM_TO_COMPANY_URL = "http://www.kuaidi100.com/autonumber/auto";

  QUERY_URL = "http://www.kuaidi100.com/query";

  query = function(company, number) {
    var queryURL2;
    queryURL2 = QUERY_URL + "?" + querystring.stringify({
      type: company,
      postid: number
    });
    return request(queryURL2, function(error, response, body) {
      var result, state;
      if (error) {
        console.error(error.toString().red.bold);
        return process.exit(1);
      } else {
        result = JSON.parse(body);
        if (result.status !== "200") {
          return console.error(result.message.red.bold);
        } else {
          console.log("==========================");
          console.log(("快递公司 : " + companyNames[company]).grey.bold);
          console.log(("运单号 : " + number).grey.bold);
          state = result['state'];
          console.log(("状态 : " + status[state][0])[status[state][1]]['bold']);
          console.log("==========================");
          result['data'].forEach(function(data) {
            return console.log(("[" + data.time.cyan + "]") + ("\t" + data.context).grey.bold);
          });
          return console.log("==========================");
        }
      }
    });
  };

  module.exports = function(number) {
    var queryURL;
    queryURL = NUM_TO_COMPANY_URL + "?" + querystring.stringify({
      num: number
    });
    return request(queryURL, function(error, response, body) {
      var companies, company;
      if (error) {
        console.error(error.toString().red.bold);
        return process.exit(1);
      } else {
        companies = JSON.parse(body);
        if (companies.length < 1) {
          return console.error("Wrong tracking no, please try again!".red.bold);
        } else if (companies.length === 1) {
          company = companies[0].comCode;
          return query(company, number);
        } else {
          console.log(("有" + companies.length + "家快递公司，请选择一家:").green);
          console.log("===");
          companies.forEach(function(company, i) {
            return console.log(((i + 1) + " : " + companyNames[company.comCode]).grey);
          });
          console.log("===");
          process.stdout.write("请输入序号: ");
          process.stdin.resume();
          process.stdin.setEncoding('utf8');
          return process.stdin.on("data", function(text) {
            var chosen, e;
            chosen = text.trim();
            try {
              chosen = parseInt(chosen);
              if ((1 <= chosen && chosen <= companies.length)) {
                process.stdin.pause();
                company = companies[chosen - 1].comCode;
                return query(company, number);
              } else {
                return process.stdout.write("请输入序号: ");
              }
            } catch (_error) {
              e = _error;
              return process.stdout.write("请输入序号: ");
            }
          });
        }
      }
    });
  };

}).call(this);