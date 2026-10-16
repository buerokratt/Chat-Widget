const sse = <T>(url: string, onMessage: (data: T) => void, onOpen?: () => void | Promise<void>): EventSource => {
  const eventSource = new EventSource(
    `${window._env_.NOTIFICATION_NODE_URL}/sse${url}`
  );

  eventSource.onmessage = (event: MessageEvent) => {
    const response = JSON.parse(event.data);

    if (response != undefined) {
      onMessage(response);
    }
  };

  eventSource.onopen = () => {
    Promise.resolve(onOpen?.()).catch(() => console.warn('SSE storage catch-up failed'));
    console.log("SSE connection opened, url:", url);
  };

  eventSource.onerror = () => {};

  return eventSource;
};

export default sse;
