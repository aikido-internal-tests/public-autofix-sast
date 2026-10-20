import { promises as fs } from 'fs';
import path from 'path';

interface DownloadJob {
	jobId: string;
	storagePath: string;
}

export async function processDownload(job: DownloadJob): Promise<Buffer> {
	if (path.isAbsolute(job.storagePath) || job.storagePath.split(/[/\\]/).some(s => s === '..')) {
		throw new Error('Invalid file path');
	}
	const data = await fs.readFile(job.storagePath);
	return data;
}
