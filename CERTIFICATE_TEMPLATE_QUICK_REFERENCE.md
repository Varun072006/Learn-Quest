# 📋 Certificate Template - Quick Reference

## TL;DR - Fast Start

### What Format to Use?
**✅ HTML (Recommended)** - Easy to customize, converts to PDF automatically

### Where to Get Started?
Use the included template: `certificate_template_default.html`

### How to Upload?
1. Go to Admin Panel → Certificate Management
2. Click "Upload Template" button (coming in Step 2)
3. Select your `.html` file
4. Done! It will auto-convert to PDF when sending

---

## File Formats Comparison

| Format | Difficulty | Flexibility | Best For |
|--------|-----------|-------------|----------|
| **HTML** | ⭐ Easy | ⭐⭐⭐⭐⭐ High | Custom designs, easy edits |
| **PDF** | ⭐⭐⭐ Hard | ⭐⭐ Low | Pre-made designs |
| **Image** | ⭐⭐ Medium | ⭐⭐⭐ Medium | Simple layouts |

---

## Required Variables (Must Include)

These placeholders will be automatically replaced:

```
{{USER_NAME}}           - Student's full name
{{CERTIFICATION_NAME}}  - e.g., "Python Basics"
{{DIFFICULTY}}          - Easy / Medium / Hard
{{SCORE}}              - Final score (e.g., 85)
{{PASS_PERCENTAGE}}    - Required pass % (e.g., 70)
{{DATE}}               - Completion date
{{CERTIFICATE_ID}}     - Unique ID (e.g., LQ-PY-2025-001234)
```

### Optional Variables:
```
{{USER_EMAIL}}         - Student's email
{{LOGO_URL}}           - LearnQuest logo URL
```

---

## Template Sizes

### Standard (Recommended):
- **A4 Landscape:** 297mm × 210mm (11.7" × 8.3")

### Alternative Sizes:
- **A4 Portrait:** 210mm × 297mm (8.3" × 11.7")
- **Letter Landscape:** 11" × 8.5"
- **Letter Portrait:** 8.5" × 11"

---

## Quick HTML Template Structure

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Your CSS here - must be inline! */
    .certificate { width: 297mm; height: 210mm; }
  </style>
</head>
<body>
  <div class="certificate">
    <h1>Certificate of Achievement</h1>
    <h2>{{USER_NAME}}</h2>
    <p>Completed: {{CERTIFICATION_NAME}}</p>
    <p>Score: {{SCORE}}% (Pass: {{PASS_PERCENTAGE}}%)</p>
    <p>Date: {{DATE}}</p>
    <p>ID: {{CERTIFICATE_ID}}</p>
  </div>
</body>
</html>
```

---

## Design Tools

### Free Tools:
1. **Canva** - canva.com (export as image, add text positions)
2. **Figma** - figma.com (design, export HTML)
3. **Google Docs** - Download as HTML
4. **VS Code** - Write HTML directly

### Paid Tools:
1. **Adobe Illustrator** - Export as PDF with form fields
2. **Photoshop** - Export as image with coordinates

---

## File Upload Specs

### Allowed Formats:
- ✅ `.html` (max 500KB)
- ✅ `.pdf` (max 5MB)
- ✅ `.png` (max 10MB)
- ✅ `.jpg` / `.jpeg` (max 10MB)

### Naming Convention:
```
certificate_[name]_v[version].html

Examples:
✅ certificate_classic_v1.html
✅ certificate_modern_blue_v2.html
✅ certificate_minimal_v1.pdf
```

---

## Testing Your Template

### Method 1: Preview in Browser
1. Open `.html` file in Chrome/Firefox
2. Press `Ctrl+P` (Print Preview)
3. Check layout fits on one page
4. Verify all text is visible

### Method 2: Online PDF Converter
1. Upload HTML to: https://www.html-to-pdf.net/
2. Download PDF
3. Check output quality

### Method 3: Replace Variables Manually
Replace `{{USER_NAME}}` with "John Doe" in your HTML and test locally

---

## Common Mistakes to Avoid

### ❌ DON'T:
- Use external CSS files (inline only!)
- Use external images without full URLs
- Forget to test with long names (30+ chars)
- Use very small fonts (< 12px)
- Exceed page dimensions

### ✅ DO:
- Use inline CSS only
- Use web-safe fonts or embed fonts
- Test with sample data
- Keep design simple and readable
- Include all required variables

---

## Example Test Data

Use this to test your template before uploading:

```javascript
{
  "USER_NAME": "Alexandra Katherine Johnson",
  "USER_EMAIL": "alexandra.johnson@example.com",
  "CERTIFICATION_NAME": "Advanced Python Programming",
  "DIFFICULTY": "HARD",
  "SCORE": "92",
  "PASS_PERCENTAGE": "85",
  "DATE": "November 2, 2025",
  "CERTIFICATE_ID": "LQ-PYT-2025-A1B2C3"
}
```

---

## Backend Implementation (For Developers)

### Install Required Packages:
```bash
pip install weasyprint jinja2
```

### Basic Generation Code:
```python
from weasyprint import HTML
from jinja2 import Template

# Load template
with open('certificate_template_default.html', 'r') as f:
    template_html = f.read()

# Replace variables
template = Template(template_html)
rendered = template.render(
    USER_NAME="John Doe",
    CERTIFICATION_NAME="Python Basics",
    DIFFICULTY="EASY",
    SCORE=85,
    PASS_PERCENTAGE=70,
    DATE="November 2, 2025",
    CERTIFICATE_ID="LQ-PYT-2025-001234"
)

# Generate PDF
HTML(string=rendered).write_pdf('certificate_output.pdf')
```

---

## Step-by-Step Upload Process (Coming Soon)

### Step 1: Prepare Template
- ✅ Design in HTML with inline CSS
- ✅ Add all required variables
- ✅ Test locally in browser
- ✅ Verify PDF conversion works

### Step 2: Upload to Admin Panel
1. Login to admin panel
2. Navigate to **Certificate Management**
3. Click **"Upload Template"** button
4. Select your `.html` file
5. Enter template name and description
6. Choose applicable certifications (or "All")
7. Click **"Upload"**

### Step 3: Set as Active
1. View uploaded template in gallery
2. Click **"Set Active"** button
3. Template is now used for new certificates

### Step 4: Test
1. Go to **Certificate Management**
2. Select a passed user
3. Click **"Send Certificate"**
4. Check email inbox for PDF attachment

---

## Customization Examples

### Change Colors:
```css
/* In <style> section */
.certificate-title {
  color: #ff6b6b; /* Red instead of blue */
}

.recipient-name {
  color: #4ecdc4; /* Teal instead of purple */
}
```

### Change Fonts:
```css
body {
  font-family: 'Arial', 'Helvetica', sans-serif;
}

.recipient-name {
  font-family: 'Courier New', monospace;
}
```

### Add Logo:
```html
<div class="logo">
  <img src="https://yourcdn.com/logo.png" alt="Logo" style="width: 100px;">
</div>
```

### Add Background:
```css
.certificate {
  background-image: url('https://yourcdn.com/background.png');
  background-size: cover;
}
```

---

## Troubleshooting

### Problem: PDF is cut off
**Solution:** Reduce padding or font sizes to fit A4 landscape (297mm × 210mm)

### Problem: Variables not replaced
**Solution:** Check exact spelling: `{{USER_NAME}}` (case-sensitive, double braces)

### Problem: Fonts look wrong in PDF
**Solution:** Use web-safe fonts: Arial, Georgia, Times New Roman, Courier New

### Problem: Layout breaks on long names
**Solution:** Add CSS:
```css
.recipient-name {
  max-width: 80%;
  margin: 0 auto;
  word-wrap: break-word;
}
```

### Problem: File too large
**Solution:** Optimize images, remove unnecessary CSS, use CDN for external resources

---

## Summary Checklist

### Before Upload:
- [ ] Template uses HTML with inline CSS
- [ ] All required variables included: `{{USER_NAME}}`, `{{CERTIFICATION_NAME}}`, etc.
- [ ] Tested in browser (Ctrl+P to preview)
- [ ] Fits on A4 landscape page
- [ ] File size under 500KB
- [ ] No external CSS/JS files
- [ ] Tested with long names (30+ characters)
- [ ] Fonts are web-safe or embedded

### After Upload:
- [ ] Template appears in admin gallery
- [ ] Preview image looks correct
- [ ] Set as active template
- [ ] Generate test certificate
- [ ] Verify PDF output
- [ ] Send test email
- [ ] Check email attachment opens correctly

---

## Quick Start Commands

### Create New Template:
```bash
# Copy default template
cp certificate_template_default.html my_custom_certificate.html

# Edit in your favorite editor
code my_custom_certificate.html
```

### Test Template:
```bash
# Open in browser
start my_custom_certificate.html

# Or on Mac
open my_custom_certificate.html

# Or on Linux
xdg-open my_custom_certificate.html
```

---

## Support Resources

### Documentation:
- **Full Guide:** `CERTIFICATE_TEMPLATE_GUIDE.md`
- **Default Template:** `certificate_template_default.html`
- **Step 1 Complete:** `CERTIFICATE_MANAGEMENT_STEP1.md`

### Need Help?
- Check `CERTIFICATE_TEMPLATE_GUIDE.md` for detailed examples
- Use included `certificate_template_default.html` as starting point
- Test variables: Replace `{{USER_NAME}}` → "John Doe" manually first

---

**Ready to Create Your First Certificate Template?**

1. Open `certificate_template_default.html`
2. Customize colors, fonts, layout
3. Save as new file
4. Upload to admin panel (coming soon!)
5. Send to passed users! 🎓
