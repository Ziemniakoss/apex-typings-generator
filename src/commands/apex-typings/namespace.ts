import { SfdxCommand, flags } from "@salesforce/command";
import { Messages } from "@salesforce/core";
import { promises } from "fs";
import { join } from "path";

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages(
	"sfdx-apex-typings-generator",
	"package"
);

export default class GenerateSObjectTypingsForNamespace extends SfdxCommand {
	protected static requiresUsername = true;
	protected static requiresProject = true;

	public static description = messages.getMessage("description");

	static examples = [
		messages.getMessage("example_fetch_all_namespaces"),
		messages.getMessage("example_fetch_for_one_namespace"),
		messages.getMessage("example_fetch_multiple"),
	];

	protected static flagsConfig = {
		namespaces: flags.string({
			description: messages.getMessage("flag_namespace"),
			char: "n",
		}),
		"output-folder": flags.string({
			description: messages.getMessage("flag_output_folder"),
			char: "o",
			required: true,
		}),
	};

	public async run(): Promise<unknown> {
		this.ux.startSpinner(messages.getMessage("starting_message"));
		const namespaces = await this.getNamespaces();
		for (const namespace of namespaces) {
			await this.generateTypingsForNamespace(
				namespace,
				this.flags["output-folder"]
			);
		}

		return this.ux.stopSpinner(messages.getMessage("done_message"));
	}

	private async fetchAllNamespaces(): Promise<string[]> {
		this.ux.setSpinnerStatus(messages.getMessage("fetching_namespaces"));
		return this.org
			.getConnection()
			.query(
				"SELECT NamespacePrefix FROM ApexClass WHERE NamespacePrefix != null  GROUP BY NamespacePrefix"
			)
			.then((result) => result.records)
			.then((records) => {
				const namespaces = [];
				// @ts-ignore
				for (const record of records) {
					namespaces.push(record.NamespacePrefix);
				}
				return namespaces;
			});
	}

	private async getNamespaces(): Promise<string[]> {
		if (this.flags.namespaces != null) {
			return this.flags.namespaces
				.split(",")
				.map((rawNamespace) => rawNamespace.trim());
		}
		return this.fetchAllNamespaces();
	}

	private async generateTypingsForNamespace(
		namespace: string,
		baseDir: string
	) {
		this.ux.setSpinnerStatus(
			messages
				.getMessage("generating_typings_message")
				.replace("{package}", namespace)
		);
		return this.org
			.getConnection()
			.query(
				`SELECT NamespacePrefix, Body, Name FROM ApexClass WHERE NamespacePrefix = '${namespace}'`
			)
			.then((result) => {
				if (result.records.length == 0) {
					this.ux.warn(
						messages
							.getMessage("package_without_classes")
							.replace("{package}", namespace)
					);
				}
				let packageBody = `// Generated by apex-typings-generator\nglobal class ${namespace} {\n`;
				for (const apexClass of result.records) {
					// @ts-ignore
					const body = apexClass.Body;
					// @ts-ignore
					namespace = apexClass.NamespacePrefix;
					if (body !== "(hidden)") {
						packageBody += body + "\n";
					}
				}
				packageBody += "\n}\n";
				return promises.writeFile(
					join(baseDir, `${namespace}.cls`),
					packageBody
				);
			});
	}
}
