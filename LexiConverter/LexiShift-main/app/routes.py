import io
import os
import logging
import json
import pdfplumber
from flask import Blueprint, render_template, request, send_file, jsonify, url_for, send_from_directory
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from PIL import Image as PILImage
from reportlab.lib.utils import ImageReader
import pandas as pd
from .ml_model import train_model, predict_formatting

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
main = Blueprint('main', __name__)


with open('data/books.json') as f:
    books = json.load(f)


@main.route('/')
def index():
    return render_template('index.html')

@main.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(main.static_folder, filename)
    
    
@main.route('/contact')
def contact():
    return render_template('contact.html')

@main.route('/privacy')
def privacy():
    return render_template('privacy.html')

@main.route('/terms')
def terms():
    return render_template('terms.html')

@main.route('/learn_more')
def learn_more():
    return render_template('learn_more.html')


@main.route('/api/books')
def get_books():
    search_query = request.args.get('q', '').lower()
    if search_query:
        filtered_books = [book for book in books if search_query in book['title'].lower()]
    else:
        filtered_books = books
    return jsonify(filtered_books)


@main.route('/ai_recommendations', methods=['POST'])
def ai_recommendations():
    form_data = request.form

    # Fixed type conversion to handle decimal values
    try:
        font_size = float(form_data.get('font_size', 12))
        line_spacing = float(form_data.get('line_spacing', 1))
    except ValueError:
        # Fallback to defaults if conversion fails
        font_size = 12
        line_spacing = 1
        logger.warning(f"Invalid numeric values in form data: {dict(form_data)}")
    
    font_family = form_data.get('font_family', 'Arial')

    # Simple heuristic for generating recommendations
    recommendations = []

    if font_size < 14:
        recommendations.append("Consider using a larger font size for better readability.")
    if line_spacing < 1.5:
        recommendations.append("Increase the line spacing to at least 1.5 for improved readability.")
    
    if not recommendations:
        recommendations.append("Your document settings are optimal!")

    return jsonify({"recommendations": recommendations})

def convert_text(text):
    # Preserving case for better readability
    return text

def wrap_text(text, max_width, c, font_name, font_size):
    words = text.split()
    lines = []
    line = []
    line_width = 0
    
    # Modified to remove the minimum words constraint
    for word in words:
        word_width = c.stringWidth(word, font_name, font_size)
        space_width = c.stringWidth(' ', font_name, font_size)
        
        if line and line_width + word_width + space_width <= max_width:
            line.append(word)
            line_width += word_width + space_width
        else:
            if line:
                lines.append(' '.join(line))
            line = [word]
            line_width = word_width
    
    if line:
        lines.append(' '.join(line))
    return lines

def check_overlap(x, y, text_width, text_height, images, height):
    for img in images:
        if (x < img['x1'] and x + text_width > img['x0'] and 
            y > height - img['bottom'] and y < height - img['top']):
            return True
    return False

def create_dyslexia_friendly_pdf(input_pdf, font_name='OpenDyslexic', font_size=12, line_spacing=14, letter_spacing=0.1, text_color='black'):
    logger.debug("Starting PDF conversion")
    output = io.BytesIO()
    input_pdf.seek(0)

    # Handle font registration with proper error handling
    try:
        font_path = os.path.join(os.path.dirname(__file__), 'static', 'OpenDyslexic.ttf')
        pdfmetrics.registerFont(TTFont('OpenDyslexic', font_path))
    except Exception as e:
        logger.error(f"Font registration error: {str(e)}")
        # Fallback to a standard font
        font_name = 'Helvetica'

    try:
        c = canvas.Canvas(output, pagesize=letter)
        width, height = letter
        margin = 50

        with pdfplumber.open(input_pdf) as pdf:
            for page_num, page in enumerate(pdf.pages):
                logger.debug(f"Processing page {page_num}")
                
                if page_num > 0:  # Only create a new page after processing the first page
                    c.showPage()
                
                c.setFont(font_name, font_size)
                c.setFillColor(HexColor(text_color) if text_color.startswith('#') else text_color)

                try:
                    images = page.images if hasattr(page, 'images') else []
                    words = page.extract_words()
                except Exception as e:
                    logger.error(f"Error extracting content from page {page_num}: {str(e)}")
                    continue

                # Process images
                for image in images:
                    try:
                        img_bbox = [image['x0'], image['top'], image['x1'], image['bottom']]
                        img_bbox[0] = max(img_bbox[0], page.bbox[0])
                        img_bbox[1] = max(img_bbox[1], page.bbox[1])
                        img_bbox[2] = min(img_bbox[2], page.bbox[2])
                        img_bbox[3] = min(img_bbox[3], page.bbox[3])

                        img = page.within_bbox(img_bbox).to_image()
                        img_data = io.BytesIO()
                        img.save(img_data, format='PNG')
                        img_data.seek(0)
                        pil_img = PILImage.open(img_data)
                        
                        # Fix image positioning
                        c.drawImage(ImageReader(pil_img), 
                                   img_bbox[0], 
                                   height - img_bbox[3],  # Corrected positioning
                                   img_bbox[2] - img_bbox[0], 
                                   img_bbox[3] - img_bbox[1])
                    except Exception as e:
                        logger.error(f"Error processing image: {str(e)}")

                line_y = height - margin
                x = margin
                max_width = width - 2 * margin

                # Group words by lines for better text flow
                line_groups = {}
                for word in words:
                    # Group by vertical position (rounded to nearest pixel)
                    y_pos = round(word['top'])
                    if y_pos not in line_groups:
                        line_groups[y_pos] = []
                    line_groups[y_pos].append(word)
                
                # Sort lines from top to bottom and words from left to right
                sorted_lines = []
                for y_pos in sorted(line_groups.keys()):
                    line_words = sorted(line_groups[y_pos], key=lambda w: w['x0'])
                    line_text = ' '.join(w['text'] for w in line_words)
                    sorted_lines.append(line_text)
                
                # Process each line
                for line_text in sorted_lines:
                    wrapped_lines = wrap_text(convert_text(line_text), max_width, c, font_name, font_size)
                    
                    for line in wrapped_lines:
                        text_width = c.stringWidth(line, font_name, font_size)
                        text_height = font_size

                        # Check for image overlap
                        if check_overlap(x, line_y, text_width, text_height, images, height):
                            line_y -= line_spacing
                            if line_y < margin:
                                c.showPage()
                                c.setFont(font_name, font_size)
                                c.setFillColor(HexColor(text_color) if text_color.startswith('#') else text_color)
                                line_y = height - margin
                                x = margin

                        # Draw the text
                        c.drawString(x, line_y, line, charSpace=letter_spacing)
                        line_y -= line_spacing

                        # Check if we need a new page
                        if line_y < margin:
                            c.showPage()
                            c.setFont(font_name, font_size)
                            c.setFillColor(HexColor(text_color) if text_color.startswith('#') else text_color)
                            line_y = height - margin
                            x = margin

        c.save()
        output.seek(0)
        logger.debug("PDF conversion completed")
        return output
        
    except Exception as e:
        logger.error(f"Error in PDF conversion: {str(e)}")
        # Create a simple error PDF
        error_output = io.BytesIO()
        c = canvas.Canvas(error_output, pagesize=letter)
        c.setFont("Helvetica", 12)
        c.drawString(100, 500, f"Error converting PDF: {str(e)}")
        c.save()
        error_output.seek(0)
        return error_output

@main.route('/', methods=['POST'])
def upload():
    if request.method == 'POST':
        try:
            if 'file' not in request.files or request.files['file'].filename == '':
                logger.error("No file uploaded")
                return jsonify({"error": "No file uploaded"}), 400
                
            pdf_file = request.files['file']
            
            # Safe type conversion for form parameters
            try:
                font_name = request.form.get('font_name', 'OpenDyslexic')
                
                # Handle float values correctly
                font_size_str = request.form.get('font_size', '12')
                line_spacing_str = request.form.get('line_spacing', '14')
                letter_spacing_str = request.form.get('letter_spacing', '0.1')
                
                # Convert to float first, then to int if needed
                font_size = float(font_size_str)
                line_spacing = float(line_spacing_str)
                letter_spacing = float(letter_spacing_str)
                
                text_color = request.form.get('text_color', 'black')
                
                logger.debug(f"Parsed form values: font_size={font_size}, line_spacing={line_spacing}, letter_spacing={letter_spacing}")
            except ValueError as e:
                logger.error(f"Value conversion error: {str(e)}")
                # Fallback to defaults
                font_name = 'OpenDyslexic'
                font_size = 12
                line_spacing = 14
                letter_spacing = 0.1
                text_color = 'black'
            
            # ML model recommendations
            try:
                model = train_model()
                features = pd.DataFrame([[font_name, font_size, line_spacing, letter_spacing, text_color]], 
                                       columns=['font_name', 'font_size', 'line_spacing', 'letter_spacing', 'text_color'])
                suggestion = predict_formatting(features, model)
                
                font_name = suggestion.get('font_name', font_name)
                font_size = suggestion.get('font_size', font_size)
                line_spacing = suggestion.get('line_spacing', line_spacing)
                letter_spacing = suggestion.get('letter_spacing', letter_spacing)
                text_color = suggestion.get('text_color', text_color)
            except Exception as e:
                logger.warning(f"ML model error: {str(e)}")
                # Continue with user values
            
            # Convert the PDF
            dyslexia_friendly_pdf = create_dyslexia_friendly_pdf(
                pdf_file, 
                font_name, 
                font_size, 
                line_spacing, 
                letter_spacing, 
                text_color
            )
            
            return send_file(
                dyslexia_friendly_pdf, 
                as_attachment=True, 
                download_name='dyslexia_friendly.pdf', 
                mimetype='application/pdf'
            )
            
        except Exception as e:
            logger.error(f"Upload error: {str(e)}")
            return jsonify({"error": f"Error processing file: {str(e)}"}), 500

@main.route('/feedback', methods=['POST'])
def feedback():
    feedback_data = request.json
    save_user_feedback(
        feedback_data['feedback'],
        feedback_data['font_name'],
        feedback_data['font_size'],
        feedback_data['line_spacing'],
        feedback_data['letter_spacing'],
        feedback_data['text_color']
    )
    return jsonify({"status": "success"})

@main.route('/suggest_formatting', methods=['POST'])
def suggest_formatting():
    user_prefs = request.json
    model = train_model()
    features = pd.DataFrame([[
        user_prefs['font_name'],
        user_prefs['font_size'],
        user_prefs['line_spacing'],
        user_prefs['letter_spacing'],
        user_prefs['text_color']
    ]], columns=['font_name', 'font_size', 'line_spacing', 'letter_spacing', 'text_color'])
    prediction = predict_formatting(features, model)
    return jsonify({"suggestion": prediction})

def save_user_feedback(feedback, font_name, font_size, line_spacing, letter_spacing, text_color):
    feedback_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'user_feedback.csv')
    with open(feedback_file, 'a') as f:
        f.write(f"{feedback},{font_name},{font_size},{line_spacing},{letter_spacing},{text_color}\n")