# Contributing to Stepcraft Wiki

Welcome to the Stepcraft Wiki community! We appreciate your interest in contributing to this knowledge base. This guide will help you get started with contributing effectively.

## Ways to Contribute

### 1. Content Improvements
- Fix typos, grammar, or formatting issues
- Update outdated information
- Add missing details to existing pages
- Improve clarity and readability

### 2. New Content
- Add new item, resource, or skill documentation
- Create guides for game mechanics
- Document new locations or areas
- Add enemy information and strategies

### 3. Bug Reports & Feedback
- Report broken links or missing pages
- Suggest improvements to existing content
- Request new documentation topics

## Getting Started

### Quick Edits (Recommended for beginners)
1. Navigate to any page on the wiki
2. Click the "Edit Page" link in the sidebar
3. This opens the file directly in GitHub's editor
4. Make your changes using Markdown syntax
5. Submit a pull request with a clear description


## Content Guidelines

### Markdown Format
All wiki pages use MDX (Markdown with JSX). Here's the basic structure:

```markdown
---
title: "Page Title"
description: "Brief description for search results"
---

# Page Title

Your content here...

## Sections

Use H2 for main sections.

### Subsections

Use H3 for subsections.
```

### Frontmatter Requirements
Every page should include:
- `title`: Clear, descriptive page title
- `description`: Brief summary for search results

### Style Guidelines
- Use clear, concise language
- Include relevant details without being overly verbose
- Use tables for structured data (stats, crafting recipes, etc.)
- Include images when helpful (stored in `/public/assets/`)
- Link to related pages using relative paths

### Example Content Structure
```markdown
---
title: "Example Item"
description: "A powerful weapon used by warriors"
---

# Example Item

Brief description of the item.

## Stats
| Attribute | Value |
|-----------|-------|
| Damage    | 50    |
| Level     | 10    |

## How to Obtain
- Crafted at the forge
- Found in treasure chests
- Dropped by specific enemies

## Related Items
- [Similar Item](/docs/items/individual/similar_item)
- [Crafting Material](/docs/resources/individual/material)
```

## File Organization

### Directory Structure
```
contents/docs/
├── characters/          # Character-related content
├── enemies/            # Enemy information
├── items/              # Item documentation
├── map/                # Location information
├── resources/          # Resource documentation
├── skills/             # Skill guides
└── getting-started/    # Beginner guides
```

### File Naming
- Use lowercase with underscores: `fire_sword.mdx`
- Match in-game names when possible
- Keep names concise but descriptive

## Quality Standards

### Before Submitting
- [ ] Spell-check your content
- [ ] Verify all links work correctly
- [ ] Ensure formatting is consistent
- [ ] Test that images display properly
- [ ] Confirm information accuracy

### Content Accuracy
- Base information on current game version
- Include version numbers when relevant
- Mark outdated content clearly
- Provide sources when possible

## Community Guidelines

### Be Respectful
- Use friendly, helpful language
- Respect different play styles and opinions
- Provide constructive feedback in reviews

### Collaborate Effectively
- Communicate clearly in pull requests
- Respond to feedback promptly
- Help other contributors when possible

### Credit Others
- Acknowledge sources and contributors
- Don't claim credit for others' work
- Give proper attribution for images/data

## Technical Notes

### Local Development (Optional)
If you want to preview changes locally:

```bash
npm install
npm run dev
```

### Content Generation
The wiki includes scripts for generating pages:
- `npm run generate-content-json` - Updates search index
- `npm run generate-item-pages` - Generates item pages
- `npm run generate-resource-pages` - Generates resource pages

### Image Guidelines
- Store images in appropriate `/public/assets/` subdirectories
- Use descriptive filenames matching content
- Optimize image sizes for web
- Include alt text for accessibility

## 📞 Getting Help

### Need Assistance?
- Open an issue for questions or discussions
- Join community channels (if available)
- Review existing pull requests for examples

### Reporting Issues
Use the "Give Feedback" link on any page to:
- Report errors or outdated information
- Suggest new content
- Ask questions about game mechanics

## Recognition

Contributors are recognized through:
- Git history and GitHub profiles
- Community acknowledgment
- Potential featured contributions

---

Thank you for helping make the Stepcraft Wiki better for everyone!

*Need help? Open an issue or reach out to the maintainers.*
