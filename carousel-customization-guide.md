# AEM Core Carousel Customization - 3 Cards Display

## Overview
This guide explains how to customize the AEM Core Carousel component to display 3 cards at a time instead of the default single card display, with slide-by-one functionality.

## Solution Approach

### 1. Create a Custom Carousel Component (Proxy)

Instead of modifying the core component directly, create a proxy component that extends the core carousel.

#### Component Structure:
```
/apps/your-project/components/carousel/
├── .content.xml
├── _cq_dialog.xml
├── carousel.html
├── clientlibs/
│   ├── .content.xml
│   ├── css/
│   │   └── carousel.css
│   └── js/
│       └── carousel.js
```

### 2. Component Definition (.content.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" 
          xmlns:cq="http://www.day.com/jcr/cq/1.0" 
          xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:Component"
    jcr:title="Custom Carousel"
    sling:resourceSuperType="core/wcm/components/carousel/v1/carousel"
    componentGroup="Your Project - Content"/>
```

### 3. Custom HTL Template (carousel.html)

```html
<div data-sly-use.carousel="com.adobe.cq.wcm.core.components.models.Carousel"
     data-sly-test="${carousel.items}"
     class="cmp-carousel custom-carousel-3cards"
     data-cmp-is="carousel"
     data-cmp-autoplay="${carousel.autoplay ? 'true' : 'false'}"
     data-cmp-delay="${carousel.delay}"
     data-cmp-autopauseDisabled="${carousel.autopauseDisabled ? 'true' : 'false'}"
     id="${carousel.id}">

    <div class="cmp-carousel__content">
        <div class="cmp-carousel__container">
            <div class="cmp-carousel__track" style="transform: translateX(0);">
                <div data-sly-repeat.item="${carousel.items}" 
                     class="cmp-carousel__item ${item.active ? 'cmp-carousel__item--active' : ''}"
                     data-cmp-hook-carousel="item">
                    <sly data-sly-resource="${item.path @ resourceType=item.resourceType}"></sly>
                </div>
            </div>
        </div>
    </div>

    <div class="cmp-carousel__actions">
        <button class="cmp-carousel__action cmp-carousel__action--previous" 
                aria-label="Previous"
                data-cmp-hook-carousel="previous">
            <span class="cmp-carousel__action-icon">‹</span>
        </button>
        <button class="cmp-carousel__action cmp-carousel__action--next" 
                aria-label="Next"
                data-cmp-hook-carousel="next">
            <span class="cmp-carousel__action-icon">›</span>
        </button>
    </div>

    <div class="cmp-carousel__indicators" data-sly-test="${carousel.items.size > 1}">
        <button data-sly-repeat.item="${carousel.items}"
                class="cmp-carousel__indicator ${item.active ? 'cmp-carousel__indicator--active' : ''}"
                data-cmp-hook-carousel="indicator"
                data-cmp-carousel-item="${itemList.index}">
        </button>
    </div>
</div>
```

### 4. Custom CSS (clientlibs/css/carousel.css)

```css
/* Custom Carousel - 3 Cards Display */
.custom-carousel-3cards {
    position: relative;
    width: 100%;
    overflow: hidden;
}

.custom-carousel-3cards .cmp-carousel__content {
    position: relative;
    width: 100%;
    overflow: hidden;
}

.custom-carousel-3cards .cmp-carousel__container {
    position: relative;
    width: 100%;
}

.custom-carousel-3cards .cmp-carousel__track {
    display: flex;
    transition: transform 0.3s ease;
    will-change: transform;
}

.custom-carousel-3cards .cmp-carousel__item {
    flex: 0 0 calc(100% / 3);
    min-width: 0;
    padding: 0 10px;
    box-sizing: border-box;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .custom-carousel-3cards .cmp-carousel__item {
        flex: 0 0 calc(100% / 2); /* 2 cards on tablet */
    }
}

@media (max-width: 480px) {
    .custom-carousel-3cards .cmp-carousel__item {
        flex: 0 0 100%; /* 1 card on mobile */
    }
}

/* Navigation buttons */
.custom-carousel-3cards .cmp-carousel__actions {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    display: flex;
    justify-content: space-between;
    pointer-events: none;
    z-index: 10;
}

.custom-carousel-3cards .cmp-carousel__action {
    pointer-events: auto;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.custom-carousel-3cards .cmp-carousel__action:hover {
    background: rgba(0, 0, 0, 0.7);
}

.custom-carousel-3cards .cmp-carousel__action--previous {
    left: 10px;
}

.custom-carousel-3cards .cmp-carousel__action--next {
    right: 10px;
}

.custom-carousel-3cards .cmp-carousel__action-icon {
    font-size: 18px;
    font-weight: bold;
}

/* Indicators */
.custom-carousel-3cards .cmp-carousel__indicators {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    gap: 8px;
}

.custom-carousel-3cards .cmp-carousel__indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ccc;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.custom-carousel-3cards .cmp-carousel__indicator--active {
    background: #007cba;
}

/* Hide default core carousel styles that might conflict */
.custom-carousel-3cards .cmp-carousel__item--active {
    /* Override core component active styles */
    display: block;
}
```

### 5. Custom JavaScript (clientlibs/js/carousel.js)

```javascript
(function() {
    'use strict';

    var CAROUSEL_SELECTOR = '.custom-carousel-3cards';
    var ITEM_SELECTOR = '.cmp-carousel__item';
    var TRACK_SELECTOR = '.cmp-carousel__track';
    var PREVIOUS_BUTTON_SELECTOR = '[data-cmp-hook-carousel="previous"]';
    var NEXT_BUTTON_SELECTOR = '[data-cmp-hook-carousel="next"]';
    var INDICATOR_SELECTOR = '[data-cmp-hook-carousel="indicator"]';

    function CustomCarousel(element) {
        this.element = element;
        this.track = element.querySelector(TRACK_SELECTOR);
        this.items = element.querySelectorAll(ITEM_SELECTOR);
        this.previousButton = element.querySelector(PREVIOUS_BUTTON_SELECTOR);
        this.nextButton = element.querySelector(NEXT_BUTTON_SELECTOR);
        this.indicators = element.querySelectorAll(INDICATOR_SELECTOR);
        
        this.currentIndex = 0;
        this.cardsToShow = this.getCardsToShow();
        this.maxIndex = Math.max(0, this.items.length - this.cardsToShow);
        
        this.init();
    }

    CustomCarousel.prototype.init = function() {
        this.bindEvents();
        this.updateCarousel();
        this.updateIndicators();
        
        // Handle window resize
        var self = this;
        window.addEventListener('resize', function() {
            self.cardsToShow = self.getCardsToShow();
            self.maxIndex = Math.max(0, self.items.length - self.cardsToShow);
            self.currentIndex = Math.min(self.currentIndex, self.maxIndex);
            self.updateCarousel();
        });
    };

    CustomCarousel.prototype.getCardsToShow = function() {
        var width = window.innerWidth;
        if (width <= 480) return 1;
        if (width <= 768) return 2;
        return 3;
    };

    CustomCarousel.prototype.bindEvents = function() {
        var self = this;
        
        if (this.previousButton) {
            this.previousButton.addEventListener('click', function() {
                self.previous();
            });
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', function() {
                self.next();
            });
        }
        
        this.indicators.forEach(function(indicator, index) {
            indicator.addEventListener('click', function() {
                self.goToSlide(index);
            });
        });
    };

    CustomCarousel.prototype.previous = function() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
            this.updateIndicators();
        }
    };

    CustomCarousel.prototype.next = function() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
            this.updateIndicators();
        }
    };

    CustomCarousel.prototype.goToSlide = function(index) {
        this.currentIndex = Math.min(index, this.maxIndex);
        this.updateCarousel();
        this.updateIndicators();
    };

    CustomCarousel.prototype.updateCarousel = function() {
        var translateX = -(this.currentIndex * (100 / this.cardsToShow));
        this.track.style.transform = 'translateX(' + translateX + '%)';
        
        // Update button states
        if (this.previousButton) {
            this.previousButton.disabled = this.currentIndex === 0;
        }
        if (this.nextButton) {
            this.nextButton.disabled = this.currentIndex === this.maxIndex;
        }
    };

    CustomCarousel.prototype.updateIndicators = function() {
        var self = this;
        this.indicators.forEach(function(indicator, index) {
            indicator.classList.toggle('cmp-carousel__indicator--active', index === self.currentIndex);
        });
    };

    // Initialize carousels when DOM is ready
    function initCarousels() {
        var carousels = document.querySelectorAll(CAROUSEL_SELECTOR);
        carousels.forEach(function(carousel) {
            new CustomCarousel(carousel);
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarousels);
    } else {
        initCarousels();
    }

    // Re-initialize on AEM editor refresh
    if (window.Granite && window.Granite.author) {
        document.addEventListener('cq-editor-loaded', initCarousels);
    }

})();
```

### 6. Clientlib Configuration (clientlibs/.content.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0" 
          xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:ClientLibraryFolder"
    categories="[your-project.components.carousel]"
    dependencies="[core.wcm.components.carousel.v1]"
    embed="[your-project.components.carousel.css,your-project.components.carousel.js]"/>
```

### 7. Dialog Configuration (_cq_dialog.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" 
          xmlns:granite="http://www.adobe.com/jcr/granite/1.0" 
          xmlns:cq="http://www.day.com/jcr/cq/1.0" 
          xmlns:jcr="http://www.jcp.org/jcr/1.0" 
          xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
    jcr:primaryType="nt:unstructured"
    jcr:title="Custom Carousel"
    sling:resourceType="cq/gui/components/authoring/dialog">
    <content
        jcr:primaryType="nt:unstructured"
        sling:resourceType="granite/ui/components/coral/foundation/container">
        <items jcr:primaryType="nt:unstructured">
            <tabs
                jcr:primaryType="nt:unstructured"
                sling:resourceType="granite/ui/components/coral/foundation/tabs"
                maximized="{Boolean}true">
                <items jcr:primaryType="nt:unstructured">
                    <properties
                        jcr:primaryType="nt:unstructured"
                        jcr:title="Properties"
                        sling:resourceType="granite/ui/components/coral/foundation/fixedcolumns"
                        margin="{Boolean}true">
                        <items jcr:primaryType="nt:unstructured">
                            <column
                                jcr:primaryType="nt:unstructured"
                                sling:resourceType="granite/ui/components/coral/foundation/container">
                                <items jcr:primaryType="nt:unstructured">
                                    <autoplay
                                        jcr:primaryType="nt:unstructured"
                                        sling:resourceType="granite/ui/components/coral/foundation/form/checkbox"
                                        fieldDescription="Automatically transition between slides"
                                        name="./autoplay"
                                        text="Autoplay"
                                        value="true"/>
                                    <delay
                                        jcr:primaryType="nt:unstructured"
                                        sling:resourceType="granite/ui/components/coral/foundation/form/numberfield"
                                        fieldDescription="Delay in milliseconds before automatically transitioning to the next slide"
                                        fieldLabel="Autoplay Delay"
                                        min="0"
                                        name="./delay"
                                        value="5000"/>
                                    <autopauseDisabled
                                        jcr:primaryType="nt:unstructured"
                                        sling:resourceType="granite/ui/components/coral/foundation/form/checkbox"
                                        fieldDescription="Disable automatic pausing of autoplay when hovering over the carousel"
                                        name="./autopauseDisabled"
                                        text="Disable Autopause on Hover"
                                        value="true"/>
                                </items>
                            </column>
                        </items>
                    </properties>
                </items>
            </tabs>
        </items>
    </content>
</jcr:root>
```

## Implementation Steps

1. **Create the component structure** in your AEM project under `/apps/your-project/components/carousel/`
2. **Add the clientlib category** to your page's clientlib includes
3. **Add the component to your page templates** or allow it in the template policy
4. **Author the carousel** by adding your custom card components as children

## Key Features

- **Displays 3 cards at a time** on desktop
- **Responsive design**: 2 cards on tablet, 1 on mobile
- **Slide-by-one functionality** with previous/next buttons
- **Smooth transitions** with CSS transforms
- **Indicator dots** for navigation
- **Extends core carousel** maintaining AEM authoring experience
- **Touch/swipe support** can be added easily

## Additional Enhancements

You can further customize this solution by:

1. **Adding touch/swipe gestures** for mobile
2. **Implementing infinite scroll**
3. **Adding fade transitions** instead of slide
4. **Customizing responsive breakpoints**
5. **Adding keyboard navigation**

This approach gives you full control over the carousel behavior while maintaining the AEM authoring experience and extending the robust core carousel component.