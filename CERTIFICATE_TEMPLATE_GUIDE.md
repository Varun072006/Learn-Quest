# 📜 Certificate Template Guide

## Overview
This guide explains how to create and upload certificate templates for the LearnQuest platform.

---

## Current Implementation Status

### ✅ What's Already Working:
- **Student-side Certificate Generation** - HTML/CSS based certificate using `html2canvas`
- **Download as PNG** - Students can download their certificates as images
- **Dynamic Data** - User name, certification name, score, date auto-filled

### 🔄 What We're Adding:
- **Admin Template Upload** - Upload custom certificate templates
- **Bulk Email with PDF** - Send certificates to multiple users via email
- **Template Customization** - Different templates for different certifications

---

## Recommended Template Formats

### Option 1: HTML Template (✅ RECOMMENDED)
**Format:** `.html` file with inline CSS  
**Why:** Easy to customize, supports dynamic variables, can be converted to PDF

#### Template Structure:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4 landscape;
      margin: 0;
    }
    body {
      font-family: 'Georgia', serif;
      margin: 0;
      padding: 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #333;
    }
    .certificate {
      width: 297mm;
      height: 210mm;
      background: white;
      padding: 60px;
      border: 10px solid #667eea;
      box-shadow: 0 0 20px rgba(0,0,0,0.3);
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
    }
    .title {
      font-size: 48px;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 10px;
    }
    .subtitle {
      font-size: 20px;
      color: #666;
    }
    .recipient-name {
      font-size: 56px;
      font-weight: bold;
      color: #764ba2;
      margin: 30px 0;
      text-align: center;
    }
    .certification-text {
      font-size: 24px;
      text-align: center;
      margin: 20px 0;
      line-height: 1.6;
    }
    .certification-name {
      font-size: 36px;
      font-weight: bold;
      color: #667eea;
      text-align: center;
      margin: 20px 0;
    }
    .details {
      display: flex;
      justify-content: space-around;
      margin-top: 50px;
    }
    .detail-item {
      text-align: center;
    }
    .detail-label {
      font-size: 14px;
      color: #999;
      text-transform: uppercase;
    }
    .detail-value {
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }
    .signature-section {
      margin-top: 60px;
      display: flex;
      justify-content: space-around;
    }
    .signature {
      text-align: center;
    }
    .signature-line {
      width: 200px;
      border-top: 2px solid #333;
      margin: 40px auto 10px;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="logo">
        <img src="{{LOGO_URL}}" alt="LearnQuest" style="width: 100%; height: 100%;">
      </div>
      <div class="title">Certificate of Achievement</div>
      <div class="subtitle">LearnQuest Certification Program</div>
    </div>

    <div class="recipient-name">{{USER_NAME}}</div>

    <div class="certification-text">
      has successfully completed the
    </div>

    <div class="certification-name">{{CERTIFICATION_NAME}}</div>
    
    <div class="certification-text">
      at <strong>{{DIFFICULTY}}</strong> level
    </div>

    <div class="details">
      <div class="detail-item">
        <div class="detail-label">Score Achieved</div>
        <div class="detail-value">{{SCORE}}%</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Pass Percentage</div>
        <div class="detail-value">{{PASS_PERCENTAGE}}%</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Date</div>
        <div class="detail-value">{{DATE}}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Certificate ID</div>
        <div class="detail-value">{{CERTIFICATE_ID}}</div>
      </div>
    </div>

    <div class="signature-section">
      <div class="signature">
        <div class="signature-line"></div>
        <div>Program Director</div>
      </div>
      <div class="signature">
        <div class="signature-line"></div>
        <div>Chief Academic Officer</div>
      </div>
    </div>
  </div>
</body>
</html>
```

#### Dynamic Variables:
Replace these placeholders when generating certificates:
- `{{USER_NAME}}` - Student's full name
- `{{USER_EMAIL}}` - Student's email
- `{{CERTIFICATION_NAME}}` - Certification title (e.g., "Python Basics")
- `{{DIFFICULTY}}` - Easy/Medium/Hard
- `{{SCORE}}` - Final score percentage
- `{{PASS_PERCENTAGE}}` - Required pass percentage
- `{{DATE}}` - Completion date
- `{{CERTIFICATE_ID}}` - Unique certificate ID (e.g., LQ-PY-2025-001234)
- `{{LOGO_URL}}` - LearnQuest logo URL

---

### Option 2: PDF Template with Form Fields
**Format:** `.pdf` file with fillable form fields  
**Why:** Professional, maintains exact design, can be filled programmatically

#### How to Create:
1. Design in Canva/Adobe Illustrator/Figma
2. Export as PDF
3. Add form fields using Adobe Acrobat Pro:
   - Add text fields for dynamic data
   - Name fields: `user_name`, `cert_name`, `score`, `date`, etc.

#### Advantages:
- Exact design control
- Professional fonts
- Background images/watermarks
- Complex layouts

#### Disadvantages:
- Requires PDF library (PyPDF2, ReportLab)
- Less flexible than HTML
- Harder to edit

---

### Option 3: Image Template (PNG/JPG)
**Format:** `.png` or `.jpg` with overlay positions defined  
**Why:** Simple, works with basic image libraries

#### Template JSON Configuration:
```json
{
  "template_id": "cert_template_001",
  "name": "Classic Blue Certificate",
  "image_path": "/templates/certificate_blue.png",
  "dimensions": {
    "width": 3508,
    "height": 2480
  },
  "text_positions": {
    "user_name": {
      "x": 1754,
      "y": 900,
      "font": "Georgia-Bold",
      "size": 120,
      "color": "#764ba2",
      "align": "center"
    },
    "certification_name": {
      "x": 1754,
      "y": 1200,
      "font": "Georgia-Bold",
      "size": 80,
      "color": "#667eea",
      "align": "center"
    },
    "score": {
      "x": 1000,
      "y": 1800,
      "font": "Arial-Bold",
      "size": 60,
      "color": "#333333",
      "align": "center"
    },
    "date": {
      "x": 2500,
      "y": 1800,
      "font": "Arial",
      "size": 50,
      "color": "#666666",
      "align": "center"
    }
  }
}
```

---

## Database Schema for Templates

### `certificate_templates` Collection:
```javascript
{
  "template_id": "cert_template_001",
  "name": "Classic Blue Certificate",
  "description": "Professional blue gradient certificate",
  "type": "html", // "html" | "pdf" | "image"
  "file_path": "/templates/classic_blue.html",
  "preview_url": "/templates/previews/classic_blue.png",
  "is_default": true,
  "is_active": true,
  "applicable_certs": ["all"], // or ["python-basics", "react-advanced"]
  "created_at": "2025-11-02T10:00:00Z",
  "updated_at": "2025-11-02T10:00:00Z",
  "created_by": "admin@learnquest.com",
  "dimensions": {
    "width": "297mm",  // A4 landscape
    "height": "210mm"
  },
  "variables": [
    "USER_NAME",
    "USER_EMAIL",
    "CERTIFICATION_NAME",
    "DIFFICULTY",
    "SCORE",
    "PASS_PERCENTAGE",
    "DATE",
    "CERTIFICATE_ID"
  ]
}
```

---

## File Upload Requirements

### File Size Limits:
- **HTML:** Max 500KB
- **PDF:** Max 5MB
- **Image:** Max 10MB

### Supported Formats:
- ✅ `.html` (with inline CSS)
- ✅ `.pdf` (with form fields)
- ✅ `.png` (with JSON config)
- ✅ `.jpg` / `.jpeg` (with JSON config)
- ❌ `.docx` (not supported)
- ❌ `.svg` (use PNG instead)

### File Naming Convention:
```
certificate_[template_name]_[version].[ext]

Examples:
- certificate_classic_blue_v1.html
- certificate_modern_gradient_v2.pdf
- certificate_minimal_v1.png
```

---

## Admin UI for Template Upload

### New Section in Certificate Management Page:

```jsx
// Add to CertificateManagement.jsx

const [templates, setTemplates] = useState([])
const [uploadingTemplate, setUploadingTemplate] = useState(false)
const [selectedTemplate, setSelectedTemplate] = useState(null)

const handleTemplateUpload = async (file) => {
  if (!file) return
  
  const formData = new FormData()
  formData.append('template', file)
  formData.append('name', file.name)
  formData.append('type', file.type.includes('html') ? 'html' : 
                          file.type.includes('pdf') ? 'pdf' : 'image')
  
  setUploadingTemplate(true)
  try {
    await adminCertTestsAPI.uploadTemplate(formData)
    toast.success('Template uploaded successfully')
    fetchTemplates()
  } catch (error) {
    toast.error('Failed to upload template')
  } finally {
    setUploadingTemplate(false)
  }
}
```

### UI Components:

```jsx
{/* Template Upload Section */}
<Card className="mb-8 bg-slate-800 border-slate-700">
  <CardHeader>
    <CardTitle className="text-white flex items-center gap-2">
      <FileText className="w-5 h-5 text-blue-400" />
      Certificate Templates
    </CardTitle>
    <CardDescription className="text-slate-400">
      Upload and manage certificate templates
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="flex items-center gap-4 mb-6">
      <input
        type="file"
        accept=".html,.pdf,.png,.jpg,.jpeg"
        onChange={(e) => handleTemplateUpload(e.target.files[0])}
        className="hidden"
        id="template-upload"
      />
      <label
        htmlFor="template-upload"
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer"
      >
        <Upload className="w-5 h-5" />
        Upload Template
      </label>
      {uploadingTemplate && (
        <span className="text-slate-400">Uploading...</span>
      )}
    </div>

    {/* Template Gallery */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {templates.map(template => (
        <div 
          key={template.template_id}
          className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
        >
          <img 
            src={template.preview_url} 
            alt={template.name}
            className="w-full h-40 object-cover rounded mb-3"
          />
          <div className="text-white font-semibold mb-1">{template.name}</div>
          <div className="text-xs text-slate-400 mb-3">{template.type.toUpperCase()}</div>
          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedTemplate(template.template_id)}
              className={`flex-1 px-3 py-1 rounded text-xs ${
                selectedTemplate === template.template_id
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
              }`}
            >
              {selectedTemplate === template.template_id ? 'Active' : 'Set Active'}
            </button>
            <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
```

---

## Backend API Endpoints

### 1. Upload Template
```python
@router.post("/admin/certificates/templates/upload")
async def upload_certificate_template(
    template: UploadFile = File(...),
    name: str = Form(...),
    description: str = Form(""),
    applicable_certs: List[str] = Form(["all"]),
    current_admin = Depends(get_current_admin_user)
):
    """
    Upload a new certificate template
    
    Supported formats: HTML, PDF, PNG, JPG
    """
    # Validate file type
    allowed_types = ['text/html', 'application/pdf', 'image/png', 'image/jpeg']
    if template.content_type not in allowed_types:
        raise HTTPException(400, "Unsupported file type")
    
    # Save file
    template_id = f"cert_template_{uuid.uuid4().hex[:8]}"
    file_extension = template.filename.split('.')[-1]
    file_path = f"templates/{template_id}.{file_extension}"
    
    with open(file_path, "wb") as f:
        f.write(await template.read())
    
    # Generate preview (if HTML, render to PNG)
    preview_url = await generate_template_preview(file_path)
    
    # Save to database
    template_doc = {
        "template_id": template_id,
        "name": name,
        "description": description,
        "type": get_template_type(file_extension),
        "file_path": file_path,
        "preview_url": preview_url,
        "is_default": False,
        "is_active": True,
        "applicable_certs": applicable_certs,
        "created_at": datetime.utcnow(),
        "created_by": current_admin.email
    }
    
    await db.certificate_templates.insert_one(template_doc)
    
    return {"message": "Template uploaded successfully", "template_id": template_id}
```

### 2. Get All Templates
```python
@router.get("/admin/certificates/templates")
async def get_certificate_templates(current_admin = Depends(get_current_admin_user)):
    """Get all certificate templates"""
    templates = await db.certificate_templates.find(
        {"is_active": True}
    ).to_list(length=None)
    
    return {"templates": templates}
```

### 3. Set Active Template
```python
@router.put("/admin/certificates/templates/{template_id}/set-active")
async def set_active_template(
    template_id: str,
    cert_ids: List[str] = Body([]),
    current_admin = Depends(get_current_admin_user)
):
    """Set a template as active for specific certifications"""
    await db.certificate_templates.update_many(
        {"applicable_certs": {"$in": cert_ids}},
        {"$set": {"is_default": False}}
    )
    
    await db.certificate_templates.update_one(
        {"template_id": template_id},
        {"$set": {
            "is_default": True,
            "applicable_certs": cert_ids
        }}
    )
    
    return {"message": "Template set as active"}
```

### 4. Generate Certificate from Template
```python
from weasyprint import HTML  # For HTML to PDF conversion
from jinja2 import Template

@router.post("/admin/certificates/generate/{attempt_id}")
async def generate_certificate(
    attempt_id: str,
    template_id: str = None,
    current_admin = Depends(get_current_admin_user)
):
    """Generate certificate PDF from template"""
    # Get attempt data
    attempt = await db.cert_test_attempts.find_one({"attempt_id": attempt_id})
    
    # Get template
    if template_id:
        template = await db.certificate_templates.find_one({"template_id": template_id})
    else:
        template = await db.certificate_templates.find_one({
            "is_default": True,
            "applicable_certs": {"$in": [attempt["cert_id"], "all"]}
        })
    
    # Read template content
    with open(template["file_path"], 'r') as f:
        template_html = f.read()
    
    # Replace variables
    template_obj = Template(template_html)
    rendered_html = template_obj.render(
        USER_NAME=attempt["user_name"],
        USER_EMAIL=attempt["user_email"],
        CERTIFICATION_NAME=attempt["cert_id"],
        DIFFICULTY=attempt["difficulty"].upper(),
        SCORE=attempt["score"],
        PASS_PERCENTAGE=attempt["settings"]["pass_percentage"],
        DATE=attempt["finished_at"].strftime("%B %d, %Y"),
        CERTIFICATE_ID=f"LQ-{attempt['cert_id'][:3].upper()}-{attempt['finished_at'].year}-{attempt_id[:6]}",
        LOGO_URL="https://yourcdn.com/learnquest-logo.png"
    )
    
    # Convert to PDF
    pdf_filename = f"certificate_{attempt_id}.pdf"
    pdf_path = f"certificates/{pdf_filename}"
    HTML(string=rendered_html).write_pdf(pdf_path)
    
    # Store certificate reference
    await db.cert_test_attempts.update_one(
        {"attempt_id": attempt_id},
        {"$set": {
            "certificate_generated": True,
            "certificate_path": pdf_path,
            "certificate_generated_at": datetime.utcnow()
        }}
    )
    
    return {
        "message": "Certificate generated successfully",
        "certificate_url": f"/certificates/{pdf_filename}"
    }
```

---

## Email Template for Certificate Delivery

### HTML Email Template:
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: white;
      padding: 30px;
      border: 1px solid #ddd;
      border-top: none;
      border-radius: 0 0 10px 10px;
    }
    .certificate-preview {
      width: 100%;
      max-width: 400px;
      margin: 20px auto;
      display: block;
      border: 2px solid #667eea;
      border-radius: 8px;
    }
    .button {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 10px 0;
    }
    .stats {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Congratulations {{USER_NAME}}!</h1>
      <p>You've earned your certificate</p>
    </div>
    <div class="content">
      <p>Dear {{USER_NAME}},</p>
      
      <p>Congratulations on successfully completing the <strong>{{CERTIFICATION_NAME}}</strong> certification at <strong>{{DIFFICULTY}}</strong> level!</p>
      
      <div class="stats">
        <strong>Your Achievement:</strong><br>
        📊 Score: {{SCORE}}%<br>
        📅 Completed: {{DATE}}<br>
        🎯 Level: {{DIFFICULTY}}<br>
        🆔 Certificate ID: {{CERTIFICATE_ID}}
      </div>
      
      <p style="text-align: center;">
        <a href="{{CERTIFICATE_DOWNLOAD_URL}}" class="button">
          📥 Download Certificate (PDF)
        </a>
      </p>
      
      <p>Your certificate is attached to this email and can also be downloaded from your LearnQuest dashboard.</p>
      
      <p>Share your achievement on LinkedIn and other social media platforms to showcase your skills!</p>
      
      <p>Keep learning and exploring new certifications on LearnQuest!</p>
      
      <p>Best regards,<br>
      <strong>LearnQuest Team</strong></p>
    </div>
  </div>
</body>
</html>
```

---

## Bulk Email Function

```python
@router.post("/admin/certificates/send-bulk")
async def send_bulk_certificates(
    attempt_ids: List[str] = Body(...),
    template_id: str = Body(None),
    current_admin = Depends(get_current_admin_user)
):
    """Send certificates to multiple users via email"""
    results = {
        "total": len(attempt_ids),
        "success": 0,
        "failed": 0,
        "details": []
    }
    
    for attempt_id in attempt_ids:
        try:
            # Generate certificate if not exists
            attempt = await db.cert_test_attempts.find_one({"attempt_id": attempt_id})
            
            if not attempt.get("certificate_path"):
                cert_result = await generate_certificate(attempt_id, template_id, current_admin)
                cert_path = cert_result["certificate_url"]
            else:
                cert_path = attempt["certificate_path"]
            
            # Send email with attachment
            await send_certificate_email(
                to_email=attempt["user_email"],
                user_name=attempt["user_name"],
                cert_name=attempt["cert_id"],
                score=attempt["score"],
                difficulty=attempt["difficulty"],
                date=attempt["finished_at"].strftime("%B %d, %Y"),
                cert_id=f"LQ-{attempt['cert_id'][:3].upper()}-{attempt['finished_at'].year}-{attempt_id[:6]}",
                certificate_path=cert_path
            )
            
            results["success"] += 1
            results["details"].append({
                "attempt_id": attempt_id,
                "user_email": attempt["user_email"],
                "status": "sent"
            })
            
        except Exception as e:
            results["failed"] += 1
            results["details"].append({
                "attempt_id": attempt_id,
                "error": str(e),
                "status": "failed"
            })
    
    return results
```

---

## Quick Start Guide

### Step 1: Create Your Template
1. Choose format (HTML recommended)
2. Design certificate with placeholders
3. Test locally with sample data

### Step 2: Upload via Admin Panel
1. Navigate to Certificate Management
2. Click "Upload Template"
3. Select your `.html` file
4. Set template name and applicable certifications

### Step 3: Test Generation
1. Go to Results & Analytics
2. Find a passed user
3. Click "Generate Certificate"
4. Verify output PDF

### Step 4: Bulk Send
1. Go to Certificate Management
2. Select multiple passed users
3. Click "Send Certificates (X)"
4. Verify emails received

---

## Best Practices

### Design Guidelines:
✅ Use A4 landscape (297mm x 210mm)  
✅ Keep text readable (min 14px)  
✅ Use web-safe fonts or embed fonts  
✅ Test with long names (30+ characters)  
✅ Include certificate ID for verification  
✅ Add QR code for online verification (optional)  

### Technical Guidelines:
✅ Keep HTML under 500KB  
✅ Use inline CSS (no external stylesheets)  
✅ Test PDF generation with various data  
✅ Validate all placeholders replaced  
✅ Handle special characters in names  

### Security:
✅ Store templates securely  
✅ Validate file types on upload  
✅ Scan for malicious code  
✅ Limit file sizes  
✅ Restrict admin access only  

---

## Summary

**Recommended Format:** HTML with inline CSS  
**Upload Location:** Certificate Management page  
**File Size:** Max 500KB for HTML  
**Required Variables:** USER_NAME, CERTIFICATION_NAME, SCORE, DATE  
**Output Format:** PDF (generated from HTML)  
**Delivery:** Email with PDF attachment  

Your template will be used to generate personalized certificates for all passed users! 🎓
