import * as fs from 'fs';
import * as path from 'path';
import express from 'express';

const DATA_DIR = '/var/lib/app/data';

const app = express();

app.post('/documents/:name/replace', express.json(), (req, res) => {
	const baseFull = path.resolve(DATA_DIR);
	const documentPath = path.join(baseFull, req.params.name);
	const rel = path.relative(baseFull, documentPath);
	if (rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) {
		return res.status(400).json({ error: 'Invalid file path' });
	}

	if (!fs.existsSync(documentPath)) {
		return res.status(404).json({ error: 'Document not found' });
	}

	const backup = fs.readFileSync(documentPath, 'utf-8');
	fs.writeFileSync(documentPath, req.body.content);

	res.json({ replaced: true, previousLength: backup.length });
});
