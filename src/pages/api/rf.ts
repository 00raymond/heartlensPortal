import { NextApiRequest, NextApiResponse } from 'next';
import { PythonShell } from 'python-shell';
import path from 'path';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== 'POST') {
        res.status(405).json({ message: 'POST requests only.' });
        return;
    }

    const { data } = req.body;
    if (!Array.isArray(data) || data.length === 0) {
        res.status(400).json({ message: 'Invalid data format.' });
        return;
    }

    // Normalize the input data from range [0,1]
    function minMaxScale(arr: number[]): number[] {
        const min = Math.min(...arr);
        const max = Math.max(...arr);
        return arr.map(value => (value - min) / (max - min));
    }

    const normalizedData = minMaxScale(data);

    // Prepare the input for the Python script
    const options = {
        scriptPath: path.resolve(''),
        args: normalizedData.map(String), // Convert numbers to strings
    };

    // Run the Python script
    PythonShell.run('predict_rf.py', options), (err: any, results: any[]) => {
        if (err) {
            console.error('Error running Python script:', err);
            res.status(500).json({ message: 'Error running Python script' });
            return;
        }

        const predictions = results ? results[0] : null;
        res.status(200).json({ predictions });
    };
};

export default handler;

