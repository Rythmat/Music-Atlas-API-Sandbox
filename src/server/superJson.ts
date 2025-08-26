import SuperJSON from 'superjson';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isSwaggerResponse = (response: any) => {
  return !!response.openapi;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeResponse({ response }: { response?: any }) {
  if (
    response &&
    typeof response === 'object' &&
    !response.headers &&
    !isSwaggerResponse(response)
  ) {
    return new Response(SuperJSON.stringify(response));
  }
}
