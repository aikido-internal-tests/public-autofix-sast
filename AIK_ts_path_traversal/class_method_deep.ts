import { readFileSync } from 'fs';
import * as path from 'path';
import { Logger } from './logger';

interface ReportConfig {
	outputDir: string;
	format: string;
}

export class ReportGenerator {
	private readonly config: ReportConfig;
	private readonly logger: Logger;
	private generatedCount = 0;

	constructor(config: ReportConfig) {
		this.config = config;
		this.logger = new Logger('ReportGenerator');
	}

	public getGeneratedCount(): number {
		return this.generatedCount;
	}

	public resetCount(): void {
		this.generatedCount = 0;
	}

	private formatOutput(raw: string): string {
		return raw.trim().replace(/\r\n/g, '\n');
	}

	public loadTemplate(templateName: string): string {
		this.logger.info(`Loading template ${templateName}`);
		const baseFull = path.resolve(this.config.outputDir);
		const target = path.join(baseFull, templateName);
		const rel = path.relative(baseFull, target);
		if (rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) {
			throw new Error('Invalid file path');
		}
		const content = readFileSync(target, 'utf-8');
		this.generatedCount++;
		return this.formatOutput(content);
	}
}
