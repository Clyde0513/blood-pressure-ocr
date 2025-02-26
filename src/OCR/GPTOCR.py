import base64
import json
import os
from io import BytesIO
import logging
from dotenv import load_dotenv  # Install with `pip install python-dotenv`

# Load environment variables from .env file
load_dotenv()

from openai import OpenAI, OpenAIError # Install with `pip install openai`
from PIL import Image, UnidentifiedImageError # Install with `pip install pillow`
from pydantic import BaseModel, Field, ValidationError # Install with `pip install pydantic`

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


def get_api_key():
    """Get OpenAI API key from environment variables."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError(
            "OpenAI API key not found. Please set the OPENAI_API_KEY environment variable."
        )
    return api_key

# Initialize OpenAI client
client = OpenAI(
    api_key=get_api_key(),
)

class BloodPressureReading(BaseModel):
    date: str = Field(..., description="Date of the measurement (MM-DD)")
    time: str = Field(..., description="Time of the measurement (AM or PM)")
    systolic: int = Field(..., description="Systolic blood pressure (integer)")
    diastolic: int = Field(..., description="Diastolic blood pressure (integer)")
    pulse: int = Field(..., description="Pulse rate (integer)")
    
    # Example of custom validation (optional)
    # @validator('systolic')
    # def systolic_must_be_valid(cls, value):
    #     if not 50 <= value <= 250:  # Example range
    #         raise ValueError("Systolic value is out of range")
    #     return value

class BloodPressureLog(BaseModel):
    readings: list[BloodPressureReading] = Field(..., description="List of blood pressure readings")

def encode_image(image_path, max_image_size=(800,800)):
    """Encodes an image to base64, resizing if necessary"""
    try:
        img = Image.open(image_path)
        if img.width > max_image_size[0] or img.height > max_image_size[1]:
            img.thumbnail(max_image_size)
        buffered = BytesIO()
        img_str = img.save(buffered, format="PNG")  # Use PNG for lossless encoding
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return img_str
    
    except FileNotFoundError:
        logging.error(f"Error: Image file not found: {image_path}")
        return None
    except UnidentifiedImageError:
        logging.error(f"Error: Unidentified image format: {image_path}")
        return None
    except Exception as e:
        logging.error(f"Error encoding image: {e}") # use logging.exception for full traceback
        return None


def extract_blood_pressure(image_path):
    """Sends an image to OpenAI and extracts blood pressure data."""

    base64_image = encode_image(image_path)
    if base64_image is None:
        return None

    try:
        response = client.chat.completions.create(
            model="gpt-4o", 
            messages=[
                {
                    "role": "user", "`content": "User provided image for blood pressure extraction.",
                    "content": [
                        {"type": "text", "text": f"""Extract blood pressure readings from the imag`e with at least 80% accuracy. If image is to blurry or unclear, return null.
                                                There's two tables, but look at the first table first for now.
                                                The image contains a table with columns: Date (MM-DD), AM (Systolic/Diastolic), and PM (Systolic/Diastolic).
                                                Return a JSON array of objects, where each object has the following fields:
                                                - date (string, MM-DD format)
                                                - time (string, either "AM" or "PM")
                                                - systolic (integer)
                                                - diastolic (integer)
                                                - pulse (integer, can be null if not available)
                                                If a value can't be confidently extracted, use null.
                                                Example JSON output format:
                                                ```json
                                                {{
                                                    "readings": [
                                                        {{"date": "07-26", "systolic": 120, "diastolic": 80, "pulse": 72}},
                                                        {{"date": "07-26", "systolic": 110, "diastolic": 75, "pulse": 68}}
                                                    ]
                                                }}
                                                ```
                                                """},
                        {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{base64_image}", "detail": "high"}},
                    ],
                }
            ],
            max_tokens=10000, # Adjust as needed
            temperature = 0.2, # Adjust as needed, Lower temperature for more consistent results
            #response_format={"type": "json_object"},
        )

        json_output = response.choices[0].message.content

        try:
          data = json.loads(json_output)
          validated_data = BloodPressureLog(**data)
          return validated_data.model_dump_json(indent=4) # returns validated json
        except json.JSONDecodeError as e:
            logging.error(f"JSON Decode Error: {e}. Raw output: {json_output}")
            return None
        except ValidationError as e:
            logging.error(f"Pydantic Validation Error: {e}. Raw output: {json_output}")
            return None

    except OpenAIError as e:
        logging.error(f"OpenAI API Error: {e}")
        return None



if __name__ == "__main__":
    # Example usage (replace with your image path)
    image_path = "./IMG_6436.jpeg"  # Replace with your image file
    parsed_data = extract_blood_pressure(image_path)

    if parsed_data:
        print(parsed_data)
    else:
        print("Failed to extract blood pressure data.")