# Troubleshooting: Unable to Add Components to Carousel

## Common Causes and Solutions

### 1. **Missing Container Configuration**

The most common issue is that the component isn't properly configured as a container.

#### ✅ **Solution: Update Component Definition**

Ensure your `.content.xml` has the container properties:

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

**Key Properties:**
- `cq:isContainer="{Boolean}true"` - Enables container functionality
- `sling:resourceSuperType="core/wcm/components/carousel/v1/carousel"` - Inherits from core carousel

### 2. **Template Policy Issues**

The template policy might not allow child components.

#### ✅ **Solution: Configure Template Policy**

Create or update your template policy to allow components:

**Path:** `/conf/your-project/settings/wcm/policies/your-project/components/carousel`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" 
          xmlns:cq="http://www.day.com/jcr/cq/1.0" 
          xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:Policy"
    jcr:title="Custom Carousel Policy"
    sling:resourceType="wcm/core/components/policy/policy">
    <jcr:content
        jcr:primaryType="nt:unstructured"
        components="[
            your-project/components/card,
            your-project/components/image,
            your-project/components/text,
            core/wcm/components/image/v2/image,
            core/wcm/components/text/v2/text
        ]"/>
</jcr:root>
```

### 3. **HTL Template Issues**

The HTL template might not be rendering the container structure properly.

#### ✅ **Solution: Update HTL Template**

Ensure your `carousel.html` includes the container structure:

```html
<div data-sly-use.carousel="com.adobe.cq.wcm.core.components.models.Carousel"
     data-sly-use.template="core/wcm/components/commons/v1/templates.html"
     data-sly-test.hasContent="${carousel.items.size > 0}"
     class="cmp-carousel custom-carousel-3cards"
     data-cmp-is="carousel"
     id="${carousel.id}">

    <!-- Carousel Content -->
    <div class="cmp-carousel__content">
        <div class="cmp-carousel__container">
            <div class="cmp-carousel__track">
                <div data-sly-repeat.item="${carousel.items}" 
                     class="cmp-carousel__item"
                     data-cmp-hook-carousel="item">
                    <sly data-sly-resource="${item.path @ resourceType=item.resourceType}"></sly>
                </div>
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
</div>

<!-- CRITICAL: Container for authoring mode -->
<div data-sly-test="${!hasContent && wcmmode.edit}"
     class="cmp-carousel carousel-empty"
     data-cmp-is="carousel">
    <sly data-sly-call="${template.placeholder @ isEmpty=true, classAppend='cmp-carousel'}"></sly>
</div>

<!-- Alternative: Always show container structure for authoring -->
<div data-sly-test="${wcmmode.edit}"
     class="cmp-carousel__container-authoring"
     data-cmp-is="carousel"
     data-sly-resource="${resource @ resourceType='wcm/foundation/components/parsys'}">
</div>
```

### 4. **Missing Editor Clientlibs**

The carousel might not have proper editor support.

#### ✅ **Solution: Add Editor Clientlibs**

Create `clientlibs-editor/.content.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0" 
          xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:ClientLibraryFolder"
    categories="[cq.authoring.editor]"
    dependencies="[core.wcm.components.carousel.v1.editor]"/>
```

### 5. **Alternative: Simple Container Approach**

If the above doesn't work, try this simpler approach:

#### ✅ **Solution: Direct Container Implementation**

**Updated carousel.html:**

```html
<div data-sly-use.carousel="com.adobe.cq.wcm.core.components.models.Carousel"
     data-sly-use.template="core/wcm/components/commons/v1/templates.html"
     class="cmp-carousel custom-carousel-3cards"
     data-cmp-is="carousel"
     id="${carousel.id}">

    <!-- Show actual carousel in preview mode -->
    <div data-sly-test="${!wcmmode.edit && carousel.items.size > 0}" 
         class="cmp-carousel__content">
        <div class="cmp-carousel__container">
            <div class="cmp-carousel__track">
                <div data-sly-repeat.item="${carousel.items}" 
                     class="cmp-carousel__item"
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
    </div>

    <!-- Show container in edit mode -->
    <div data-sly-test="${wcmmode.edit}"
         class="carousel-authoring-container">
        <sly data-sly-resource="${resource @ resourceType='wcm/foundation/components/parsys'}"></sly>
    </div>
</div>
```

### 6. **Debugging Steps**

#### Check in Browser Dev Tools:

1. **Inspect the carousel component** in edit mode
2. **Look for these attributes** on the carousel container:
   - `data-cmp-is="carousel"`
   - `class="cmp-carousel"`
3. **Check for JavaScript errors** in the console
4. **Verify the parsys is rendered** inside the carousel

#### Check in CRXDE:

1. **Navigate to your page** in CRXDE (`/content/your-site/page/jcr:content`)
2. **Look for the carousel node**
3. **Check if it has** `sling:resourceType="your-project/components/carousel"`
4. **Verify child nodes** are being created when you try to add components

### 7. **Quick Test Component**

Create a simple test to verify container functionality:

**test-carousel.html:**
```html
<div class="test-carousel" data-cmp-is="carousel">
    <h3>Test Carousel - Drop Components Here</h3>
    <sly data-sly-resource="${resource @ resourceType='wcm/foundation/components/parsys'}"></sly>
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

### 8. **Final Verification Checklist**

- [ ] Component has `cq:isContainer="{Boolean}true"`
- [ ] Template policy allows child components
- [ ] HTL template includes container structure
- [ ] Editor clientlibs are included
- [ ] Component is properly deployed
- [ ] Page templates allow the carousel component
- [ ] No JavaScript errors in browser console

## Most Common Fix

**The most common issue is missing the `wcm/foundation/components/parsys` resource type in the HTL template.**

Add this line to your carousel.html:
```html
<sly data-sly-resource="${resource @ resourceType='wcm/foundation/components/parsys'}"></sly>
```

This creates the actual container where authors can drop components.