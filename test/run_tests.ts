

async function main() {
    await (await import('./parser.test.js')).main()
    await (await import('./bytesify.test.js')).main()
}

main()
    .catch(console.error)
    .finally(() => console.log('passed.'))
