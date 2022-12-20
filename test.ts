import { ParseURL } from "./utils/transform"

function testParseURL() {
    // Sample test cases
    var testCases = [
        "https://www.test.com/products/productA.html?a=5435&b=test#reviews",
        "https://www.simulation.net/epnyno/hleryo/eomoxf?l0=70&var0=53&a10=33&var9=k&d1=11&u10=94",
        "https://www.simulation.net/epnyno/hleryo/eomoxf?l0=70&var0=53&a10=33&var9=k&d1=11&u10=94"
    ]

    var testAnswers = [
        {
            domain: 'www.test.com',
            path: '/products/productA.html',
            query_object: { a: '5435', b: 'test' },
            hash: 'reviews'
        },
        {
            domain: 'www.simulation.net',
            path: '/epnyno/hleryo/eomoxf',
            query_object: { l0: '70', var0: '53', a10: '33', var9: 'k', d1: '11', u10: '94' },
            hash: ''
        },
        {
            domain: 'www.simulation',
            path: '/epnyno/hleryo/eomoxf',
            query_object: { l0: '70', var0: '53', a10: '33', var9: 'k', d1: '11', u10: '94' },
            hash: ''
        }
    ]

    var testResults = []

    // Start test
    for(var i = 0; i < testCases.length; i ++) {
        let answer = ParseURL(testCases[i])

        let answerString = JSON.stringify(answer)
        let testAnswerString = JSON.stringify(testAnswers[i])
        if (answerString == testAnswerString) testResults.push(true)
        else testResults.push(false)
    }

    // Show test result [true, true, false]
    console.log("test result for ParseURL function: ", testResults)
}

testParseURL()