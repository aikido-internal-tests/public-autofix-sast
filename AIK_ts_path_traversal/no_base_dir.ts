import { promises as fs } from 'fs';

interface DownloadJob {
	jobId: string;
	storagePath: string;
}

export async function processDownload(job: DownloadJob): Promise<Buffer> {
	const data = await fs.readFile(job.storagePath);
	return data;
}
