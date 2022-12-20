"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var transform_1 = require("./utils/transform");
function testParseURL() {
    var testCases = [
        "https://www.test.com/products/productA.html?a=5435&b=test#reviews",
        "https://www.simulation.net/epnyno/hleryo/eomoxf?l0=70&var0=53&a10=33&var9=k&d1=11&u10=94",
        "https://www.simulation.net/epnyno/hleryo/eomoxf?l0=70&var0=53&a10=33&var9=k&d1=11&u10=94"
    ];
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
    ];
    var testResults = [];
    for (var i = 0; i < testCases.length; i++) {
        var answer = transform_1.ParseURL(testCases[i]);
        var answerString = JSON.stringify(answer);
        var testAnswerString = JSON.stringify(testAnswers[i]);
        if (answerString == testAnswerString)
            testResults.push(true);
        else
            testResults.push(false);
    }
    console.log("test result for ParseURL function: ", testResults);
}
testParseURL();
