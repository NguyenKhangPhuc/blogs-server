const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe("Most like in all blogs test", () => {
    test("When there are many blogs in a list", () => {
        const result = listHelper.mostLikes(listHelper.blogs)
        console.log(result, " This is test case")
        assert.deepStrictEqual(result, {
            author: "Edsger W. Dijkstra",
            likes: 17
        })
    })
})