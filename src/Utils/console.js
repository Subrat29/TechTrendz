function consoleTerminal(...args) {
    if (import.meta.env.DEV) {
        console.log(...args)
    }
}

function consoleError(...args) {
    if (import.meta.env.DEV) {
        console.error(...args)
    }
}

export { consoleTerminal, consoleError }