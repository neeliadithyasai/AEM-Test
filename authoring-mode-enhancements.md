# Authoring Mode Enhancements for Custom Carousel

## Overview
The custom carousel component extends the core carousel, which means it inherits the panel container functionality. However, some adjustments are needed to ensure proper authoring experience.

## Required Modifications

### 1. Enhanced Component Definition (.content.xml)

Update your `.content.xml` to explicitly support the panel container:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" 
          xmlns:cq="http://www.day.com/jcr/cq/1.0" 
          xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:Component"
    jcr:title="Custom Carousel - 3 Cards"
    jcr:description="A carousel component that displays 3 cards at a time with slide-by-one navigation"
    sling:resourceSuperType="core/wcm/components/carousel/v1/carousel"
    componentGroup="Your Project - Content"
    cq:isContainer="{Boolean}true"
    cq:templatePath="/apps/your-project/components/carousel/template"/>
```

### 2. Enhanced HTL Template with Authoring Support

Update your `carousel.html` to include authoring placeholders:

```html
<div data-sly-use.carousel="com.adobe.cq.wcm.core.components.models.Carousel"
     data-sly-use.template="core/wcm/components/commons/v1/templates.html"
     data-sly-test.hasContent="${carousel.items.size > 0}"
     class="cmp-carousel custom-carousel-3cards"
     data-cmp-is="carousel"
     data-cmp-autoplay="${carousel.autoplay ? 'true' : 'false'}"
     data-cmp-delay="${carousel.delay}"
     data-cmp-autopauseDisabled="${carousel.autopauseDisabled ? 'true' : 'false'}"
     id="${carousel.id}">

    <div class="cmp-carousel__content">
        <div class="cmp-carousel__container">
            <div class="cmp-carousel__track">
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

<!-- Authoring placeholder when no content -->
<sly data-sly-call="${template.placeholder @ isEmpty=!hasContent, classAppend='cmp-carousel'}"></sly>
```

### 3. Add Template Configuration

Create a template configuration file at `template/.content.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" 
          xmlns:cq="http://www.day.com/jcr/cq/1.0" 
          xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:Template"
    jcr:title="Custom Carousel Template"
    ranking="{Long}10"
    allowedChildren="[*/components/card,*/components/image,*/components/text]"
    allowedParents="[*/components/responsivegrid]"/>
```

### 4. Enhanced Dialog with Container Settings

Update your `_cq_dialog.xml` to include container-specific settings:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" 
          xmlns:granite="http://www.adobe.com/jcr/granite/1.0" 
          xmlns:cq="http://www.day.com/jcr/cq/1.0" 
          xmlns:jcr="http://www.jcp.org/jcr/1.0" 
          xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
    jcr:primaryType="nt:unstructured"
    jcr:title="Custom Carousel"
    sling:resourceType="cq/gui/components/authoring/dialog"
    extraClientlibs="[core.wcm.components.carousel.v1.editor]">
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
                                    <cardsPerView
                                        jcr:primaryType="nt:unstructured"
                                        sling:resourceType="granite/ui/components/coral/foundation/form/numberfield"
                                        fieldDescription="Number of cards to display at once (desktop)"
                                        fieldLabel="Cards Per View"
                                        min="1"
                                        max="6"
                                        name="./cardsPerView"
                                        value="3"/>
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

### 5. Editor-Specific CSS

Create `clientlibs/editor/css/carousel-editor.css` for authoring mode styles:

```css
/* Editor-specific styles for authoring mode */
.cmp-carousel.cq-placeholder {
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed #ccc;
    background: #f5f5f5;
}

.cmp-carousel.cq-placeholder::before {
    content: "Drop components here to create carousel slides";
    color: #666;
    font-size: 14px;
}

/* Authoring mode: show all items in a grid for easy editing */
.cq-editmode .custom-carousel-3cards .cmp-carousel__track {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    transform: none !important;
}

.cq-editmode .custom-carousel-3cards .cmp-carousel__item {
    flex: none;
    padding: 10px;
    border: 1px dashed #007cba;
    position: relative;
}

.cq-editmode .custom-carousel-3cards .cmp-carousel__item::before {
    content: "Slide " attr(data-cmp-carousel-item);
    position: absolute;
    top: -20px;
    left: 0;
    font-size: 12px;
    color: #007cba;
    background: white;
    padding: 2px 6px;
    border-radius: 3px;
}

/* Hide navigation in edit mode */
.cq-editmode .custom-carousel-3cards .cmp-carousel__actions,
.cq-editmode .custom-carousel-3cards .cmp-carousel__indicators {
    display: none;
}
```

### 6. Editor Client Library Configuration

Create `clientlibs/editor/.content.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0" 
          xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:ClientLibraryFolder"
    categories="[cq.authoring.editor]"
    dependencies="[core.wcm.components.carousel.v1.editor]"/>
```

### 7. Updated Component Structure

Your final component structure should look like:

```
/apps/your-project/components/carousel/
├── .content.xml
├── _cq_dialog.xml
├── carousel.html
├── template/
│   └── .content.xml
├── clientlibs/
│   ├── .content.xml
│   ├── css/
│   │   └── carousel.css
│   └── js/
│       └── carousel.js
└── clientlibs-editor/
    ├── .content.xml
    └── css/
        └── carousel-editor.css
```

## Benefits of This Approach

1. **Panel Container Support**: Authors can drag and drop components into the carousel
2. **Visual Authoring**: Components show in a grid layout in edit mode for easy management
3. **Placeholder Display**: Shows helpful message when carousel is empty
4. **Inherited Functionality**: All core carousel authoring features work
5. **Editor-Specific Styles**: Clean authoring experience with visual indicators

## Usage in Authoring Mode

1. **Add the carousel component** to your page
2. **Configure properties** via the component dialog
3. **Drag and drop child components** (cards, images, text) into the carousel
4. **Reorder components** using the panel container drag handles
5. **Configure individual child components** by clicking on them
6. **Preview the page** to see the 3-card layout with navigation

The carousel will display all child components in a grid layout during authoring, making it easy to manage content, while showing the 3-card sliding layout in preview/publish mode.