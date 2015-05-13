querystring = require "querystring"
request = require "request"
require "colors"
companyNames = require "./lib/company.json"
status = require "./lib/status.json"

NUM_TO_COMPANY_URL = "http://www.kuaidi100.com/autonumber/auto"
QUERY_URL = "http://www.kuaidi100.com/query"

query = (company, number) ->
    queryURL2 = QUERY_URL + "?" + 
        querystring.stringify({type: company, postid: number})

    request queryURL2, (error, response, body) ->
        if error
            console.error error.toString().red.bold
            process.exit(1)
        else
            result = JSON.parse body
            if result.status isnt "200"
                console.error result.message.red.bold
            else
                console.log "=========================="
                console.log "快递公司 : #{companyNames[company]}".grey.bold
                console.log "运单号 : #{number}".grey.bold
                state = result['state']
                console.log "状态 : #{status[state][0]}"[status[state][1]]['bold']
                console.log "=========================="
                result['data'].forEach (data) ->
                    console.log "[#{data.time.cyan}]" + "\t#{data.context}".grey.bold
                console.log "=========================="

module.exports = (number) ->
    # number is your tracking No.
    # first get company names from NUM_TO_COMPANY_URL query
    queryURL = NUM_TO_COMPANY_URL + "?" + querystring.stringify({num: number})
    request queryURL, (error, response, body) ->
        if error
            console.error error.toString().red.bold
            process.exit(1)
        else
            companies = JSON.parse(body)
            if companies.length < 1
                console.error "Wrong tracking no, please try again!".red.bold
            else if companies.length is 1
                company = companies[0].comCode
                query(company, number)
            else
                console.log "有#{companies.length}家快递公司，请选择一家:".green
                console.log "==="
                companies.forEach (company, i) ->
                    console.log "#{i+1} : #{companyNames[company.comCode]}".grey
                console.log "==="
                process.stdout.write "请输入序号: "
                process.stdin.resume()
                process.stdin.setEncoding('utf8')
                process.stdin.on "data", (text) ->
                    chosen = text.trim()
                    try
                        chosen = parseInt chosen
                        if 1 <= chosen <= companies.length
                            process.stdin.pause()
                            company = companies[chosen-1].comCode
                            query(company, number)
                        else
                            process.stdout.write "请输入序号: "
                    catch e
                        process.stdout.write "请输入序号: "
                    
