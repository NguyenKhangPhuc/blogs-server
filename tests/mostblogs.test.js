const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe("Most blogs test", () => {
    test("When there are many blogs in a list", () => {
        const result = listHelper.mostBlogs(listHelper.blogs)
        console.log(result, " This is test case")
        assert.deepStrictEqual(result, {
            author: "Robert C. Martin",
            blogs: 3
        })
    })
})