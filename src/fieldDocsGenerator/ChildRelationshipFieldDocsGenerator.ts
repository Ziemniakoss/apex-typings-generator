import BaseFieldDocsGenerator from "./BaseFieldDocsGenerator";

export default class ChildRelationshipFieldDocsGenerator extends BaseFieldDocsGenerator {
	generateDocs(fieldDefinition): string {
		if (fieldDefinition.relationshipName == null) {
			return "";
		}
		return super.generateDocs(fieldDefinition);
	}

	generateBaseDescription(
		childRelationship,
		afterHeadline: string = ""
	): string {
		const relationshipName = childRelationship.relationshipName;
		if (relationshipName == null) {
			return "";
		}
		return (
			`/*\n# ${childRelationship.childSObject}.${childRelationship.field}\n\n` +
			`Cascade delete: ${childRelationship.cascadeDelete}\n` +
			`Restriceted delete: ${childRelationship.restrictedDelete}\n`
		);
	}

	generateApexFieldDefinition(fieldDefinition): string {
		return `global List<${fieldDefinition.childSObject}> ${fieldDefinition.relationshipName};\n`;
	}
}
