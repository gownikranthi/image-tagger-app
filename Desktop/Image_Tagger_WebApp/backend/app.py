import os
import io
import json
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import pillow_heif

# --- SETUP THE FLASK APP ---
app = Flask(__name__)
CORS(app)

# Create the 'uploads' folder if it doesn't exist
if not os.path.exists('uploads'):
    os.makedirs('uploads')

# --- AI CONFIGURATION ---
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
CATEGORY_SUB_CATEGORY_MAP = """
- Category: Contact
  Sub-categories: [Business card, Advertisement, Public business details, Flyer with business info, Contact information on invoices]
# ... (and all your other categories)
"""

# --- SETUP THE AI CLIENT ---
try:
    genai.configure(api_key=GOOGLE_API_KEY)
    llm = genai.GenerativeModel('gemini-1.5-flash')
except Exception as e:
    llm = None
    print(f"CRITICAL ERROR: Could not configure Gemini. Check your API key. {e}")


def analyze_image_with_gemini(image_path: str) -> dict:
    if not llm:
        return {"error": "Gemini model is not configured. Check your API Key."}
    
    # This function now raises exceptions instead of returning error dicts
    if image_path.lower().endswith('.heic'):
        heif_file = pillow_heif.read_heif(image_path)
        image = Image.frombytes(heif_file.mode, heif_file.size, heif_file.data, "raw")
    else:
        image = Image.open(image_path)
    
    prompt = f"Analyze the attached image and return a JSON object with 'category', 'subcategory', and 'description' keys based on this list:\n{CATEGORY_SUB_CATEGORY_MAP}"
    
    response = llm.generate_content([prompt, image])
    response_text = response.text.strip().replace("```json", "").replace("```", "")
    result = json.loads(response_text)
    return result


# --- API ENDPOINTS ---
@app.route('/')
def home():
    return "Backend server is running!"

@app.route('/api/analyze', methods=['POST'])
def analyze_image_endpoint():
    # --- THIS ENTIRE FUNCTION IS NOW MORE ROBUST ---
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400
        
        file = request.files['file']

        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        if file:
            temp_path = os.path.join('uploads', file.filename)
            file.save(temp_path)
            
            ai_result = analyze_image_with_gemini(temp_path)
            
            os.remove(temp_path)
            return jsonify(ai_result)

    except Exception as e:
        # This master error handler catches any crash and returns a clean JSON error
        print(f"!!! An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected server error occurred.", "details": str(e)}), 500

# --- RUN THE APP ---
# --- RUN THE APP ---
if __name__ == '__main__':
    if "YOUR_GEMINI_API_KEY" in GOOGLE_API_KEY or not GOOGLE_API_KEY:
         print("\n!!! WARNING: Gemini API Key is missing. The AI will not work. !!!")
    
    # This part is updated for cloud deployment
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)