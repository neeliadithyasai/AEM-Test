# Quick Setup Guide - 3-Card Carousel Component

## 1. File Structure
Copy the files from `example-implementation/` to your AEM project:

```
/apps/your-project/components/carousel/
├── .content.xml
├── carousel.html
├── clientlibs/
│   ├── .content.xml
│   ├── css/
│   │   └── carousel.css
│   └── js/
│       └── carousel.js
```

## 2. Include Clientlib in Your Page

### Option A: In your page template clientlib
Add to your page template's clientlib dependencies:
```xml
<jcr:root
    categories="[your-project.components.carousel]"
    dependencies="[core.wcm.components.carousel.v1]"/>
```

### Option B: In your page component HTL
Include in your page component's HTL template:
```html
<sly data-sly-call="${clientlib.css @ categories='your-project.components.carousel'}"/>
<sly data-sly-call="${clientlib.js @ categories='your-project.components.carousel'}"/>
```

## 3. Allow Component in Template Policy

Add the component to your template's policy:
```xml
<jcr:root
    sling:resourceType="wcm/core/components/policy/policy"
    components="[
        your-project/components/carousel
    ]"/>
```

## 4. Usage in AEM

1. **Add the component** to your page from the component browser
2. **Configure properties** in the component dialog (autoplay, delay, etc.)
3. **Add child components** (your custom card components) to the carousel
4. **Preview** the page to see 3 cards displayed at once

## 5. Customization Options

### Change Number of Cards
To show different numbers of cards, modify the CSS:
```css
.custom-carousel-3cards .cmp-carousel__item {
    flex: 0 0 calc(100% / 4); /* Shows 4 cards */
}
```

### Modify Responsive Breakpoints
Update the media queries in `carousel.css`:
```css
@media (max-width: 1024px) {
    .custom-carousel-3cards .cmp-carousel__item {
        flex: 0 0 calc(100% / 2); /* 2 cards on tablet */
    }
}
```

### Add Touch/Swipe Support
Add touch event listeners to the JavaScript:
```javascript
// Add to CustomCarousel.prototype.bindEvents
var startX = 0;
var endX = 0;

this.track.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
});

this.track.addEventListener('touchend', function(e) {
    endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) {
        self.next(); // Swipe left
    } else if (endX - startX > 50) {
        self.previous(); // Swipe right
    }
});
```

## 6. Troubleshooting

### Component Not Showing
- Check if clientlib is included in page
- Verify component is allowed in template policy
- Ensure core carousel dependencies are loaded

### Cards Not Displaying Properly
- Check if child components are being added correctly
- Verify CSS is loading (inspect element)
- Ensure card components have proper structure

### JavaScript Not Working
- Check browser console for errors
- Verify clientlib JavaScript is loading
- Ensure DOM is ready before initialization

## 7. Best Practices

1. **Use semantic HTML** in your card components
2. **Optimize images** for better performance
3. **Test on different devices** for responsive behavior
4. **Add proper ARIA labels** for accessibility
5. **Consider lazy loading** for large number of cards

## 8. Example Card Component

Here's a simple card component that works well with the carousel:

```html
<!-- card.html -->
<div class="custom-card">
    <div class="custom-card__image">
        <img src="${properties.image}" alt="${properties.alt}"/>
    </div>
    <div class="custom-card__content">
        <h3 class="custom-card__title">${properties.title}</h3>
        <p class="custom-card__description">${properties.description}</p>
        <a href="${properties.link}" class="custom-card__link">Read More</a>
    </div>
</div>
```

```css
/* card.css */
.custom-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s ease;
}

.custom-card:hover {
    transform: translateY(-5px);
}

.custom-card__image {
    flex-shrink: 0;
    height: 200px;
    overflow: hidden;
}

.custom-card__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.custom-card__content {
    padding: 16px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.custom-card__title {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
}

.custom-card__description {
    margin: 0 0 16px 0;
    flex-grow: 1;
    color: #666;
}

.custom-card__link {
    align-self: flex-start;
    color: #007cba;
    text-decoration: none;
    font-weight: 500;
}
```

This setup will give you a fully functional 3-card carousel that slides one card at a time with smooth transitions and responsive behavior!