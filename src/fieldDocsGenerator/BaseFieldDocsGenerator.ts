import IFieldDocsGenerator from "./IFieldDocsGenerator";

export default class BaseFieldDocsGenerator implements IFieldDocsGenerator {
	public static TYPE_TO_APEX_TYPE = {
		string: "String",
		id: "Id",
		textarea: "String",
		boolean: "Boolean",
		double: "Double",
		percent: "Double",
		address: "Address",
		url: "String",
		phone: "String",
		currency: "Decimal",
		int: "Integer",
		datetime: "Datetime",
		date: "Date",
		location: "Location",
		email: "String",
		long: "Long",
		time: "Time",
		multipicklist: "String",
		base64: "Blob",
		complexvalue: "Object", // TODO Better typings
		anyType: "Object", // TODO better typings
		encryptedstring: "String", // TODO  maybe better description
	};

	generateDocs(fieldDefinition): string {
		return (
			this.generateBaseDescription(fieldDefinition) +
			this.generateAdditionalDescription(fieldDefinition) +
			"\n*/\n" +
			this.generateApexFieldDefinition(fieldDefinition)
		);
	}

	generateAdditionalDescription(fieldDefinition): string {
		return "";
	}

	generateBaseDescription(fieldDefinition, afterHeadline = ""): string {
		let description = `/*\n# ${fieldDefinition.label} ${afterHeadline}`;
		const helpText = fieldDefinition["inlineHelpText"];
		if (helpText != null) {
			description += `\n\n${helpText}`;
		}

		return description;
	}

	generateApexFieldDefinition(fieldDefinition): string {
		const apexType =
			BaseFieldDocsGenerator.TYPE_TO_APEX_TYPE[fieldDefinition.type];
		return `global ${apexType} ${fieldDefinition.name};\n`;
	}
}
