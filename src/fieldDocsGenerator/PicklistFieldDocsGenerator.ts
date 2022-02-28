import BaseFieldDocsGenerator from "./BaseFieldDocsGenerator";

export default class PicklistFieldDocsGenerator extends BaseFieldDocsGenerator {
	generateApexFieldDefinition(fieldDefinition): string {
		return `global String ${fieldDefinition.name};\n`;
	}

	generateDocs(fieldDefinition): string {
		let description =
			this.generateBaseDescription(fieldDefinition) +
			"\n\n## Values Developer names\n\n";
		for (const picklistValue of fieldDefinition.picklistValues) {
			description += `- ${picklistValue.value}\n`;
		}
		return (
			description +
			"\n*/\n" +
			this.generateApexFieldDefinition(fieldDefinition)
		);
	}
}
