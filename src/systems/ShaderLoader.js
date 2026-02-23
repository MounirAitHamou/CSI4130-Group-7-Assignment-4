export async function loadShader(url) {
    try {
        const response = await fetch("src/shaders/" + url)
        if (!response.ok) {
            throw new Error(`Failed to load shader: ${url}, status: ${response.status}`)
        }
        const text = await response.text()
        return text
    } catch (err) {
        console.error(err)
        return ''
    }
}