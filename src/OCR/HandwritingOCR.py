import requests
import os
import json  # For pretty-printing JSON
import time
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


api_key = os.getenv("HOCR")
if not api_key:
    raise ValueError("HandwritingOCR API key not found. Please set the HANDWRITINGOCR_KEY environment variable.")
print(api_key)



headers = {
    'Authorization': f'Bearer {api_key}',
    'Accept': 'application/json'
}

files = {
    'file': open('./IMG_9756.jpg', 'rb')
}

data = {
    'action': 'transcribe',
    'delete_after': '604800'
}

try:
    response = requests.post(
        'https://www.handwritingocr.com/api/v2/documents',
        headers=headers,
        files=files,
        data=data
    )
    
    if response.status_code == 201:
        data = response.json()
        print(json.dumps(data, indent=4))
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

finally:
    # Make sure we close the file
    files['file'].close()

document_id = data['id']
status_url = f"https://www.handwritingocr.com/api/v2/documents/{document_id}"
download_url = f'https://www.handwritingocr.com/api/v2/documents/{document_id}.txt'

print("⏳ Waiting for document processing...")

for attempt in range(10):  # Try up to 10 times (adjust as needed)
    time.sleep(5)  # Wait for 5 seconds before checking the status
    
    status_response = requests.get(status_url, headers=headers)
    
    if status_response.status_code == 200:
        status_data = status_response.json()
        status = status_data.get("status")
        print(f"🔄 Attempt {attempt+1}: Status - {status}")

        if status == "processed":
            print("✅ Document is ready for download!")
            break  # Exit loop when transcription is ready
        elif status in ["failed", "error"]:
            print("❌ Document processing failed.")
            exit()
    else:
        print(f"❌ Error checking status: {status_response.status_code}")
        print(status_response.text)
        exit()
else:
    print("❌ Timeout: Document processing is taking too long. Try again later.")
    exit()



download_response = requests.get(
    download_url,
    headers=headers,
    stream=True  # Important for handling large files efficiently
)

if download_response.status_code == 200:
    with open('document.txt', 'wb') as f:
        for chunk in download_response.iter_content(chunk_size=8192):
            f.write(chunk)
    print("💽File downloaded successfully")
else:
    print(f"Error: {download_response.status_code}")
    print(download_response.text)