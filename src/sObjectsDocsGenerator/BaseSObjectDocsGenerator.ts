import ISObjectsDocsGenerator from "./ISObjectsDocsGenerator";
import { DescribeSObjectResult } from "jsforce";

const SKIPPED_REQUIRED_FIELDS = [
	"Id",
	"IsDeleted",
	"OwnerId",
	"CreatedDate",
	"CreatedById",
	"LastModifiedDate",
	"LastModifiedById",
	"SystemModstamp",
];
export default class BaseSObjectDocsGenerator
	implements ISObjectsDocsGenerator
{
	generateDocs(sObjectDescribe: DescribeSObjectResult): string {
		let description = `/*\n# ${sObjectDescribe.label}\n\n## Record Types\n\n`;
		for (const recordTypeInfo of sObjectDescribe.recordTypeInfos) {
			description += `- ${recordTypeInfo.developerName}\n`;
		}

		for (const field of sObjectDescribe.fields) {
			if (
				!field.nillable &&
				!SKIPPED_REQUIRED_FIELDS.includes(field.name)
			) {
				description += `- ${field.name}\n`;
			}
		}
		return description + "*/\n";
	}
}
