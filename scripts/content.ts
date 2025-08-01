import { promises as fs } from "fs"
import path from "path"

import { Documents } from "@/settings/documents"
import grayMatter from "gray-matter"
import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import remarkStringify from "remark-stringify"
import { unified } from "unified"
import { Node, Parent } from "unist"
import { visit } from "unist-util-visit"

import { Paths } from "@/lib/pageroutes"

const docsDir = path.join(process.cwd(), "contents/docs")
const outputDir = path.join(process.cwd(), "public", "search-data")

interface MdxJsxFlowElement extends Node {
  name: string
  children?: Node[]
}

function isMdxJsxFlowElement(node: Node): node is MdxJsxFlowElement {
  return node.type === "mdxJsxFlowElement" && "name" in node
}

function isRoute(
  node: Paths
): node is Extract<Paths, { href: string; title: string }> {
  return "href" in node && "title" in node
}

function createSlug(filePath: string): string {
  const relativePath = path.relative(docsDir, filePath)
  const parsed = path.parse(relativePath)

  const slugPath = parsed.dir ? `${parsed.dir}/${parsed.name}` : parsed.name
  const normalizedSlug = slugPath.replace(/\\/g, "/")

  if (parsed.name === "index") {
    return `/${parsed.dir.replace(/\\/g, "/")}` || "/"
  } else {
    return `/${normalizedSlug}`
  }
}

function findDocumentBySlug(slug: string): Paths | null {
  function searchDocs(docs: Paths[], currentPath = ""): Paths | null {
    for (const doc of docs) {
      if (isRoute(doc)) {
        const fullPath = currentPath + doc.href
        if (fullPath === slug) return doc
        if (doc.items) {
          const found: Paths | null = searchDocs(doc.items, fullPath)
          if (found) return found
        }
      }
    }
    return null
  }
  return searchDocs(Documents)
}

async function ensureDirectoryExists(dir: string) {
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }
}

function removeCustomComponents() {
  const customComponentNames = [
    "Tabs",
    "TabsList",
    "TabsTrigger",
    "pre",
    "Mermaid",
    "Card",
    "CardGrid",
    "Step",
    "StepItem",
    "Note",
    "FileTree",
    "Folder",
    "File",
  ]

  return (tree: Node) => {
    visit(
      tree,
      "mdxJsxFlowElement",
      (node: Node, index: number | null, parent: Parent | null) => {
        if (
          isMdxJsxFlowElement(node) &&
          parent &&
          Array.isArray(parent.children) &&
          customComponentNames.includes(node.name)
        ) {
          parent.children.splice(index!, 1)
        }
      }
    )
  }
}

function cleanContentForSearch(content: string): string {
  let cleanedContent = content

  // Remove code blocks first
  cleanedContent = cleanedContent.replace(/```[\s\S]*?```/g, " ")
  cleanedContent = cleanedContent.replace(/`([^`]+)`/g, "$1")
  
  // Remove JSX/HTML elements and their attributes (including className, src, alt, etc.)
  // This handles both self-closing and regular tags
  cleanedContent = cleanedContent.replace(/<[^>]*>/g, " ")
  
  // Remove className and other attributes that might appear without proper tags
  cleanedContent = cleanedContent.replace(/className\s*=\s*["'][^"']*["']/g, " ")
  cleanedContent = cleanedContent.replace(/src\s*=\s*["'][^"']*["']/g, " ")
  cleanedContent = cleanedContent.replace(/alt\s*=\s*["'][^"']*["']/g, " ")
  cleanedContent = cleanedContent.replace(/href\s*=\s*["'][^"']*["']/g, " ")
  cleanedContent = cleanedContent.replace(/id\s*=\s*["'][^"']*["']/g, " ")
  
  // Remove remaining attribute patterns
  cleanedContent = cleanedContent.replace(/\w+\s*=\s*["'][^"']*["']/g, " ")
  
  // Remove markdown headers
  cleanedContent = cleanedContent.replace(/#{1,6}\s+(.+)/g, "$1")
  
  // Remove markdown formatting
  cleanedContent = cleanedContent
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")

  // Convert markdown links to just the text
  cleanedContent = cleanedContent.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
  
  // Clean up table formatting
  cleanedContent = cleanedContent.replace(/\|.*\|[\r\n]?/gm, (match) => {
    return match
      .split("|")
      .filter((cell) => cell.trim())
      .map((cell) => cell.trim())
      .join(" ")
  })

  // Remove custom component tags
  cleanedContent = cleanedContent.replace(
    /<(?:Note|Card|Step|FileTree|Folder|File|Mermaid)[^>]*>([\s\S]*?)<\/(?:Note|Card|Step|FileTree|Folder|File|Mermaid)>/g,
    "$1"
  )

  // Clean up list markers and blockquotes
  cleanedContent = cleanedContent
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^\s*\[[x\s]\]\s+/gm, "")
    .replace(/^\s*>\s+/gm, "")

  // Remove any remaining special characters and normalize whitespace
  cleanedContent = cleanedContent
    .replace(/[^\w\s-:]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim()

  return cleanedContent
}

async function processMdxFile(filePath: string) {
  const rawMdx = await fs.readFile(filePath, "utf-8")
  const { content, data: frontmatter } = grayMatter(rawMdx)

  const processed = await unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(removeCustomComponents)
    .use(remarkStringify)
    .process(content)

  const documentContent = String(processed.value)

  const headings =
    documentContent
      .match(/^##\s+(.+)$/gm)
      ?.map((h) => h.replace(/^##\s+/, "").trim()) || []

  const extractedKeywords = new Set([
    ...(frontmatter.keywords || []),
    ...headings,
    ...(documentContent.match(/\*\*([^*]+)\*\*/g) || []).map((m) =>
      m.replace(/\*\*/g, "").trim()
    ),
    ...(documentContent.match(/`([^`]+)`/g) || []).map((m) =>
      m.replace(/`/g, "").trim()
    ),
  ])

  const slug = createSlug(filePath)
  const matchedDoc = findDocumentBySlug(slug)

  return {
    slug,
    title:
      frontmatter.title ||
      (matchedDoc && isRoute(matchedDoc) ? matchedDoc.title : "Untitled"),
    description: frontmatter.description || "",
    content: documentContent,
    _searchMeta: {
      cleanContent: cleanContentForSearch(documentContent),
      headings,
      keywords: Array.from(extractedKeywords),
    },
  }
}

async function getMdxFiles(dir: string): Promise<string[]> {
  let files: string[] = []
  const items = await fs.readdir(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    if (item.isDirectory()) {
      const subFiles = await getMdxFiles(fullPath)
      files = files.concat(subFiles)
    } else if (item.name.endsWith(".mdx")) {
      files.push(fullPath)
    }
  }

  return files
}

// Definición del tipo para los datos de búsqueda de items
interface ItemSearchData {
  slug: string;
  title: string;
  description: string;
  content: string;
  _searchMeta: {
    cleanContent: string;
    headings: string[];
    keywords: (string | undefined)[];
  };
}

function generateItemsSearchData() {
  try {
    // Dynamic import of items data
    const itemsPath = path.resolve(process.cwd(), "files/data/items.ts")
    delete require.cache[itemsPath]
    const { allItems } = require(itemsPath)
    
    const itemsSearchData: ItemSearchData[] = []
    
    // Convert each item to search data format
    Object.values(allItems).forEach((item: any) => {
      const searchableContent = [
        item.name,
        item.description || '',
        item.type,
        item.itemClass || '',
        item.equipLocation || '',
        // Convert stats to searchable text
        item.stats ? Object.entries(item.stats).map(([key, value]) => `${key}: ${value}`).join(', ') : '',
        item.statBoost ? Object.entries(item.statBoost.stats).map(([key, value]) => `${key}: ${value}`).join(', ') : '',
        item.classLocked ? item.classLocked.join(', ') : '',
        item.levelLocked ? `level ${item.levelLocked}` : '',
      ].filter(Boolean).join(' ')
      
      itemsSearchData.push({
        slug: `/items#${item.key}`,
        title: item.name,
        description: item.description || `${item.type} - ${item.itemClass || 'item'}`,
        content: searchableContent,
        _searchMeta: {
          cleanContent: searchableContent.toLowerCase(),
          headings: [item.name, item.type],
          keywords: [
            item.name,
            item.type,
            item.itemClass,
            item.equipLocation,
            ...(item.classLocked || []),
            ...(item.stats ? Object.keys(item.stats) : []),
          ].filter(Boolean)
        }
      })
    })
    
    return itemsSearchData
  } catch (error) {
    console.error("Error generating items search data:", error)
    return []
  }
}

async function convertMdxToJson() {
  try {
    await ensureDirectoryExists(outputDir)

    const mdxFiles = await getMdxFiles(docsDir)
    const combinedData = []

    for (const file of mdxFiles) {
      const jsonData = await processMdxFile(file)
      combinedData.push(jsonData)
    }

    // Add items data to search
    const itemsData = generateItemsSearchData()
    combinedData.push(...itemsData)

    const combinedOutputPath = path.join(outputDir, "documents.json")
    await fs.writeFile(
      combinedOutputPath,
      JSON.stringify(combinedData, null, 2)
    )
    
    console.log(`Generated search data with ${combinedData.length} entries (${itemsData.length} items)`)
  } catch (err) {
    console.error("Error processing MDX files:", err)
  }
}

convertMdxToJson()
