#!/usr/bin/env python3
"""
Script to convert the SRS Markdown document to PDF
Requires: pip install markdown pdfkit
"""

import markdown
import pdfkit
import os
from pathlib import Path

def markdown_to_pdf(md_file, output_pdf):
    """Convert Markdown file to PDF"""
    
    # Read the markdown file
    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    # Convert markdown to HTML
    html = markdown.markdown(md_content, extensions=['tables', 'toc', 'codehilite'])
    
    # Add CSS styling for better PDF formatting
    css_style = """
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 40px;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        h1 {
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            border-bottom: 2px solid #ecf0f1;
            padding-bottom: 5px;
        }
        code {
            background-color: #f8f9fa;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        pre {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        blockquote {
            border-left: 4px solid #3498db;
            margin: 20px 0;
            padding: 10px 20px;
            background-color: #f8f9fa;
        }
        .toc {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .page-break {
            page-break-before: always;
        }
    </style>
    """
    
    # Combine CSS and HTML
    full_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Crypto AI Trading System - SRS</title>
        {css_style}
    </head>
    <body>
        {html}
    </body>
    </html>
    """
    
    # PDF options
    options = {
        'page-size': 'A4',
        'margin-top': '0.75in',
        'margin-right': '0.75in',
        'margin-bottom': '0.75in',
        'margin-left': '0.75in',
        'encoding': "UTF-8",
        'no-outline': None,
        'enable-local-file-access': None
    }
    
    try:
        # Convert HTML to PDF
        pdfkit.from_string(full_html, output_pdf, options=options)
        print(f"✅ PDF generated successfully: {output_pdf}")
        return True
    except Exception as e:
        print(f"❌ Error generating PDF: {e}")
        print("💡 Make sure you have wkhtmltopdf installed:")
        print("   - Windows: Download from https://wkhtmltopdf.org/downloads.html")
        print("   - macOS: brew install wkhtmltopdf")
        print("   - Ubuntu: sudo apt-get install wkhtmltopdf")
        return False

def main():
    """Main function"""
    md_file = "Crypto_AI_Trading_System_SRS.md"
    output_pdf = "Crypto_AI_Trading_System_SRS.pdf"
    
    if not os.path.exists(md_file):
        print(f"❌ Markdown file not found: {md_file}")
        return
    
    print("🔄 Converting Markdown to PDF...")
    success = markdown_to_pdf(md_file, output_pdf)
    
    if success:
        file_size = os.path.getsize(output_pdf) / 1024 / 1024  # MB
        print(f"📄 PDF file size: {file_size:.2f} MB")
        print(f"📁 Output file: {os.path.abspath(output_pdf)}")

if __name__ == "__main__":
    main()
