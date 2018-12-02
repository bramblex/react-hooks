import { inputsChange } from "../src/inputs";
import * as assert from 'assert'

assert.equal(inputsChange(undefined, undefined), true)
assert.equal(inputsChange([], []), false)

assert.equal(inputsChange([1], ['1']), true)
assert.equal(inputsChange([1], [1, 2]), true)

const obj = {}
assert.equal(inputsChange([obj], [obj]), false)
assert.equal(inputsChange([1, 2, 3], [1, 2, 3]), false)