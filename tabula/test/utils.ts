import { clone } from 'ramda';

// Clone apiResponse and type assert to Tabula.JsonApiResponse
function toJsonApiResponse(apiResponse: Tabula.ApiResponse) {
    const jsonApiResponse: Tabula.JsonApiResponse = <any>clone(apiResponse);
    jsonApiResponse.jsonBody = JSON.parse(jsonApiResponse.body);
    return jsonApiResponse;
}

export { toJsonApiResponse };
