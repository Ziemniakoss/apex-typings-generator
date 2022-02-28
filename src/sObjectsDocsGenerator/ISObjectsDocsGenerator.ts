import { DescribeSObjectResult } from "jsforce";

export default interface ISObjectsDocsGenerator {
	generateDocs(sObjectDescribe: DescribeSObjectResult): string;
}
