import { readFileSync } from 'fs';
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
		const content = readFileSync(`${this.config.outputDir}/${templateName}`, 'utf-8');
		this.generatedCount++;
		return this.formatOutput(content);
	}
}
