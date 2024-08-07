import { NextApiRequest, NextApiResponse } from 'next';
import * as tf from '@tensorflow/tfjs-node';
import path from 'path';

let lstmModel: tf.LayersModel | null = null;

// Load the LSTM model
async function loadModel() {
    const modelPath = path.resolve(process.cwd(), 'models/lstm/model.h5');
    lstmModel = await tf.loadLayersModel(`file://${modelPath}`);
}

// Ensure the model is loaded before handling requests
loadModel().then(() => {
    console.log('LSTM model loaded successfully');
}).catch(err => {
    console.error('Error loading LSTM model:', err);
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Only POST requests are allowed' });
        return;
    }

    if (!lstmModel) {
        res.status(500).json({ message: 'Model not loaded' });
        return;
    }

    const { data } = req.body;

    if (!Array.isArray(data) || data.length === 0) {
        res.status(400).json({ message: 'Invalid input data' });
        return;
    }

    // Normalize the input data
    function minMaxScale(arr: number[]): number[] {
        const min = Math.min(...arr);
        const max = Math.max(...arr);
        return arr.map(value => (value - min) / (max - min));
    }

    const normalizedData = minMaxScale(data);

    // Prepare the input tensor as a 3D tensor for LSTM input
    const inputTensor = tf.tensor3d([normalizedData.map(value => [value])], [1, normalizedData.length, 1]);

    // Make predictions
    const predictions = lstmModel.predict(inputTensor) as tf.Tensor;
    const predictionArray = await predictions.array();

    res.status(200).json({ predictions: predictionArray });
};

export default handler;
