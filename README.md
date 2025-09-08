# 🎨 UICG - UI Component Generator

A accessible UI component library built with **Astro**, **Tailwind CSS**, and **TypeScript**. Generate beautiful, WCAG-compliant components with excellent developer experience.

## ✨ Features

- 🎯 **Components**: Button, Input, Hero, Fieldset, Alert, Modal, and more
- ♿ **Accessibility First**: WCAG 2.1 AA compliant with full screen reader support
- 🎨 **Beautiful Design**: Modern styling with dark mode support as a staring point
- 🔧 **Developer Experience**: TypeScript support, CVA variants, and comprehensive documentation
- ⚡ **Performance**: Utility-first CSS with Tailwind, optimized bundle sizes
- 📱 **Responsive**: Mobile-first design with built-in responsive breakpoints

## 🚀 Quick Start

### Prerequisites

Astro project with tailwind installed.

```bash
npm create astro@latest
npx astro add tailwind
```

### Installation

```bash
npx ui-gen init
```

### Adding Components

```bash
npx ui-gen add button
```

## 📁 Project Structure

```
ui-gen/
├── apps/
│   ├── cli/                    # Component CLI tool
│   │   ├── src/
│   │   │   ├── components/     # Source components
│   │   │   │   ├── Button/
│   │   │   │   ├── Input/
│   │   │   │   ├── Hero/
│   │   │   │   └── ...
│   │   │   └── templates/      # Component templates
│   │   └── cli.js             # CLI entry point
│   └── docs/                   # Documentation site
│       ├── src/
│       │   ├── content/docs/   # Component documentation
│       │   └── components/     # Doc-specific components
│       └── astro.config.mjs
├── packages/                   # Shared packages
└── README.md
```

## 🧩 Available Components

| Component | Status | Features |
|-----------|--------|----------|
| **Button** | ✅ Stable | Intent variants, sizes, loading states, icons, ARIA support |
| **Input** | ✅ Stable | All HTML5 types, states, validation, prefix/suffix, accessibility |
| **Hero** | ✅ Stable | Backgrounds, gradients, overlays, responsive, animations |
| **Fieldset** | ✅ Stable | Form grouping, intents, sizes, descriptions, accessibility |
| **Alert** | ✅ Stable | Dismissible, intents, icons, ARIA announcements |
| **Modal** | ✅ Stable | Focus management, backdrop, animations, accessibility |
| **Sidebar** | 🚧 In Progress | Responsive, collapsible, navigation support |

## 💻 Development

### Creating New Components

1. **Create the component**:
   ```bash
   # Create component file
   touch apps/cli/src/components/YourComponent/your-component.astro
   ```

2. **Add component logic**:
   ```astro
   ---
   import { cva, type VariantProps } from 'class-variance-authority'
   import { twMerge } from 'tailwind-merge'
   
   interface YourComponentProps {
     // Define your props
   }
   
   const variants = cva(
     // Base classes
     'base-classes',
     {
       variants: {
         // Define variants
       }
     }
   )
   ---
   
   <div class={variants()}>
     <slot />
   </div>
   ```

3. **Create documentation**:
   ```bash
   # Add to docs
   touch apps/docs/src/content/docs/components/your-component.mdx
   ```

4. **Test and iterate**:
   ```bash
   # Start dev server
   npm run docs
   ```

### Development Commands

```bash
# Start documentation development server
npm run docs

# Build documentation
npm run build

# Preview built documentation
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

### Component Best Practices

1. **Accessibility**: Always implement ARIA attributes and keyboard navigation
2. **TypeScript**: Use proper interfaces and type definitions
3. **CVA**: Use Class Variance Authority for maintainable variant styles
4. **Documentation**: Include comprehensive examples and accessibility notes
5. **Testing**: Test with screen readers and keyboard navigation
6. **Dark Mode**: Support both system and class-based dark mode

## 📖 Documentation

Visit the documentation site to see all components in action:

```bash
npm run docs
```

The documentation includes:
- 🎮 **Interactive Examples**: Live component previews
- 📚 **API Reference**: Complete prop documentation
- ♿ **Accessibility**: WCAG compliance details
- 🎨 **Design Tokens**: Color, spacing, and typography guidelines
- 💡 **Usage Examples**: Real-world implementation patterns

## 🎯 Design Principles

- **Accessibility First**: Every component meets WCAG 2.1 AA standards
- **Modern Design**: Clean, contemporary styling with attention to detail
- **Developer Experience**: Intuitive APIs with excellent TypeScript support
- **Customizable**: Flexible theming and easy customization
- **Performance**: Optimized for speed and minimal bundle size
- **Consistency**: Unified design language across all components

## 🤝 Contributing

1. **Follow Conventional Commits**: Use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) for all commit messages
2. **Test Accessibility**: Ensure all changes maintain WCAG compliance
3. **Update Documentation**: Include examples and prop documentation
4. **Code Quality**: Follow existing patterns and use TypeScript

### Commit Types

- `feat:` New features or component enhancements
- `fix:` Bug fixes or accessibility improvements  
- `docs:` Documentation updates
- `style:` Code formatting or visual styling changes
- `refactor:` Code refactoring without feature changes
- `test:` Adding or updating tests
- `chore:` Build process or tool changes

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Built with:
- [Astro](https://astro.build/) - Modern web framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Class Variance Authority](https://cva.style/) - Component variants
- [TypeScript](https://www.typescriptlang.org/) - Type safety

---

**Made with ❤️ for developers who care about accessibility and design quality.**