import * as fs from 'fs';
import * as path from 'path';
import express from 'express';

const DATA_DIR = '/var/lib/app/data';

const app = express();

app.post('/documents/:name/replace', express.json(), (req, res) => {
	const documentPath = path.join(DATA_DIR, req.params.name);

	if (!fs.existsSync(documentPath)) {
		return res.status(404).json({ error: 'Document not found' });
	}

	const backup = fs.readFileSync(documentPath, 'utf-8');
	fs.writeFileSync(documentPath, req.body.content);

	res.json({ replaced: true, previousLength: backup.length });
});
