import BaseFieldDocsGenerator from "./BaseFieldDocsGenerator";

export default class FormulaFieldDocsGenerator extends BaseFieldDocsGenerator {
	generateDocs(fieldDefinition): string {
		let descrption = this.generateBaseDescription(fieldDefinition);
		const formula = fieldDefinition.calculatedFormula;
		if (formula != null) {
			descrption += `\n\n ## Formula\n\n${formula}`;
		}
		return (
			descrption +
			"\n*/\n" +
			this.generateApexFieldDefinition(fieldDefinition)
		);
	}
}
