import { promises as fs } from "fs"
import path from "path"

const docsDir = path.join(process.cwd(), "contents/docs")

async function getMdxFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name)
      if (entry.isDirectory()) return getMdxFiles(entryPath)
      return entry.name.endsWith(".mdx") ? [entryPath] : []
    })
  )

  return files.flat()
}

function routeForFile(filePath) {
  const relativePath = path.relative(docsDir, filePath).replace(/\\/g, "/")
  const route = relativePath.endsWith("/index.mdx")
    ? relativePath.slice(0, -"/index.mdx".length)
    : relativePath.slice(0, -".mdx".length)

  return `/docs/${route}`.replace(/\/$/, "")
}

function normalizeTarget(target) {
  return target.split(/[?#]/, 1)[0].replace(/\/$/, "")
}

function findInternalLinks(file, content) {
  const references = []
  const patterns = [
    /\[[^\]]*\]\((\/docs(?:\/[^\s)"']*)?)(?:\s+["'][^"']*["'])?\)/g,
    /href\s*=\s*["'](\/docs(?:\/[^"']*)?)["']/g,
  ]

  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) {
      const index = match.index ?? 0
      references.push({
        file,
        line: content.slice(0, index).split("\n").length,
        target: normalizeTarget(match[1]),
      })
    }
  }

  return references
}

async function main() {
  const files = await getMdxFiles(docsDir)
  const routes = new Set(files.map(routeForFile))
  const brokenLinks = []

  for (const file of files) {
    const content = await fs.readFile(file, "utf8")
    brokenLinks.push(
      ...findInternalLinks(path.relative(process.cwd(), file), content).filter(
        ({ target }) => !routes.has(target)
      )
    )
  }

  if (brokenLinks.length === 0) {
    console.log(`Validated internal links in ${files.length} MDX files.`)
    return
  }

  for (const { file, line, target } of brokenLinks) {
    console.error(`${file}:${line} -> ${target}`)
  }

  const uniqueTargets = new Set(brokenLinks.map(({ target }) => target)).size
  console.error(
    `Found ${brokenLinks.length} broken internal links to ${uniqueTargets} missing routes.`
  )
  process.exitCode = 1
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
