import IFieldDocsGenerator from "./fieldDocsGenerator/IFieldDocsGenerator";
import FormulaFieldDocsGenerator from "./fieldDocsGenerator/FormulaFieldDocsGenerator";
import ReferenceFieldDocsGenerator from "./fieldDocsGenerator/ReferenceFieldDocsGenerator";
import PicklistFieldDocsGenerator from "./fieldDocsGenerator/PicklistFieldDocsGenerator";
import PhoneFieldDocsGenerator from "./fieldDocsGenerator/PhoneFieldDocsGenerator";
import UrlFieldDocsGenerator from "./fieldDocsGenerator/UrlFieldDocsGenerator";
import BaseFieldDocsGenerator from "./fieldDocsGenerator/BaseFieldDocsGenerator";

export default class FieldDocsFactory {
	getFieldDocsGenerator(fieldDefinition): IFieldDocsGenerator {
		if (fieldDefinition.calculated) {
			return new FormulaFieldDocsGenerator();
		}
		switch (fieldDefinition.type) {
			case "reference":
				return new ReferenceFieldDocsGenerator();
			case "picklist":
			case "multipicklist":
			case "combobox":
				return new PicklistFieldDocsGenerator();
			case "phone":
				return new PhoneFieldDocsGenerator();
			case "url":
				return new UrlFieldDocsGenerator();
			default:
				return new BaseFieldDocsGenerator();
		}
	}
}
