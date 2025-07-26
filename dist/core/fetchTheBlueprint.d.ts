import { UseTokenOption } from '../types';
export declare function fetchTheBlueprint(endpoint: string, token: string | null, retryGetToken?: () => Promise<string | null>, useToken?: UseTokenOption): Promise<Response | null>;
