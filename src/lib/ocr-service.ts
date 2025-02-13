const CHUNKR_API_URL = process.env.NEXT_PUBLIC_CHUNKR_API_URL || 'https://api.chunkr.ai/v1';
const CHUNKR_API_KEY = process.env.NEXT_PUBLIC_CHUNKR_API_KEY;

export async function performOcr(file: File): Promise<string[]> {
    if (!CHUNKR_API_KEY) {
        throw new Error('Chunkr API key is not configured');
    }

    try {
        /*
        // Create form data
        const formData = new FormData();
        formData.append('file', file);
        // formData.append('task', 'ocr');
        // formData.append('options', JSON.stringify({
        //     language: 'eng',
        //     output_format: 'text'
        // }));
        formData.append("json_schema", "<any>");
        formData.append("model", "Fast");
        formData.append("ocr_strategy", "Auto");
        formData.append("segmentation_strategy", "LayoutAnalysis");
        formData.append("target_chunk_length", "123");
        */

        /*HttpResponse<String> response = Unirest.post("https://api.chunkr.ai/api/v1/task/parse")
        .header("Authorization", "<api-key>")
        .header("Content-Type", "application/json")
        .body("{\n  \"chunk_processing\": null,\n  \"expires_in\": 123,\n  \"file\": \"<string>\",\n  \"file_name\": \"<string>\",\n  \"high_resolution\": false,\n  \"ocr_strategy\": null,\n  \"pipeline\": null,\n  \"segment_processing\": null,\n  \"segmentation_strategy\": null\n}")
        .asString();*/
            
        // Initial task creation
        const taskResponse = await fetch(`${CHUNKR_API_URL}/task/parse`, {
            method: 'POST',
            headers: {
                'Authorization': `${CHUNKR_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: `{\n  \"chunk_processing\": null,\n  \"expires_in\": 123,\n  \"file\": \"${file}\",\n \"high_resolution\": false,\n  \"ocr_strategy\": null,\n  \"pipeline\": null,\n  \"segment_processing\": null,\n  \"segmentation_strategy\": null\n}`,
            mode: 'cors',
        });

        if (!taskResponse.ok) {
            const errorData = await taskResponse.json().catch(() => ({}));
            console.error('Task creation failed:', errorData);
            throw new Error(`API Error: ${taskResponse.status} - ${taskResponse.statusText}`);
        }

        const taskData = await taskResponse.json();
        
        // Poll for results
        const result = await pollTaskResult(taskData.task_id);
        
        // Process the text content
        const textContent = result.output?.text || '';
        const lines = textContent
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && /\d+\/\d+/.test(line));

        if (lines.length === 0) {
            console.warn('No blood pressure readings found in OCR result');
        }

        return lines;
    } catch (error) {
        console.error('OCR processing error:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to process image');
    }
}

async function pollTaskResult(taskId: string, maxAttempts = 30): Promise<any> {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    let attempts = 0;

    while (attempts < maxAttempts) {
        try {
            const response = await fetch(`${CHUNKR_API_URL}/task/${taskId}`, {
                headers: {
                    'Authorization': `${CHUNKR_API_KEY}`,
                    'Accept': 'application/json',
                },
                mode: 'cors',
            });

            if (!response.ok) {
                throw new Error(`Poll failed: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === 'completed') {
                return data;
            } else if (data.status === 'failed') {
                throw new Error(data.error || 'Task processing failed');
            }

            attempts++;
            await delay(2000);
        } catch (error) {
            console.error(`Polling attempt ${attempts} failed:`, error);
            throw error;
        }
    }

    throw new Error('Task polling timed out');
}
