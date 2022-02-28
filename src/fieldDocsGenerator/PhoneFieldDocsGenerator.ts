import BaseFieldDocsGenerator from "./BaseFieldDocsGenerator";

export default class PhoneFieldDocsGenerator extends BaseFieldDocsGenerator {
	generateBaseDescription(
		fieldDefinition,
		afterHeadline: string = ""
	): string {
		return super.generateBaseDescription(fieldDefinition, "(Phone)");
	}
}
