import BaseFieldDocsGenerator from "./BaseFieldDocsGenerator";

export default class ReferenceFieldDocsGenerator extends BaseFieldDocsGenerator {
	generateApexFieldDefinition(fieldDefinition): string {
		const referencedTypes = fieldDefinition.referenceTo;
		let type = referencedTypes.length == 1 ? referencedTypes[0] : "SObject";
		const apiName = fieldDefinition.relationshipName;
		return `global ${type} ${apiName};\n`;
	}

	generateAdditionalDescription(fieldDefinition): string {
		const referencedTypes = fieldDefinition.referenceTo;
		if (referencedTypes.length == 1) {
			return "";
		}

		let description = "\n\n## Referenced Types\n\n";
		for (const type of referencedTypes) {
			description += `- ${type}\n`;
		}
		return description;
	}

	generateDocs(fieldDefinition): string {
		const apiName = fieldDefinition.name;
		return (
			this.generateBaseDescription(fieldDefinition) +
			"\n*/\n" +
			this.generateApexFieldDefinition(fieldDefinition) +
			"\n" +
			this.generateBaseDescription(fieldDefinition) +
			this.generateAdditionalDescription(fieldDefinition) +
			"\n*/\nglobal Id " +
			apiName +
			";"
		);
	}
}
