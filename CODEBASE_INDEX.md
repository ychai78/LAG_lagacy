# L.A. Girl Cosmetics Shopify Theme - Codebase Index

## Overview
This is a custom Shopify theme for L.A. Girl Cosmetics, built on the Ella theme framework by Halothemes. The theme has been heavily customized with modern features including Tailwind CSS, DaisyUI, and advanced e-commerce functionality.

## Theme Information
- **Theme Name**: Ella (Customized for L.A. Girl)
- **Theme Author**: Halothemes (Customized)
- **Version**: 1.0.0
- **Framework**: Shopify Liquid + Tailwind CSS + DaisyUI

## Directory Structure

### Core Directories

#### `/layout/`
- **theme.liquid** - Main theme layout file containing HTML structure, head section, and body wrapper
  - Includes locksmith security
  - Stamped rewards integration
  - ADA compliance script
  - Responsive design classes
  - Template-specific styling

#### `/config/`
- **settings_schema.json** - Theme customization settings (108KB)
  - Typography settings (fonts, scaling)
  - Header and logo configuration
  - Navigation and mega menu settings
  - Color schemes and branding
  - Homepage sections configuration
  - Product display options
  - Cart and checkout settings
  - Footer configuration
  - Social media integration
  - Multi-language support
- **settings_data.json** - Current theme settings data (75KB)

#### `/sections/` (50+ sections)
Key sections include:
- **navigation-menu.liquid** - Main navigation with mega menu support
- **banner.liquid** - Promotional banners with scheduling
- **announcement-banner.liquid** - Site-wide announcements
- **homepage-slider.liquid** - Hero slideshow
- **featured-collection.liquid** - Product collection displays
- **product-main.liquid** - Product detail page layout
- **cart.liquid** - Shopping cart functionality
- **loyalty.liquid** - Customer loyalty program (60KB)
- **contact-us.liquid** - Contact page with form
- **FAQ.liquid** - Frequently asked questions
- **testimonials.liquid** - Customer reviews`
- **video.liquid** - Video content sections
- **shade-viewer.liquid** - Product shade selection tool

#### `/templates/` (100+ templates)
Key templates include:
- **index.json** - Homepage template with section configuration
- **product.liquid** - Product detail pages
- **collection.liquid** - Collection listing pages
- **cart.liquid** - Shopping cart page
- **page.liquid** - Static pages (about, contact, etc.)
- **blog.liquid** - Blog listing
- **article.liquid** - Blog post detail
- **404.liquid** - Error page
- **password.liquid** - Password protection page
- **gift_card.liquid** - Gift card template

#### `/snippets/` (200+ snippets)
Key snippets include:
- **logo-lagirl.liquid** - L.A. Girl branding
- **footer.liquid** - Site footer
- **breadcrumb.liquid** - Navigation breadcrumbs
- **card-product-*.liquid** - Product card variations
- **collection-sidebar.liquid** - Collection filtering
- **ajax-cart-template.liquid** - AJAX cart functionality
- **newsletter.liquid** - Email signup
- **social-sharing.liquid** - Social media integration
- **locksmith.liquid** - Security and access control

#### `/assets/` (300+ assets)
Key assets include:
- **CSS Files**:
  - `theme-styles.css` - Main theme styles
  - `styleTW.css` - Tailwind CSS compiled styles
  - `mobile.css` - Mobile-specific styles
  - `loyalty.css` - Loyalty program styles
  - `product.css` - Product page styles
  - `cart.css` - Cart page styles
- **JavaScript Files**:
  - `global.js` - Main theme JavaScript
  - `product.js` - Product functionality
  - `cart.js` - Cart functionality
  - `ajax-cart.js` - AJAX cart operations
  - `timber.js` - Theme framework
- **Images**: Logos, icons, banners, product images
- **Fonts**: Custom typography files
- **Configuration**:
  - `package.json` - Node.js dependencies
  - `tailwind.config.js` - Tailwind CSS configuration

#### `/locales/` (7 languages)
- **en.default.json** - English (default)
- **es.json** - Spanish
- **fr.json** - French
- **de.json** - German
- **pt-BR.json** - Portuguese (Brazil)
- **pt-PT.json** - Portuguese (Portugal)
- **ur.json** - Urdu

## Key Features

### Design System
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **Custom Color Palette**:
  - Primary: Black (#000000)
  - Secondary: White (#ffffff)
  - Accent: Pink (#ff3c9e)
  - Brand Pink: (#eb0089)
- **Typography**: Jost and Lato font families
- **Responsive Design**: Mobile-first approach

### E-commerce Features
- **Product Management**:
  - Product variants and options
  - Color swatches
  - Size charts
  - Product reviews and ratings
  - Related products
  - Recently viewed products
- **Shopping Experience**:
  - AJAX cart functionality
  - Quick view products
  - Wishlist functionality
  - Advanced filtering
  - Search functionality
  - Cross-selling
- **Checkout**:
  - Multiple payment methods
  - Shipping calculator
  - Order tracking
  - Customer accounts

### Marketing Features
- **Promotional Tools**:
  - Scheduled banners
  - Newsletter popups
  - Social media integration
  - Instagram feed
  - Customer testimonials
  - Loyalty program
- **Content Management**:
  - Blog system
  - Video content
  - Lookbook pages
  - Marketing resources
  - FAQ system

### Technical Features
- **Performance**:
  - Lazy loading images
  - Optimized assets
  - CDN integration
  - Caching strategies
- **SEO**:
  - Meta tags management
  - Structured data
  - Sitemap generation
  - Canonical URLs
- **Security**:
  - Locksmith access control
  - CSRF protection
  - Secure checkout
- **Analytics**:
  - Google Analytics
  - Facebook Pixel
  - Conversion tracking

### Custom Integrations
- **Third-party Services**:
  - Bazaarvoice reviews
  - Stamped rewards
  - Social login
  - Email marketing
  - Store locator
  - Foundation finder tool
- **Payment Processors**:
  - Shopify Payments
  - PayPal
  - Credit cards
  - Digital wallets

## Development Setup

### Prerequisites
- Node.js and npm
- Shopify CLI
- Git

### Installation
```bash
# Install dependencies
npm install

# Build Tailwind CSS
npm run tw

# Start development server
shopify theme dev
```

### Build Process
- Tailwind CSS compilation with PostCSS
- Asset optimization
- Theme deployment to Shopify

## Customization Guide

### Adding New Sections
1. Create new section file in `/sections/`
2. Define schema for customization options
3. Add to template JSON files as needed

### Styling Changes
1. Modify Tailwind configuration in `tailwind.config.js`
2. Update CSS variables in theme settings
3. Use utility classes for component styling

### JavaScript Functionality
1. Add scripts to `/assets/` directory
2. Include in `theme.liquid` or specific templates
3. Follow Shopify's best practices for performance

## File Size Summary
- **Total Files**: 500+
- **Liquid Templates**: 300+
- **Assets**: 300+
- **Configuration**: 2 files
- **Locales**: 7 languages

## Performance Considerations
- Optimized image loading
- Minified CSS and JavaScript
- Efficient Liquid templating
- CDN asset delivery
- Caching strategies

## Security Features
- Locksmith access control
- CSRF protection
- Secure payment processing
- Input validation
- XSS prevention

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement
- Accessibility compliance (ADA)

## Maintenance Notes
- Regular theme updates
- Security patches
- Performance monitoring
- Content updates
- Backup procedures

---

*This index was generated for the L.A. Girl Cosmetics Shopify theme codebase. For technical support or customization requests, please refer to the theme documentation or contact the development team.* 