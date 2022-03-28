import { SfdxCommand, flags } from "@salesforce/command";
import { DescribeSObjectResult } from "jsforce";
import FieldDocsFactory from "../../../FieldDocsFactory";
import { join } from "path";
import { existsSync, promises } from "fs";
import BaseSObjectDocsGenerator from "../../../sObjectsDocsGenerator/BaseSObjectDocsGenerator";

export default class GenerateSObjectTypings extends SfdxCommand {
	protected static requiresUsername = true;
	protected static requiresProject = true;

	protected static flagsConfig = {
		sobjects: flags.string({
			description:
				"Comma separated sObjects api names to generate typings for",
			required: true,
			char: "s",
		}),
		"remove-existing": flags.boolean({
			description: "Remove existing typings",
			char: "r",
		}),
	};

	public async run(): Promise<unknown> {
		if (this.flags["remove-existing"]) {
			await this.removeExistingTyping();
		}
		await this.createNecessaryDirs();
		return this.flags.sobjects
			.split(",")
			.map((dirtyName) => dirtyName.trim())
			.map((sObjectName) => this.generateTypingsForSObject(sObjectName));
	}

	private async createNecessaryDirs() {
		await this.createDirIfNotExists(join(this.project.getPath(), ".sfdx"));
		await this.createDirIfNotExists(
			join(this.project.getPath(), ".sfdx", "tools")
		);
		await Promise.all([
			this.createDirIfNotExists(
				join(this.project.getPath(), ".sfdx", "tools", "sobjects")
			),
			this.createDirIfNotExists(
				join(this.project.getPath(), ".sfdx", "tools", "soqlMetadata")
			),
		]).then(() =>
			Promise.all([
				this.createDirIfNotExists(
					join(
						this.project.getPath(),
						".sfdx",
						"tools",
						"sobjects",
						"customObjects"
					)
				),
				this.createDirIfNotExists(
					join(
						this.project.getPath(),
						".sfdx",
						"tools",
						"sobjects",
						"standardObjects"
					)
				),
				this.createDirIfNotExists(
					join(
						this.project.getPath(),
						".sfdx",
						"tools",
						"soqlMetadata",
						"customObjects"
					)
				),
				this.createDirIfNotExists(
					join(
						this.project.getPath(),
						".sfdx",
						"tools",
						"soqlMetadata",
						"standardObjects"
					)
				),
			])
		);
	}

	private async createDirIfNotExists(dir: string) {
		if (!existsSync(dir)) {
			return promises.mkdir(dir);
		}
	}

	private async removeExistingTyping() {
		const dirsToRemove = [
			join(this.project.getPath(), ".sfdx", "tools", "sobjects"),
			join(
				this.project.getPath(),
				".sfdx",
				"tools",
				"soqlMetadata",
				"customObjects"
			),
			join(
				this.project.getPath(),
				".sfdx",
				"tools",
				"soqlMetadata",
				"standardObjects"
			),
		].filter((path) => existsSync(path));
		return Promise.all(
			dirsToRemove.map((dir) => promises.rm(dir, { recursive: true }))
		);
	}

	private async generateTypingsForSObject(apiName: string) {
		let sObjectDescribe;
		try {
			sObjectDescribe = await this.org
				.getConnection()
				.sobject(apiName)
				.describe();
		} catch (error) {
			this.ux.error(
				`Error fetching describe for sObject ${apiName}: ${error}`
			);
			return {
				success: false,
				sObject: apiName,
				error,
			};
		}
		return Promise.all([
			this.generateClsFileForSObject(sObjectDescribe),
			this.generateQueryMetadataFileForSObject(sObjectDescribe),
		])
			.then(() => {
				this.ux.log(
					`Generated typings for ${sObjectDescribe.label}(${sObjectDescribe.name})`
				);
				return {
					success: true,
					sObject: sObjectDescribe.name,
				};
			})
			.catch((error) => {
				this.ux.error(
					`Error generating typings for ${sObjectDescribe.label}(${sObjectDescribe.name}): ${error}`
				);
				return {
					success: false,
					sObject: sObjectDescribe.name,
					error,
				};
			});
	}

	private async generateClsFileForSObject(
		sObjectDescribe: DescribeSObjectResult
	) {
		const docsGeneratorFactory = new FieldDocsFactory();
		let classContent =
			new BaseSObjectDocsGenerator().generateDocs(sObjectDescribe) +
			`global class ${sObjectDescribe.name} {\n`;
		for (const field of sObjectDescribe.fields) {
			const fieldDocsGenerator =
				docsGeneratorFactory.getFieldDocsGenerator(field);
			classContent += fieldDocsGenerator.generateDocs(field);
		}
		const subfolderName = sObjectDescribe.custom
			? "customObjects"
			: "standardObjects";
		const fileName = `${sObjectDescribe.name}.cls`;
		const filePath = join(
			this.project.getPath(),
			".sfdx",
			"tools",
			"sobjects",
			subfolderName,
			fileName
		);
		if (existsSync(filePath)) {
			await promises.rm(filePath);
		}
		return promises.writeFile(filePath, classContent + "}\n");
	}

	private async generateQueryMetadataFileForSObject(
		sObjectDescribe: DescribeSObjectResult
	) {
		const strippedFields = sObjectDescribe.fields.map((field) => {
			return {
				name: field.name,
				type: field.type,
			};
		});
		const subfolderName = sObjectDescribe.custom
			? "customObjects"
			: "standardObjects";
		const outputPath = join(
			this.project.getPath(),
			".sfdx",
			"tools",
			"soqlMetadata",
			subfolderName,
			`${sObjectDescribe.name}.json`
		);
		if (existsSync(outputPath)) {
			await promises.rm(outputPath);
		}
		return promises.writeFile(
			outputPath,
			JSON.stringify({ fields: strippedFields })
		);
	}
}
