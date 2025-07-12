# 🚨 QUICK FIX: Unable to Add Components to Carousel

## The Problem
You can't drag and drop components into your custom carousel in AEM authoring mode.

## The Solution
The issue is that your HTL template is missing the **container structure** for authoring mode.

## ✅ Fix #1: Update Your carousel.html

Replace your current `carousel.html` with this corrected version:

```html
<div data-sly-use.carousel="com.adobe.cq.wcm.core.components.models.Carousel"
     data-sly-use.template="core/wcm/components/commons/v1/templates.html"
     class="cmp-carousel custom-carousel-3cards"
     data-cmp-is="carousel"
     data-cmp-autoplay="${carousel.autoplay ? 'true' : 'false'}"
     data-cmp-delay="${carousel.delay}"
     data-cmp-autopauseDisabled="${carousel.autopauseDisabled ? 'true' : 'false'}"
     id="${carousel.id}">

    <!-- Show actual carousel in preview mode -->
    <div data-sly-test="${!wcmmode.edit && carousel.items.size > 0}" 
         class="cmp-carousel__content">
        <div class="cmp-carousel__container">
            <div class="cmp-carousel__track">
                <div data-sly-repeat.item="${carousel.items}" 
                     class="cmp-carousel__item ${item.active ? 'cmp-carousel__item--active' : ''}"
                     data-cmp-hook-carousel="item">
                    <sly data-sly-resource="${item.path @ resourceType=item.resourceType}"></sly>
                </div>
            </div>
        </div>
        
        <!-- Navigation -->
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
        
        <!-- Indicators -->
        <div class="cmp-carousel__indicators" data-sly-test="${carousel.items.size > 1}">
            <button data-sly-repeat.item="${carousel.items}"
                    class="cmp-carousel__indicator ${item.active ? 'cmp-carousel__indicator--active' : ''}"
                    data-cmp-hook-carousel="indicator"
                    data-cmp-carousel-item="${itemList.index}">
            </button>
        </div>
    </div>

    <!-- CRITICAL: Container for authoring mode - this enables dropping components -->
    <div data-sly-test="${wcmmode.edit}"
         class="carousel-authoring-container">
        <sly data-sly-resource="${resource @ resourceType='wcm/foundation/components/parsys'}"></sly>
    </div>
</div>

<!-- Show placeholder when no content and in edit mode -->
<sly data-sly-test="${wcmmode.edit && carousel.items.size == 0}" 
     data-sly-call="${template.placeholder @ isEmpty=true, classAppend='cmp-carousel'}"></sly>
```

## ✅ Fix #2: Verify Your .content.xml

Make sure your component definition has:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" 
          xmlns:cq="http://www.day.com/jcr/cq/1.0" 
          xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:Component"
    jcr:title="Custom Carousel - 3 Cards"
    jcr:description="A carousel component that displays 3 cards at a time"
    sling:resourceSuperType="core/wcm/components/carousel/v1/carousel"
    componentGroup="Your Project - Content"
    cq:isContainer="{Boolean}true"/>
```

**Key:** `cq:isContainer="{Boolean}true"` is required!

## ✅ Fix #3: Add CSS for Authoring Mode

Add this to your editor CSS file:

```css
/* Authoring container styling */
.carousel-authoring-container {
    min-height: 200px;
    border: 2px dashed #007cba;
    background: #f9f9f9;
    padding: 20px;
    margin: 10px 0;
    position: relative;
}

.carousel-authoring-container::before {
    content: "Carousel: Drop components here";
    position: absolute;
    top: -30px;
    left: 0;
    background: #007cba;
    color: white;
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 3px;
    z-index: 10;
}

.carousel-authoring-container .section {
    border: none;
    background: transparent;
}
```

## ✅ Test First: Simple Container

If you want to test that containers work first, create this simple test component:

**test-carousel.html:**
```html
<div class="test-carousel" data-cmp-is="carousel">
    <h3>Test Carousel - Drop Components Here</h3>
    <div class="test-carousel-container">
        <sly data-sly-resource="${resource @ resourceType='wcm/foundation/components/parsys'}"></sly>
    </div>
</div>
```

**test-carousel/.content.xml:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0" 
          xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:Component"
    jcr:title="Test Carousel"
    componentGroup="Test"
    cq:isContainer="{Boolean}true"/>
```

## 🔍 How to Verify It's Working

1. **In AEM Editor**: You should see a dashed border container with "Carousel: Drop components here" label
2. **Drag any component** from the component browser into this container
3. **You should see the component appear** inside the carousel
4. **Switch to Preview mode** to see the 3-card layout in action

## 💡 Key Understanding

The critical missing piece was this line in your HTL template:

```html
<sly data-sly-resource="${resource @ resourceType='wcm/foundation/components/parsys'}"></sly>
```

This creates the **parsys** (paragraph system) that enables the drag-and-drop functionality in AEM authoring mode.

## 🎯 Result

After applying these fixes:
- ✅ You can drag and drop components into the carousel
- ✅ In edit mode: Shows a clear container for authoring
- ✅ In preview mode: Shows the 3-card carousel layout
- ✅ Components can be reordered and edited individually

## 📞 If Still Not Working

1. **Check browser console** for JavaScript errors
2. **Verify component is deployed** properly
3. **Check CRXDE** - look for the carousel node in your page content
4. **Ensure template policy** allows child components
5. **Clear browser cache** and refresh the page

The updated files in `example-implementation/` folder now include these fixes!