import BaseFieldDocsGenerator from "./BaseFieldDocsGenerator";

export default class UrlFieldDocsGenerator extends BaseFieldDocsGenerator {
	generateBaseDescription(
		fieldDefinition,
		afterHeadline: string = ""
	): string {
		return super.generateBaseDescription(fieldDefinition, "(Url)");
	}
}
