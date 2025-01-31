import {test} from 'vitest'

test("it runs the server", async () => {
    const response = await fetch('http://localhost:3000', { method: 'GET' })
    expect(await response.text()).toBe('Hello Bun!!')

})

test("it returns text", () => {

})