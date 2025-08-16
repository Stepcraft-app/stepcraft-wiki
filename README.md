# Stepcraft Wiki

A comprehensive and modern wiki for the mobile RPG game **Stepcraft**, built with **Next.js**, **React**, **Tailwind CSS**, and **TypeScript**. This wiki provides detailed documentation about characters, skills, locations, enemies, resources, and more to help players explore the world of Stepcraft.

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)


## About Stepcraft

**Stepcraft** is a mobile RPG that combines classic fantasy elements with modern gameplay mechanics. Players can:

- **Create Characters:** Choose from multiple races, each with unique abilities and storylines
- **Master Skills:** Develop expertise in combat, crafting, gathering, and social interactions
- **Explore the World:** Discover diverse regions, from mystical forests to ancient ruins
- **Complete Quests:** Follow engaging storylines and help NPCs with their challenges
- **Craft Equipment:** Create weapons, armor, and tools to enhance your abilities
- **Battle Enemies:** Face off against a variety of creatures and monsters



## Quick Start

### Installation

```bash
git clone https://github.com/Stepcraft-app/stepcraft-wiki.git
cd stepcraft-wiki
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the project locally.

**For production:**

```bash
npm run build
npm run start
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
npm run lint:fix     # Fix linting errors
npm run format       # Format code
npm run clean        # Clean and format all code
```

---

## Project Structure

```
stepcraft-wiki/
├── app/                    # Next.js pages
├── components/             # Reusable React components
├── contents/              # MDX content organized by categories
│   └── docs/
│       ├── characters/    # Character information
│       ├── enemies/       # Enemy bestiary
│       ├── items/         # Item catalog
│       ├── map/           # World locations
│       ├── resources/     # Resources and materials
│       └── skills/        # Skill guides
├── public/                # Static assets
│   ├── assets/           # Game images
│   └── search-data/      # Search data
└── settings/             # Navigation and content configuration
```

---

## Contributing

Contributions are welcome! This wiki is primarily maintained by the community.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/new-feature`
3. **Make your changes** and document game content
4. **Commit your changes:** `git commit -m 'Add new information about...'`
5. **Push to the branch:** `git push origin feature/new-feature`
6. **Open a Pull Request**

### Types of Contributions

- **Content:** Add information about new game features
- **Corrections:** Fix incorrect or outdated information
- **UI Improvements:** Enhance user experience
- **Translations:** Add support for new languages
- **Documentation:** Improve technical documentation

### Contribution Guidelines

- Maintain consistent MDX formatting
- Use web-optimized images
- Follow naming conventions
- Test your changes locally before making PRs


## Technologies Used

- **[Next.js 15](https://nextjs.org/)** - React framework
- **[React 19](https://reactjs.org/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Static typing
- **[Tailwind CSS](https://tailwindcss.com/)** - CSS framework
- **[MDX](https://mdxjs.com/)** - Markdown with React components
- **[Radix UI](https://www.radix-ui.com/)** - Accessible UI components
- **[Rehype/Remark](https://github.com/rehypejs/rehype)** - Markdown processing


---

*Last updated: 2025 - Wiki maintained by the community*

.
